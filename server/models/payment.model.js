import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    email: { type: String },
    stripeSessionId: { type: String, required: true },
    stripeCustomerId: { type: String },
    subscriptionId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, uppercase: true, default: "USD" },
    status: {
      type: String,
      enum: ["succeeded", "completed", "pending", "failed"],
      default: "completed",
    },
    plan: { type: String },
    planType: { type: String },
    receiptUrl: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model("Payment", paymentSchema);
// export default mongoose.model("User", userSchema);