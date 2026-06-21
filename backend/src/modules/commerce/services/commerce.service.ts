import { Op } from "sequelize";
import { Cart } from "../../cart/models/Cart";
import { CartItem } from "../../cart/models/CartItem";
import { Product } from "../../inventory/models/Product";
import { CommerceSetting, CommerceSettingGroup } from "../models/CommerceSetting";
import { Coupon, CouponDiscountType } from "../models/Coupon";
import { ShippingRule } from "../models/ShippingRule";
import { TaxSetting } from "../models/TaxSetting";

const money = (value: number) => Number(value.toFixed(2));
const truthy = (value: unknown, fallback = true) =>
  value === undefined ? fallback : value === true || value === "true";

export interface CommerceQuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class CommerceService {
  async getCartQuote(input: {
    customerId?: string;
    sessionId?: string;
    couponCode?: string;
    region?: string;
  }) {
    const cart = await Cart.findOne({
      where: input.customerId ? { customerId: input.customerId } : { sessionId: input.sessionId },
      include: [{ model: CartItem, as: "items" }]
    });

    const items = ((cart as any)?.items || []) as CartItem[];
    return this.quote({
      items: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice)
      })),
      couponCode: input.couponCode,
      region: input.region
    });
  }

  async quote(input: {
    items: CommerceQuoteItem[];
    couponCode?: string;
    region?: string;
  }) {
    if (!input.items?.length) {
      return {
        subtotal: 0,
        discountAmount: 0,
        taxAmount: 0,
        shippingAmount: 0,
        totalAmount: 0,
        coupon: null,
        shippingRule: null,
        taxSetting: null
      };
    }

    const subtotal = money(
      input.items.reduce(
        (sum, item) => sum + Number(item.unitPrice) * Number(item.quantity),
        0
      )
    );
    const coupon = input.couponCode
      ? await this.getValidCoupon(input.couponCode, subtotal)
      : null;
    const discountAmount = coupon
      ? this.calculateCouponDiscount(coupon, subtotal)
      : 0;
    const taxableAmount = Math.max(subtotal - discountAmount, 0);
    const taxSetting = await this.resolveTaxSetting(input.region);
    const taxAmount = taxSetting
      ? money((taxableAmount * Number(taxSetting.rate)) / 100)
      : 0;
    const shippingRule = await this.resolveShippingRule(taxableAmount, input.region);
    const shippingAmount = shippingRule
      ? this.calculateShipping(shippingRule, taxableAmount)
      : 0;

    return {
      subtotal,
      discountAmount,
      taxAmount,
      shippingAmount,
      totalAmount: money(taxableAmount + taxAmount + shippingAmount),
      coupon: coupon
        ? { id: coupon.id, code: coupon.code, discountType: coupon.discountType }
        : null,
      shippingRule,
      taxSetting
    };
  }

  async getValidCoupon(code: string, subtotal: number) {
    const coupon = await Coupon.findOne({
      where: { code: code.trim().toUpperCase(), isActive: true }
    });
    if (!coupon) throw new Error("Coupon code is invalid");

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) {
      throw new Error("Coupon is not active yet");
    }
    if (coupon.endsAt && coupon.endsAt < now) {
      throw new Error("Coupon has expired");
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit reached");
    }
    if (subtotal < Number(coupon.minSubtotal || 0)) {
      throw new Error("Cart subtotal does not meet coupon minimum");
    }
    return coupon;
  }

  calculateCouponDiscount(coupon: Coupon, subtotal: number) {
    const raw =
      coupon.discountType === CouponDiscountType.PERCENT
        ? (subtotal * Number(coupon.value)) / 100
        : Number(coupon.value);
    const capped = coupon.maxDiscount
      ? Math.min(raw, Number(coupon.maxDiscount))
      : raw;
    return money(Math.min(capped, subtotal));
  }

  async resolveTaxSetting(region = "DEFAULT") {
    return (
      (await TaxSetting.findOne({ where: { region, isActive: true } })) ||
      TaxSetting.findOne({ where: { isDefault: true, isActive: true } })
    );
  }

  async resolveShippingRule(subtotal: number, region = "DEFAULT") {
    return (
      (await ShippingRule.findOne({
        where: {
          region,
          isActive: true,
          minSubtotal: { [Op.lte]: subtotal },
          [Op.or]: [{ maxSubtotal: null }, { maxSubtotal: { [Op.gte]: subtotal } }]
        },
        order: [["minSubtotal", "DESC"]]
      })) ||
      ShippingRule.findOne({
        where: {
          region: "DEFAULT",
          isActive: true,
          minSubtotal: { [Op.lte]: subtotal },
          [Op.or]: [{ maxSubtotal: null }, { maxSubtotal: { [Op.gte]: subtotal } }]
        },
        order: [["minSubtotal", "DESC"]]
      })
    );
  }

  calculateShipping(rule: ShippingRule, subtotal: number) {
    if (rule.freeShippingThreshold && subtotal >= Number(rule.freeShippingThreshold)) {
      return 0;
    }
    return money(Number(rule.baseFee || 0));
  }

  async incrementCouponUsage(code?: string) {
    if (!code) return;
    await Coupon.increment("usedCount", {
      by: 1,
      where: { code: code.trim().toUpperCase() }
    });
  }

  listCoupons() {
    return Coupon.findAll({ order: [["createdAt", "DESC"]] });
  }

  createCoupon(data: Partial<Coupon>) {
    return Coupon.create({
      ...data,
      minSubtotal: Number(data.minSubtotal || 0),
      value: Number(data.value || 0),
      maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : null,
      usageLimit: data.usageLimit ? Number(data.usageLimit) : null,
      isActive: truthy(data.isActive)
    } as any);
  }

  listShippingRules() {
    return ShippingRule.findAll({ order: [["region", "ASC"], ["minSubtotal", "ASC"]] });
  }

  createShippingRule(data: Partial<ShippingRule>) {
    return ShippingRule.create({
      ...data,
      baseFee: Number(data.baseFee || 0),
      minSubtotal: Number(data.minSubtotal || 0),
      maxSubtotal: data.maxSubtotal ? Number(data.maxSubtotal) : null,
      freeShippingThreshold: data.freeShippingThreshold
        ? Number(data.freeShippingThreshold)
        : null,
      isActive: truthy(data.isActive)
    } as any);
  }

  listTaxSettings() {
    return TaxSetting.findAll({ order: [["isDefault", "DESC"], ["region", "ASC"]] });
  }

  createTaxSetting(data: Partial<TaxSetting>) {
    return TaxSetting.create({
      ...data,
      rate: Number(data.rate || 0),
      isDefault: truthy(data.isDefault, false),
      isActive: truthy(data.isActive)
    } as any);
  }

  async upsertSetting(group: CommerceSettingGroup, key: string, value: string) {
    const [setting] = await CommerceSetting.findOrCreate({
      where: { group, key },
      defaults: { group, key, value }
    });
    if (setting.value !== value) await setting.update({ value });
    return setting;
  }

  listSettings(group?: CommerceSettingGroup) {
    return CommerceSetting.findAll({
      where: group ? { group } : {},
      order: [["group", "ASC"], ["key", "ASC"]]
    });
  }

  async deleteByModel(model: "coupon" | "shipping" | "tax", id: string) {
    const map: Record<"coupon" | "shipping" | "tax", any> = {
      coupon: Coupon,
      shipping: ShippingRule,
      tax: TaxSetting
    };
    const record = await map[model].findByPk(id);
    if (!record) return null;
    await record.destroy();
    return record;
  }
}
