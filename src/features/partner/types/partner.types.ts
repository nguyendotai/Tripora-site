export type PartnerBusinessType = 'HOTEL' | 'TOUR' | 'RESTAURANT' | 'VEHICLE';
export type PartnerVerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED';

export interface Partner {
  id: string;
  ownerId: string;
  businessName: string;
  businessType: PartnerBusinessType;
  contactEmail: string | null;
  contactPhone: string | null;
  verificationStatus: PartnerVerificationStatus;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePartnerInput {
  businessName: string;
  businessType: PartnerBusinessType;
  contactEmail?: string;
  contactPhone?: string;
}
