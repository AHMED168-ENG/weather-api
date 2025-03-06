import mongoose, { Schema, Document } from 'mongoose';

export interface IFavorite extends Document {
  userId: string;
  city: string;
}

const FavoriteSchema: Schema = new Schema({
  userId: { type: String, required: true },
  city: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema);
