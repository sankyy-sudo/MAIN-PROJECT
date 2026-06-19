import { User } from "../models/User";
import { Brand } from "../modules/inventory/models/Brand";
import { Category } from "../modules/inventory/models/Category";
import { Product } from "../modules/inventory/models/Product";
import { Lead } from "../modules/crm/models/Lead";
import { LeadActivity } from "../modules/crm/models/LeadActivity";
import { Customer } from "../modules/crm/models/Customer";
import { CustomerActivity } from "../modules/crm/models/CustomerActivity";
import { InventoryMovement } from "../modules/inventory/models/InventoryMovement";
import { InventorySetting } from "../modules/inventory/models/InventorySetting";
import { BusinessAccount } from "../modules/b2b/models/BusinessAccount";
import { Order } from "../modules/orders/models/Order";
import { OrderItem } from "../modules/orders/models/OrderItem";
import { OrderEvent } from "../modules/orders/models/OrderEvent";
import { Invoice } from "../modules/orders/models/Invoice";
import { Refund } from "../modules/orders/models/Refund";

Product.belongsTo(Category, { as: "categoryDetails", foreignKey: "category" });
Category.hasMany(Product, { foreignKey: "category" });

Product.belongsTo(Brand, { as: "brandDetails", foreignKey: "brand" });
Brand.hasMany(Product, { foreignKey: "brand" });

Lead.belongsTo(User, { as: "assignedUser", foreignKey: "assignedTo" });
User.hasMany(Lead, { foreignKey: "assignedTo" });

LeadActivity.belongsTo(Lead, { foreignKey: "lead", onDelete: "CASCADE" });
Lead.hasMany(LeadActivity, { foreignKey: "lead", onDelete: "CASCADE" });
LeadActivity.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

CustomerActivity.belongsTo(Customer, {
  foreignKey: "customer",
  onDelete: "CASCADE"
});
Customer.hasMany(CustomerActivity, {
  foreignKey: "customer",
  onDelete: "CASCADE"
});
CustomerActivity.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

InventoryMovement.belongsTo(Product, {
  as: "productDetails",
  foreignKey: "productId",
  onDelete: "RESTRICT"
});
Product.hasMany(InventoryMovement, {
  as: "inventoryMovements",
  foreignKey: "productId"
});
InventoryMovement.belongsTo(User, {
  as: "actor",
  foreignKey: "createdBy",
  onDelete: "RESTRICT"
});

InventorySetting.belongsTo(Product, {
  foreignKey: "productId",
  onDelete: "CASCADE"
});
Product.hasOne(InventorySetting, {
  as: "inventorySetting",
  foreignKey: "productId",
  onDelete: "CASCADE"
});

Order.belongsTo(Customer, { as: "customer", foreignKey: "customerId" });
Customer.hasMany(Order, { foreignKey: "customerId" });
Order.belongsTo(BusinessAccount, {
  as: "businessAccount",
  foreignKey: "businessAccountId"
});
BusinessAccount.hasMany(Order, { foreignKey: "businessAccountId" });
Order.belongsTo(User, { as: "creator", foreignKey: "createdBy" });

Order.hasMany(OrderItem, {
  as: "items",
  foreignKey: "orderId",
  onDelete: "CASCADE"
});
OrderItem.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderItem.belongsTo(Product, { as: "product", foreignKey: "productId" });

Order.hasMany(OrderEvent, {
  as: "events",
  foreignKey: "orderId",
  onDelete: "CASCADE"
});
OrderEvent.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });
OrderEvent.belongsTo(User, { as: "actor", foreignKey: "createdBy" });

Order.hasOne(Invoice, {
  as: "invoice",
  foreignKey: "orderId",
  onDelete: "CASCADE"
});
Invoice.belongsTo(Order, { as: "order", foreignKey: "orderId" });

Order.hasMany(Refund, {
  as: "refunds",
  foreignKey: "orderId",
  onDelete: "CASCADE"
});
Refund.belongsTo(Order, { foreignKey: "orderId", onDelete: "CASCADE" });
Refund.belongsTo(User, { as: "creator", foreignKey: "createdBy" });
