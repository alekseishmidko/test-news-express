import mongoose, { Document, Schema } from "mongoose";

interface INews extends Document {
  title: string;
  content: string;
  author: mongoose.Schema.Types.ObjectId;
  publishDate: Date;
  isPublished: boolean;
  image: string;
}

const NewsSchema: Schema<INews> = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  publishDate: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: false },
  image: { type: String },
});

export default mongoose.model<INews>("News", NewsSchema);
