"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const lead_routes_1 = __importDefault(require("./modules/crm/routes/lead.routes"));
const customer_routes_1 = __importDefault(require("./modules/crm/routes/customer.routes"));
const business_account_routes_1 = __importDefault(require("./modules/b2b/routes/business-account.routes"));
const category_routes_1 = __importDefault(require("./modules/inventory/routes/category.routes"));
const brand_routes_1 = __importDefault(require("./modules/inventory/routes/brand.routes"));
const product_routes_1 = __importDefault(require("./modules/inventory/routes/product.routes"));
const inventory_routes_1 = __importDefault(require("./modules/inventory/routes/inventory.routes"));
const error_middleware_1 = require("./middleware/error.middleware");
const order_routes_1 = __importDefault(require("./modules/orders/routes/order.routes"));
const payment_routes_1 = __importDefault(require("./modules/payments/routes/payment.routes"));
const payment_controller_1 = require("./modules/payments/controllers/payment.controller");
const public_catalog_routes_1 = __importDefault(require("./modules/inventory/routes/public-catalog.routes"));
const cart_routes_1 = __importDefault(require("./modules/cart/routes/cart.routes"));
const rateLimit_middleware_1 = require("./middleware/rateLimit.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(rateLimit_middleware_1.globalLimiter);
app.post("/api/payments/webhook", express_1.default.raw({ type: "application/json" }), payment_controller_1.paymentController.webhook.bind(payment_controller_1.paymentController));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use("/api/auth/login", rateLimit_middleware_1.authLimiter);
app.use("/api/auth/customer/login", rateLimit_middleware_1.authLimiter);
app.use("/api/public", rateLimit_middleware_1.publicApiLimiter);
app.use("/api/public", public_catalog_routes_1.default);
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/dashboard", dashboard_routes_1.default);
app.use("/api/leads", lead_routes_1.default);
app.use("/api/customers", customer_routes_1.default);
app.use("/api/b2b/accounts", business_account_routes_1.default);
app.use("/api/categories", category_routes_1.default);
app.use("/api/brands", brand_routes_1.default);
app.use("/api/products", product_routes_1.default);
app.use("/api/inventory", inventory_routes_1.default);
app.use("/api/orders", order_routes_1.default);
app.use("/api/payments", payment_routes_1.default);
app.use("/api/cart", cart_routes_1.default);
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "CRM API Running"
    });
});
app.use(error_middleware_1.errorHandler);
exports.default = app;
