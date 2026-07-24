import { Schema, model, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface IShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface IOrder extends Document {
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    productId: { type: String, required: true },
    name:      { type: String, required: true },
    image:     { type: String, required: true },
    price:     { type: Number, required: true, min: 0 },
    quantity:  { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const addressSchema = new Schema<IShippingAddress>(
  {
    fullName: { type: String, required: true },
    email:    { type: String, required: true },
    phone:    { type: String, required: true },
    line1:    { type: String, required: true },
    line2:    { type: String },
    city:     { type: String, required: true },
    state:    { type: String, required: true },
    zip:      { type: String, required: true },
    country:  { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    orderNumber:     { type: String, required: true, unique: true, index: true },
    items:           [orderItemSchema],
    shippingAddress: { type: addressSchema, required: true },
    subtotal:        { type: Number, required: true, min: 0 },
    shipping:        { type: Number, default: 0 },
    discount:        { type: Number, default: 0 },
    total:           { type: Number, required: true, min: 0 },
    status:          {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'confirmed',
    },
    paymentMethod:   { type: String, default: 'card' },
  },
  { timestamps: true }
);

// Auto-generate order number before save
orderSchema.pre('validate', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `GUFU-${Date.now().toString(36).toUpperCase().slice(-6)}`;
  }
  next();
});

export const Order = model<IOrder>('Order', orderSchema);
