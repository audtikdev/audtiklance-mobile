import { RegisterUserInfo } from "./auth";

export type GoogleReview = {
  authorAttribution?: {
    displayName: string;
  };
  originalText?: {
    text: string;
  };
  rating?: number;
  relativePublishTimeDescription?: string;
};

export type Review = {
  business: BusinessType;
  message: string;
  rating: number;
  user: RegisterUserInfo;
  createdAt: Date;
};

export interface ServiceType {
  id: string;
  category: CategoryType;
  price: string;
}

export type BusinessType = {
  id: string;
  title: string;
  description: string;
  location: {
    coordinates: [number, number];
    type: string;
  };
  address: string;
  price: number;
  mainImage: string;
  previousWorkImages: string[];
  is_google_place: boolean;
  provider: Omit<RegisterUserInfo, "business">;
  reviews: any[];
  services: Array<ServiceType>;
};

export type CategoryType = {
  id: string;
  name: string;
  description: string;
};
