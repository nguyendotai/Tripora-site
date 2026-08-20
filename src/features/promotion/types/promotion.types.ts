export interface Promotion {
  id: string;
  providerId?: string | null;
  name: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: string;
  maxDiscountAmount?: string | null;
  minOrderAmount: string;
  validFrom: string;
  validUntil: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}
