export type OfferType =
  | "SERVICE_DISCOUNT"
  | "MEMBERSHIP_DISCOUNT"
  | "REFERRAL_REWARD"
  | "NEW_CLIENT_DISCOUNT";

export type CTAAction =
  | "/user/register"
  | "/user/membership"
  | "/services/furniture-assembly"
  | "/services/kitchen-assembly"
  | "/services/home-service"
  | "/services/house-cleaning"
  | "/services/kitchen-cleaning"
  | "/services/windows-cleaning"
  | "referral";

export interface Offer {
  clientId: string;
  title: string;
  description: string;
  type: OfferType;
  percentage: number;
  serviceTypes: string[];
  startDate: string;
  endDate: string;
  featuredImage: string;
  ctaAction: CTAAction;
  ctaText: string;
  details: string;
  active: boolean;
}

export interface OfferDB extends Offer {
  _id: string;
}
