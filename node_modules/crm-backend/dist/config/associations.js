"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Brand_1 = require("../modules/inventory/models/Brand");
const Category_1 = require("../modules/inventory/models/Category");
const Product_1 = require("../modules/inventory/models/Product");
const Lead_1 = require("../modules/crm/models/Lead");
const LeadActivity_1 = require("../modules/crm/models/LeadActivity");
const Customer_1 = require("../modules/crm/models/Customer");
const CustomerActivity_1 = require("../modules/crm/models/CustomerActivity");
const InventoryMovement_1 = require("../modules/inventory/models/InventoryMovement");
const InventorySetting_1 = require("../modules/inventory/models/InventorySetting");
const BusinessAccount_1 = require("../modules/b2b/models/BusinessAccount");
const Order_1 = require("../modules/orders/models/Order");
const OrderItem_1 = require("../modules/orders/models/OrderItem");
const OrderEvent_1 = require("../modules/orders/models/OrderEvent");
const Invoice_1 = require("../modules/orders/models/Invoice");
const Refund_1 = require("../modules/orders/models/Refund");
Product_1.Product.belongsTo(Category_1.Category, { as: "categoryDetails", foreignKey: "category" });
Category_1.Category.hasMany(Product_1.Product, { foreignKey: "category" });
Product_1.Product.belongsTo(Brand_1.Brand, { as: "brandDetails", foreignKey: "brand" });
Brand_1.Brand.hasMany(Product_1.Product, { foreignKey: "brand" });
Lead_1.Lead.belongsTo(User_1.User, { as: "assignedUser", foreignKey: "assignedTo" });
User_1.User.hasMany(Lead_1.Lead, { foreignKey: "assignedTo" });
LeadActivity_1.LeadActivity.belongsTo(Lead_1.Lead, { foreignKey: "lead", onDelete: "CASCADE" });
Lead_1.Lead.hasMany(LeadActivity_1.LeadActivity, { foreignKey: "lead", onDelete: "CASCADE" });
LeadActivity_1.LeadActivity.belongsTo(User_1.User, { as: "creator", foreignKey: "createdBy" });
CustomerActivity_1.CustomerActivity.belongsTo(Customer_1.Customer, {
    foreignKey: "customer",
    onDelete: "CASCADE"
});
Customer_1.Customer.hasMany(CustomerActivity_1.CustomerActivity, {
    foreignKey: "customer",
    onDelete: "CASCADE"
});
CustomerActivity_1.CustomerActivity.belongsTo(User_1.User, { as: "creator", foreignKey: "createdBy" });
InventoryMovement_1.InventoryMovement.belongsTo(Product_1.Product, {
    as: "productDetails",
    foreignKey: "productId",
    onDelete: "RESTRICT"
});
Product_1.Product.hasMany(InventoryMovement_1.InventoryMovement, {
    as: "inventoryMovements",
    foreignKey: "productId"
});
InventoryMovement_1.InventoryMovement.belongsTo(User_1.User, {
    as: "actor",
    foreignKey: "createdBy",
    onDelete: "RESTRICT"
});
InventorySetting_1.InventorySetting.belongsTo(Product_1.Product, {
    foreignKey: "productId",
    onDelete: "CASCADE"
});
Product_1.Product.hasOne(InventorySetting_1.InventorySetting, {
    as: "inventorySetting",
    foreignKey: "productId",
    onDelete: "CASCADE"
});
Order_1.Order.belongsTo(Customer_1.Customer, { as: "customer", foreignKey: "customerId" });
Customer_1.Customer.hasMany(Order_1.Order, { foreignKey: "customerId" });
Order_1.Order.belongsTo(BusinessAccount_1.BusinessAccount, {
    as: "businessAccount",
    foreignKey: "businessAccountId"
});
BusinessAccount_1.BusinessAccount.hasMany(Order_1.Order, { foreignKey: "businessAccountId" });
Order_1.Order.belongsTo(User_1.User, { as: "creator", foreignKey: "createdBy" });
Order_1.Order.hasMany(OrderItem_1.OrderItem, {
    as: "items",
    foreignKey: "orderId",
    onDelete: "CASCADE"
});
OrderItem_1.OrderItem.belongsTo(Order_1.Order, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem_1.OrderItem.belongsTo(Product_1.Product, { as: "product", foreignKey: "productId" });
Order_1.Order.hasMany(OrderEvent_1.OrderEvent, {
    as: "events",
    foreignKey: "orderId",
    onDelete: "CASCADE"
});
OrderEvent_1.OrderEvent.belongsTo(Order_1.Order, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderEvent_1.OrderEvent.belongsTo(User_1.User, { as: "actor", foreignKey: "createdBy" });
Order_1.Order.hasOne(Invoice_1.Invoice, {
    as: "invoice",
    foreignKey: "orderId",
    onDelete: "CASCADE"
});
Invoice_1.Invoice.belongsTo(Order_1.Order, { as: "order", foreignKey: "orderId" });
Order_1.Order.hasMany(Refund_1.Refund, {
    as: "refunds",
    foreignKey: "orderId",
    onDelete: "CASCADE"
});
Refund_1.Refund.belongsTo(Order_1.Order, { foreignKey: "orderId", onDelete: "CASCADE" });
Refund_1.Refund.belongsTo(User_1.User, { as: "creator", foreignKey: "createdBy" });
