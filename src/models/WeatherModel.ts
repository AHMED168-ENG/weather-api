import { Schema, model, Document } from 'mongoose';

export interface IWeather extends Document {
  city: string;
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
  updatedAt: Date;
}

const WeatherSchema = new Schema<IWeather>(
  {
    city: { type: String, required: true, unique: true },
    temperature: { type: Number, required: true },
    humidity: { type: Number, required: true },
    windSpeed: { type: Number, required: true },
    condition: { type: String, required: true },
  },
  { timestamps: { updatedAt: true, createdAt: false } }
);

export default model<IWeather>('Weather', WeatherSchema);
