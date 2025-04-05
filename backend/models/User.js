import mongoose from "mongoose";
const homeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    image: { type: String },
  },
  { timestamps: true, Collection: "User" }
);
const User = mongoose.model("User", homeSchema);
export default User;
