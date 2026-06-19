import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import dashboardRoutes
from "./routes/dashboard.routes";
import leadRoutes from "./modules/crm/routes/lead.routes";
import customerRoutes from "./modules/crm/routes/customer.routes";
import businessAccountRoutes from "./modules/b2b/routes/business-account.routes";
import categoryRoutes from "./modules/inventory/routes/category.routes";
import brandRoutes from "./modules/inventory/routes/brand.routes";
import productRoutes from "./modules/inventory/routes/product.routes";
import inventoryRoutes from "./modules/inventory/routes/inventory.routes";
import { errorHandler } from "./middleware/error.middleware";
import orderRoutes from "./modules/orders/routes/order.routes";
import paymentRoutes from "./modules/payments/routes/payment.routes";
import { paymentController } from "./modules/payments/controllers/payment.controller";
import {
  authLimiter,
  globalLimiter,
  publicApiLimiter
} from "./middleware/rateLimit.middleware";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(helmet());

app.use(morgan("dev"));
app.use(globalLimiter);

app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  paymentController.webhook.bind(paymentController)
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/customer/login", authLimiter);
app.use("/api/public", publicApiLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/b2b/accounts", businessAccountRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "CRM API Running"
  });
});

app.use(errorHandler);

export default app;
