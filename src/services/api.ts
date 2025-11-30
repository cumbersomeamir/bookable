import axios, {AxiosResponse} from 'axios';
import {Platform} from 'react-native';

// For Android emulator use 10.0.2.2, for iOS simulator use localhost
const API_BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:4000' : 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  },
);

// Type for API responses
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Home API
export const homeApi = {
  getHomeData: () => api.get('/home'),
};

// Restaurant APIs
export const restaurantApi = {
  getAll: (params?: Record<string, string>) => api.get('/restaurants', {params}),
  getById: (id: string) => api.get(`/restaurants/${id}`),
  getAwardWinning: (limit = 10) => api.get('/restaurants/award-winning', {params: {limit}}),
  getOutdoorDining: (limit = 10) => api.get('/restaurants/outdoor-dining', {params: {limit}}),
  getFeatured: (limit = 10) => api.get('/restaurants/featured', {params: {limit}}),
  getNew: (limit = 10) => api.get('/restaurants/new', {params: {limit}}),
  getTop: (type = 'booked', limit = 5) => api.get('/restaurants/top', {params: {type, limit}}),
  getWineTasting: (limit = 10) => api.get('/restaurants/wine-tasting', {params: {limit}}),
  getBookTonight: (limit = 10) => api.get('/restaurants/book-tonight', {params: {limit}}),
};

// Category APIs
export const categoryApi = {
  getAll: (limit = 10) => api.get('/categories', {params: {limit}}),
  getBySlug: (slug: string) => api.get(`/categories/${slug}`),
};

// Area APIs
export const areaApi = {
  getAll: (limit = 20) => api.get('/areas', {params: {limit}}),
  getBySlug: (slug: string) => api.get(`/areas/${slug}`),
};

// Experience APIs
export const experienceApi = {
  getAll: (limit = 10) => api.get('/experiences', {params: {limit}}),
  getFeatured: (limit = 10) => api.get('/experiences/featured', {params: {limit}}),
};

// Restaurant Detail APIs
export const restaurantDetailApi = {
  getBySlug: (slug: string) => api.get(`/restaurant/slug/${slug}`),
  getFullDetail: (slug: string) => api.get(`/restaurant/slug/${slug}/full`),
  getMenu: (slug: string, params?: {category?: string; popular?: boolean}) =>
    api.get(`/restaurant/slug/${slug}/menu`, {params}),
  getReviews: (slug: string, params?: {limit?: number; page?: number; sort?: string}) =>
    api.get(`/restaurant/slug/${slug}/reviews`, {params}),
  getExperiences: (slug: string) => api.get(`/restaurant/slug/${slug}/experiences`),
  getByCuisine: (cuisine: string, params?: {limit?: number; page?: number}) =>
    api.get(`/restaurant/cuisine/${cuisine}`, {params}),
};

// Booking APIs
export interface CreateBookingParams {
  restaurantId: string;
  userId: string;
  userEmail: string;
  userName?: string;
  date: string;
  time: string;
  partySize?: number;
  specialRequests?: string;
}

export interface Booking {
  _id: string;
  restaurant: string;
  userId: string;
  userEmail: string;
  userName: string;
  date: string;
  time: string;
  partySize: number;
  status: 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  specialRequests?: string;
  pointsEarned: number;
  rating?: number;
  ratedAt?: string;
  confirmationNumber: string;
  restaurantName: string;
  restaurantImage: string;
  restaurantCuisine: string;
  restaurantArea: string;
  createdAt: string;
  updatedAt: string;
}

export const bookingApi = {
  create: (params: CreateBookingParams) => api.post('/bookings', params),
  getUserBookings: (userId: string) => api.get(`/bookings/user/${userId}`),
  getById: (id: string) => api.get(`/bookings/${id}`),
  cancel: (id: string, userId: string) => api.patch(`/bookings/${id}/cancel`, {userId}),
  rate: (id: string, userId: string, rating: number) => 
    api.patch(`/bookings/${id}/rate`, {userId, rating}),
};

export default api;
