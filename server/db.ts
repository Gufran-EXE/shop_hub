import mongoose from 'mongoose';

// Cache the connection so hot-reload doesn't open multiple connections
let cached: typeof mongoose | null = null;

export async function connectDB(): Promise<void> {
  if (cached) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

  cached = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000,
  });

  console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected');
    cached = null;
  });
}
