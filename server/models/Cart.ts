import { Schema, model, Document, Types } from 'mongoose';

export interface ICartItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  quantity: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    productId:     { type: String, required: true },
    name:          { type: String, required: true },
    image:         { type: String, required: true },
    price:         { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount:      { type: Number, default: 0 },
    quantity:      { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    items:  [cartItemSchema],
  },
  { timestamps: true }
);

export const Cart = model<ICart>('Cart', cartSchema);
