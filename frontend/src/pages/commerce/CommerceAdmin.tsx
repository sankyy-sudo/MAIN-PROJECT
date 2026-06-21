import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import api from "../../services/api";

const couponForm = {
  code: "",
  description: "",
  discountType: "PERCENT",
  value: "",
  minSubtotal: "0",
  maxDiscount: "",
  usageLimit: "",
  isActive: true
};

const shippingForm = {
  name: "",
  region: "DEFAULT",
  baseFee: "0",
  freeShippingThreshold: "",
  minSubtotal: "0",
  maxSubtotal: "",
  isActive: true
};

const taxForm = {
  name: "VAT",
  region: "DEFAULT",
  rate: "18",
  isDefault: true,
  isActive: true
};

const paymentForm = {
  bankTransferEnabled: "true",
  paypalEnabled: "false",
  paypalMode: "sandbox"
};

const CommerceAdmin = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [shippingRules, setShippingRules] = useState<any[]>([]);
  const [taxSettings, setTaxSettings] = useState<any[]>([]);
  const [coupon, setCoupon] = useState(couponForm);
  const [shipping, setShipping] = useState(shippingForm);
  const [tax, setTax] = useState(taxForm);
  const [payment, setPayment] = useState(paymentForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    const [couponRes, shippingRes, taxRes, settingsRes] = await Promise.all([
      api.get("/commerce/coupons"),
      api.get("/commerce/shipping-rules"),
      api.get("/commerce/tax-settings"),
      api.get("/commerce/settings", { params: { group: "PAYMENT" } })
    ]);
    setCoupons(couponRes.data.data);
    setShippingRules(shippingRes.data.data);
    setTaxSettings(taxRes.data.data);
    const settings = settingsRes.data.data.reduce(
      (values: Record<string, string>, setting: any) => ({
        ...values,
        [setting.key]: setting.value
      }),
      {}
    );
    setPayment((current) => ({ ...current, ...settings }));
  }, []);

  useEffect(() => {
    load().catch(() => setError("Unable to load commerce settings"));
  }, [load]);

  const change =
    <T extends Record<string, any>>(
      setter: (value: T) => void,
      current: T,
      field: keyof T
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setter({
        ...current,
        [field]:
          event.target.type === "checkbox"
            ? event.target.checked
            : event.target.value
      });
    };

  const createCoupon = async () => {
    await api.post("/commerce/coupons", coupon);
    setCoupon(couponForm);
    setMessage("Coupon saved");
    await load();
  };

  const createShippingRule = async () => {
    await api.post("/commerce/shipping-rules", shipping);
    setShipping(shippingForm);
    setMessage("Shipping rule saved");
    await load();
  };

  const createTaxSetting = async () => {
    await api.post("/commerce/tax-settings", tax);
    setTax(taxForm);
    setMessage("Tax setting saved");
    await load();
  };

  const savePaymentSettings = async () => {
    await api.put("/commerce/settings", {
      group: "PAYMENT",
      values: payment
    });
    setMessage("Payment settings saved");
    await load();
  };

  const remove = async (url: string) => {
    await api.delete(url);
    await load();
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Commerce Engine</Typography>
        <Typography color="text.secondary">
          Manage coupons, discounts, VAT/tax, shipping rules, free shipping, bank transfer, and PayPal foundations.
        </Typography>
      </Box>

      {message && <Alert severity="success">{message}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "repeat(2, 1fr)" } }}>
        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Coupon Codes / Discount Engine</Typography>
              <TextField label="Code" value={coupon.code} onChange={change(setCoupon, coupon, "code")} />
              <TextField label="Description" value={coupon.description} onChange={change(setCoupon, coupon, "description")} />
              <TextField select label="Type" value={coupon.discountType} onChange={change(setCoupon, coupon, "discountType")}>
                <MenuItem value="PERCENT">Percent</MenuItem>
                <MenuItem value="FIXED">Fixed</MenuItem>
              </TextField>
              <TextField label="Value" type="number" value={coupon.value} onChange={change(setCoupon, coupon, "value")} />
              <TextField label="Min Subtotal" type="number" value={coupon.minSubtotal} onChange={change(setCoupon, coupon, "minSubtotal")} />
              <TextField label="Max Discount" type="number" value={coupon.maxDiscount} onChange={change(setCoupon, coupon, "maxDiscount")} />
              <TextField label="Usage Limit" type="number" value={coupon.usageLimit} onChange={change(setCoupon, coupon, "usageLimit")} />
              <FormControlLabel control={<Checkbox checked={coupon.isActive} onChange={change(setCoupon, coupon, "isActive")} />} label="Active" />
              <Button variant="contained" onClick={createCoupon}>Save Coupon</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Shipping Rules</Typography>
              <TextField label="Name" value={shipping.name} onChange={change(setShipping, shipping, "name")} />
              <TextField label="Region" value={shipping.region} onChange={change(setShipping, shipping, "region")} />
              <TextField label="Base Fee" type="number" value={shipping.baseFee} onChange={change(setShipping, shipping, "baseFee")} />
              <TextField label="Free Shipping Threshold" type="number" value={shipping.freeShippingThreshold} onChange={change(setShipping, shipping, "freeShippingThreshold")} />
              <TextField label="Min Subtotal" type="number" value={shipping.minSubtotal} onChange={change(setShipping, shipping, "minSubtotal")} />
              <TextField label="Max Subtotal" type="number" value={shipping.maxSubtotal} onChange={change(setShipping, shipping, "maxSubtotal")} />
              <FormControlLabel control={<Checkbox checked={shipping.isActive} onChange={change(setShipping, shipping, "isActive")} />} label="Active" />
              <Button variant="contained" onClick={createShippingRule}>Save Shipping Rule</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">VAT / Tax Calculation</Typography>
              <TextField label="Name" value={tax.name} onChange={change(setTax, tax, "name")} />
              <TextField label="Region" value={tax.region} onChange={change(setTax, tax, "region")} />
              <TextField label="Rate %" type="number" value={tax.rate} onChange={change(setTax, tax, "rate")} />
              <FormControlLabel control={<Checkbox checked={tax.isDefault} onChange={change(setTax, tax, "isDefault")} />} label="Default" />
              <FormControlLabel control={<Checkbox checked={tax.isActive} onChange={change(setTax, tax, "isActive")} />} label="Active" />
              <Button variant="contained" onClick={createTaxSetting}>Save Tax Setting</Button>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="h6">Payment Foundations</Typography>
              <TextField select label="B2B Bank Transfer" value={payment.bankTransferEnabled} onChange={change(setPayment, payment, "bankTransferEnabled")}>
                <MenuItem value="true">Enabled</MenuItem>
                <MenuItem value="false">Disabled</MenuItem>
              </TextField>
              <TextField select label="PayPal" value={payment.paypalEnabled} onChange={change(setPayment, payment, "paypalEnabled")}>
                <MenuItem value="false">Placeholder only</MenuItem>
                <MenuItem value="true">Enabled</MenuItem>
              </TextField>
              <TextField label="PayPal Mode" value={payment.paypalMode} onChange={change(setPayment, payment, "paypalMode")} />
              <Button variant="contained" onClick={savePaymentSettings}>Save Payment Settings</Button>
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ display: "grid", gap: 2 }}>
        <Typography variant="h6">Current Rules</Typography>
        {[...coupons.map((item) => ({ ...item, label: `Coupon ${item.code}`, url: `/commerce/coupons/${item.id}` })),
          ...shippingRules.map((item) => ({ ...item, label: `Shipping ${item.name}`, url: `/commerce/shipping-rules/${item.id}` })),
          ...taxSettings.map((item) => ({ ...item, label: `Tax ${item.name}`, url: `/commerce/tax-settings/${item.id}` }))].map((item) => (
          <Card key={item.url}>
            <CardContent>
              <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between", gap: 2 }}>
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>{item.label}</Typography>
                  <Typography color="text.secondary">
                    {item.region || item.discountType} / Active: {String(item.isActive)}
                  </Typography>
                </Box>
                <Button color="error" variant="outlined" onClick={() => remove(item.url)}>
                  Delete
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Stack>
  );
};

export default CommerceAdmin;
