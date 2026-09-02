import mongoose, { Schema, type Document } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'collected' | 'cancelled';

export interface IOrderItem {
  productId: string; // Sanity document _id, snapshot
  slug?: string;
  name: string; // snapshot at time of order
  unit?: string;
  quantity: number;
  unitPriceCents: number; // recomputed server-side from Sanity, never trusted from the client
  lineTotalCents: number;
}

export interface IOrderHistoryEntry {
  status: OrderStatus;
  at: Date;
  note?: string;
}

export interface IOrder extends Document {
  orderRef: string; // short human code, unique, e.g. "RIM-7GK2Q"
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: IOrderItem[];
  subtotalCents: number;
  totalCents: number; // == subtotalCents today (no tax/fees); kept separate for future-proofing
  status: OrderStatus;
  history: IOrderHistoryEntry[];
  pickupDate: string; // ISO 'YYYY-MM-DD'
  pickupNotes?: string;
  notified: {
    email: boolean;
    whatsapp: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    slug: { type: String },
    name: { type: String, required: true },
    unit: { type: String },
    quantity: { type: Number, required: true, min: 1 },
    unitPriceCents: { type: Number, required: true, min: 0 },
    lineTotalCents: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const HistorySchema = new Schema<IOrderHistoryEntry>(
  {
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ready', 'collected', 'cancelled'],
      required: true
    },
    at: { type: Date, required: true },
    note: { type: String }
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    orderRef: { type: String, required: true, unique: true, uppercase: true },
    customer: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, lowercase: true, trim: true },
      phone: { type: String, required: true, trim: true }
    },
    items: { type: [OrderItemSchema], required: true },
    subtotalCents: { type: Number, required: true, min: 0 },
    totalCents: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'ready', 'collected', 'cancelled'],
      default: 'pending'
    },
    history: { type: [HistorySchema], default: [] },
    pickupDate: { type: String, required: true },
    pickupNotes: { type: String },
    notified: {
      email: { type: Boolean, default: false },
      whatsapp: { type: Boolean, default: false }
    }
  },
  { timestamps: true }
);

OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'customer.email': 1 });

export const Order: mongoose.Model<IOrder> =
  (mongoose.models['Order'] as mongoose.Model<IOrder>) ||
  mongoose.model<IOrder>('Order', OrderSchema);
