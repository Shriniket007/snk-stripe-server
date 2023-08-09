const express = require("express");
var cors = require("cors");
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/checkout", async (req, res) => {
  // console.log(req.body);
  const items = req.body.items;
  let lineItems = [];

  items.forEach((item) => {
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
        },
        unit_amount: Math.round(item.price) * 100,
      },
      quantity: item.quantity,
    });
  });

  // console.log(lineItems[0].price_data.product_data.name);

  // [
  //   {
  //     price_data: {
  //       currency: "inr",
  //       product_data: [Object],
  //       unit_amount: 22.3,
  //     },
  //     quantity: 1,
  //   },
  //   {
  //     price_data: {
  //       currency: "inr",
  //       product_data: [Object],
  //       unit_amount: 55.99,
  //     },
  //     quantity: 1,
  //   },
  // ];

  const session = await stripe.checkout.sessions.create({
    line_items: lineItems,
    mode: "payment",
    success_url: "https://snk-amazon.vercel.app/success",
    cancel_url: "https://snk-amazon.vercel.app/cancel",
  });

  res.send(
    JSON.stringify({
      url: session.url,
    })
  );
});

app.listen(4000, () => console.log("Listening on port 4000!"));
