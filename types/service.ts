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
  comment: string;
  created_at: Date;
  id: string;
  rating: number;
  reviewer: {
    firstname: string;
    id: string;
    lastname: string;
    profile_picture: string;
  };
};

export type Service = {
  id?: string;
  name: string;
  profile_picture?: string;
  business_name?: string;
  about_me?: string;
  owner_name?: string;
  owner_plan_type?: string;
  phone?: string;
  price?: number;
  cost?: number;
  owner_id?: string;
  sub_category?: Array<{
    cost: string;
    sub_category: string;
    id: string;
    time_frame: string;
  }>;
  address?: string;
  is_google_place?: boolean;
  external_rating?: string;
  external_reviews?: Array<GoogleReview>;
};

export type SubCategory = {
  cost: string;
  sub_category: string;
  sub_category_id: string;
  id: string;
  time_frame: string;
};
