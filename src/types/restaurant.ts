export interface TimeSlot {
  time: string;
  available: boolean;
  points: number;
}

export interface RestaurantImage {
  url: string;
  alt?: string;
  isPrimary?: boolean;
}

export interface Distance {
  value: number;
  unit: 'yd' | 'mi';
  display: string;
}

export interface RestaurantRank {
  topBooked?: number;
  topViewed?: number;
  topSaved?: number;
}

export interface Restaurant {
  _id: string;
  name: string;
  slug: string;
  images: RestaurantImage[];
  cuisine: string;
  priceLevel: '£' | '££' | '£££' | '££££';
  rating: number;
  reviewCount: number;
  areaName: string;
  distance: Distance;
  badges: string[];
  features: string[];
  timeSlots: TimeSlot[];
  isPromoted: boolean;
  isAwardWinning: boolean;
  hasOutdoorDining: boolean;
  isFeatured: boolean;
  isNewToBookable: boolean;
  rewardPoints: number;
  rank: RestaurantRank;
  description?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: {
    url: string;
    alt?: string;
  };
}

export interface Area {
  _id: string;
  name: string;
  slug: string;
}

export interface Experience {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image: {
    url: string;
    alt?: string;
  };
  isFeatured: boolean;
}

export interface Promotion {
  _id: string;
  title: string;
  subtitle?: string;
  image: {
    url: string;
    alt?: string;
  };
}

export interface HomeSection<T> {
  title: string;
  subtitle?: string | null;
  data: T[];
}

export interface TopRestaurantsSection {
  title: string;
  subtitle: string;
  tabs: {
    topBooked: { title: string; data: Restaurant[] };
    topViewed: { title: string; data: Restaurant[] };
    topSaved: { title: string; data: Restaurant[] };
  };
}

export interface HomeData {
  greeting: string;
  sections: {
    bookTonight: HomeSection<Restaurant>;
    awardWinning: HomeSection<Restaurant>;
    outdoorDining: HomeSection<Restaurant>;
    topRestaurants: TopRestaurantsSection;
    featured: HomeSection<Restaurant>;
    newToBookable: HomeSection<Restaurant>;
    wineTasting: HomeSection<Restaurant>;
    featuredExperiences: HomeSection<Experience>;
    getInspired: HomeSection<Promotion>;
    cuisines: HomeSection<Category>;
    areas: HomeSection<Area>;
  };
}

