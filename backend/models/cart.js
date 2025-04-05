import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", require: true },
  products: [
    {
      _id: false,
      product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        require: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema);
export default Cart;
