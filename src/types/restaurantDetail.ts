import {Restaurant} from './restaurant';

export interface MenuItem {
  _id: string;
  name: string;
  description?: string;
  image?: {
    url: string;
    alt?: string;
  };
  category: string;
  price?: {
    amount: number;
    currency: string;
  };
  isPopular: boolean;
  photoCount: number;
  reviewCount: number;
}

export interface ReviewUser {
  name: string;
  avatar?: string;
  location?: string;
}

export interface ReviewRatings {
  overall: number;
  food?: number;
  service?: number;
  ambience?: number;
  value?: number;
}

export interface Review {
  _id: string;
  user: ReviewUser;
  ratings: ReviewRatings;
  title?: string;
  content: string;
  visitDate?: string;
  visitType?: string;
  helpfulCount: number;
  photos?: {url: string; alt?: string}[];
  isVerified: boolean;
  createdAt: string;
}

export interface RestaurantExperiencePrice {
  min: number;
  max: number;
  currency: string;
  display: string;
}

export interface RestaurantExperience {
  _id: string;
  title: string;
  description?: string;
  image: {
    url: string;
    alt?: string;
  };
  price: RestaurantExperiencePrice;
  availability: {
    hasMultipleDates: boolean;
    hasMultipleTimes: boolean;
  };
}

export interface DetailedRatings {
  food: number;
  service: number;
  ambience: number;
  value: number;
}

export interface RatingDistribution {
  five: number;
  four: number;
  three: number;
  two: number;
  one: number;
}

export interface RestaurantDetail extends Restaurant {
  priceRange?: string;
  fullAddress?: string;
  photoCount: number;
  detailedRatings: DetailedRatings;
  ratingDistribution: RatingDistribution;
  reviewSummary?: string;
  todayBookings: number;
  conciergeEnabled: boolean;
}

export interface RestaurantFullDetail extends RestaurantDetail {
  menu: {
    popularItems: MenuItem[];
    allItems: MenuItem[];
  };
  reviews: {
    items: Review[];
    total: number;
  };
  experiences: RestaurantExperience[];
}
