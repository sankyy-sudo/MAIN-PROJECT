export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "SALES_MANAGER"
  | "INVENTORY_MANAGER"
  | "SUPPORT";

export type LeadStatus =
  | "NEW"
  | "CONTACTED"
  | "PROPOSAL_SENT"
  | "NEGOTIATION"
  | "WON"
  | "LOST";
