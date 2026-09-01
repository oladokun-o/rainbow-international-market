// Cached Mongoose connection. Serverless invocations reuse a single pooled
// connection across warm starts via a module/global cache, so we never open a
// new connection per request.
import mongoose from 'mongoose';
import { env } from '$env/dynamic/private';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalCache = globalThis as typeof globalThis & { _rimMongoose?: MongooseCache };

const cached: MongooseCache =
  globalCache._rimMongoose ?? (globalCache._rimMongoose = { conn: null, promise: null });

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const uri = env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI environment variable is not set.');

    // `as ConnectOptions` — the object is valid at runtime; recent @types/node
    // makes the inherited TLS fields of ConnectOptions look required.
    const options = {
      dbName: env.MONGODB_DB ?? 'rainbow',
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2, // keep connections warm between invocations
      // Generous enough for a cold mongodb+srv resolution + TLS handshake
      // (DNS SRV lookup can be slow on the first connect from a new network).
      connectTimeoutMS: 15000,
      serverSelectionTimeoutMS: 15000
    } as mongoose.ConnectOptions;

    cached.promise = mongoose
      .connect(uri, options)
      .catch((err) => {
        cached.promise = null; // allow retry on next request
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
