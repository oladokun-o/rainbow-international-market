import mongoose, { Schema, type Document } from 'mongoose';

export type UserRole = 'owner' | 'manager' | 'staff';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['owner', 'manager', 'staff'], default: 'staff' }
  },
  { timestamps: true }
);

export const User: mongoose.Model<IUser> =
  (mongoose.models['User'] as mongoose.Model<IUser>) ||
  mongoose.model<IUser>('User', UserSchema);
