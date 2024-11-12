const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 3000;

dotenv.config();

const userRouter = require("./src/routes/user.route");
const foodRouter = require("./src/routes/food.route");
const cartRouter = require("./src/routes/cart.route");
const checkoutRouter = require("./src/routes/checkout.route");
const orderRouter = require("./src/routes/order.route");
const favoriteRouter = require("./src/routes/favorite.route");
const reviewRouter = require("./src/routes/review.route");
const promotionRouter = require("./src/routes/promotion.route");

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.use("/api/user", userRouter);
app.use("/api/food", foodRouter);
app.use("/api/cart", cartRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/order", orderRouter);
app.use("/api/favorite", favoriteRouter);
app.use("/api/review", reviewRouter);
app.use("/api/promotion", promotionRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
