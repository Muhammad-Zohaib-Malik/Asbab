const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

 const createStripe = async (req, res) => {
  const { amount, phone } = req.body;
  if (!amount || !phone) {
    return res
      .status(400)
      .json({ error: "Amount and phone number are required" });
  }

  let customer;
  const doesCustomerExist = await stripe.customers.list({
    phone,
  });

  if (doesCustomerExist.data.length > 0) {
    customer = doesCustomerExist.data[0];
  } else {
    const newCustomer = await stripe.customers.create({
      phone,
    });
    customer = newCustomer;
  }

  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2024-06-20" }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100,
    currency: "usd",
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });
  res.status(200).json({
    clientSecret: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customerId: customer.id,
  });
};

const pay=async(req,res)=>{
  const { payment_method_id, payment_intent_id, customer_id, client_secret }=req.body;
  if (!payment_method_id || !payment_intent_id || !customer_id || !client_secret) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      { customer: customer_id },
    );

    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    res.status(200).json({
      success: true,
      message: "Payment successful",
      paymentIntent: result,
    });
}
module.exports = {
  createStripe,
};