import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  matchPassword(enteredPassword: string): Promise<boolean>;
}

const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

UserSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model<IUser>("User", UserSchema);
