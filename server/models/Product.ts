import { Schema, model, Document } from 'mongoose';

export interface IProductReview {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  verified: boolean;
}

export interface IProductSpec {
  label: string;
  value: string;
}

export interface IProduct extends Document {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  category: string;
  isDeal: boolean;
  dealTimer?: number;
  inStock: boolean;
  features: string[];
  colors?: string[];
  sizes?: string[];
  specs?: IProductSpec[];
  reviews?: IProductReview[];
}

const reviewSchema = new Schema<IProductReview>({
  id:       { type: String, required: true },
  author:   { type: String, required: true },
  avatar:   { type: String, required: true },
  rating:   { type: Number, required: true, min: 1, max: 5 },
  date:     { type: String, required: true },
  title:    { type: String, required: true },
  body:     { type: String, required: true },
  verified: { type: Boolean, default: false },
}, { _id: false });

const specSchema = new Schema<IProductSpec>({
  label: { type: String, required: true },
  value: { type: String, required: true },
}, { _id: false });

const productSchema = new Schema<IProduct>(
  {
    id:            { type: String, required: true, unique: true, index: true },
    name:          { type: String, required: true },
    description:   { type: String, required: true },
    price:         { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true, min: 0 },
    discount:      { type: Number, default: 0, min: 0, max: 100 },
    rating:        { type: Number, default: 0, min: 0, max: 5 },
    reviewsCount:  { type: Number, default: 0 },
    image:         { type: String, required: true },
    images:        [{ type: String }],
    category:      { type: String, required: true, index: true },
    isDeal:        { type: Boolean, default: false, index: true },
    dealTimer:     { type: Number },
    inStock:       { type: Boolean, default: true, index: true },
    features:      [{ type: String }],
    colors:        [{ type: String }],
    sizes:         [{ type: String }],
    specs:         [specSchema],
    reviews:       [reviewSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Text index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

export const Product = model<IProduct>('Product', productSchema);
