export interface IProduct {
  id: string;
  _id?: string;
  name: string;
  sku: string;
  description: string | null;
  images: string[];
  category: string;
  brand: string;
  retailPrice: number;
  wholesalePrice?: number;
  stockQuantity: number;
  isActive: boolean;
  categoryDetails?: { id: string; name: string };
  brandDetails?: { id: string; name: string };
  stockStatus?: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

export interface IOrder {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  shippingAddress: string;
  createdAt: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    lineTotal: number;
  }>;
  invoice?: { invoiceNumber: string };
}

export interface ICategory {
  id: string;
  name: string;
}

export interface IBrand {
  id: string;
  name: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
