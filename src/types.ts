export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  sizes: string[];
  colors: string[];
  featured: boolean;
  active: boolean;
}

export interface CartItem {
  id: string; // combination of productId + size + color
  productId: string;
  name: string;
  size: string;
  color: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  notes?: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
}

export interface StoreSettings {
  storeName: string;
  heroHeadline: string;
  heroSubheadline: string;
  maintenanceMode: boolean;
}
