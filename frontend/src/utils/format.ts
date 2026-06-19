import type { ChipProps } from "@mui/material";

export const formatCurrency = (amount: number | string, currency = "GBP") =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency
  }).format(Number(amount));

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

export const getStockStatusColor = (
  status: string
): ChipProps["color"] =>
  status === "IN_STOCK"
    ? "success"
    : status === "LOW_STOCK"
      ? "warning"
      : "error";

export const getOrderStatusColor = (
  status: string
): ChipProps["color"] =>
  ({
    PENDING: "warning",
    PROCESSING: "info",
    PACKED: "info",
    SHIPPED: "primary",
    DELIVERED: "success",
    CANCELLED: "error"
  })[status] as ChipProps["color"] || "default";
