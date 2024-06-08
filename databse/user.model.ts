import { Schema, models, model, Document } from "mongoose";

export interface IUser extends Document {
  clerkId: String;
  name: String;
  username: String;
  email: String;
  password?: String;
  bio?: String;
  picture: String;
  location?: String;
  portfolioWebsite?: String;
  reputation?: Number;
  saved: Schema.Types.ObjectId[];
  joinedAt: Date;
}

const UserSchema = new Schema({
  clerkId: { type: String, required: true },
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String },
  picture: { type: String, required: true },
  location: { type: String },
  portfolioWebsite: { type: String },
  reputation: { type: Number, default: 0 },
  saved: [{ type: Schema.Types.ObjectId, ref: "Question" }],
  joinedAt: { type: Date, default: Date.now },
});

// Check if the model alredy exists, if not create it
const User = models.User || model("User", UserSchema);

export default User;
