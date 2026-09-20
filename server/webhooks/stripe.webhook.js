import userModel from "../models/user.model.js";
import paymentSchema from "../models/payment.model.js"; // ✅ missing import fix
import { stripe } from "../services/stripe.service.js";

export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  // ✅ 1. Verify Stripe Signature
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook Signature Verification Failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ✅ 2. Handle Events
  try {
    // ===============================
    // ✅ PAYMENT SUCCESS
    // ===============================
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      // ✅ Idempotency check
      const existingPayment = await paymentSchema.findOne({
        stripeSessionId: session.id,
      });

      if (existingPayment) {
        return res.status(200).json({ received: true });
      }

      // ✅ Safe access
      const userId = session.client_reference_id;
      const planType = session.metadata?.planType || "free";

      if (!userId) {
        console.error("❌ User ID not found in session");
        return res.status(400).send("User ID missing");
      }

      const planLimits = {
        silver: 50,
        gold: 100,
      };

      // ✅ Plan expiry (30 days)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      const userObj = await userModel.findById(userId);
      const userEmail = session.customer_details?.email || session.customer_email || userObj?.email;

      // ✅ Run both operations together
      await Promise.all([
        // Update User
        userModel.findByIdAndUpdate(userId, {
          plan: planType,
          maxLimit: planLimits[planType] || 3,
          analysisCount: 0,
          planExpiry: expiryDate,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
        }),

        // Create Payment Record
        paymentSchema.create({
          user: userId,
          userId: userId,
          email: userEmail,
          stripeSessionId: session.id,
          stripeCustomerId: session.customer,
          subscriptionId: session.subscription,
          amount: session.amount_total / 100,
          currency: session.currency,
          status: "completed",
          plan: planType,
          planType,
        }),
      ]);

      console.log(`✅ Payment processed for user: ${userId}`);
    }

    // ===============================
    // ❌ SUBSCRIPTION CANCEL
    // ===============================
    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;

      await userModel.findOneAndUpdate(
        { subscriptionId: subscription.id },
        {
          plan: "free",
          maxLimit: 3,
          analysisCount: 0,
        }
      );

      console.log(`⚠️ Subscription cancelled: ${subscription.id}`);
    }

    // ===============================
    // 🔁 PAYMENT FAILED (BONUS)
    // ===============================
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object;

      await userModel.findOneAndUpdate(
        { stripeCustomerId: invoice.customer },
        {
          plan: "free",
          maxLimit: 3,
        }
      );

      console.log(`❌ Payment failed for customer: ${invoice.customer}`);
    }

    // ===============================
    // 💰 PAYMENT SUCCESS (RENEWAL)
    // ===============================
    if (event.type === "invoice.paid") {
      const invoice = event.data.object;

      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);

      await userModel.findOneAndUpdate(
        { stripeCustomerId: invoice.customer },
        {
          planExpiry: expiryDate,
        }
      );

      console.log(`🔁 Subscription renewed: ${invoice.customer}`);
    }

  } catch (error) {
    console.error("❌ Critical Webhook Error:", error.message);
    return res.status(500).send("Internal Server Error");
  }

  // ✅ Always respond to Stripe
  res.status(200).json({ received: true });
};