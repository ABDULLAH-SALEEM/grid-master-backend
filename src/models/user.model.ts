import mongoose, { Document, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isSocialLogin: boolean;
}

const userSchema: Schema<UserDocument> = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    isSocialLogin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongoosePaginate);
const UserModelName = "User";

const UserModel = mongoose.model<UserDocument>(UserModelName, userSchema);

export { UserModel, UserModelName, UserDocument };
