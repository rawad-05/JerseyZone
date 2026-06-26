import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from "firebase/firestore";
import { Product, Order, StoreSettings } from "./types";

const firebaseConfig = {
  apiKey: "AIzaSyCRq1foIaluTLvC0lin9xyzoRYYu0S3RTU",
  authDomain: "xenodochial-tooling-fj1d7.firebaseapp.com",
  projectId: "xenodochial-tooling-fj1d7",
  storageBucket: "xenodochial-tooling-fj1d7.firebasestorage.app",
  messagingSenderId: "880877054470",
  appId: "1:880877054470:web:2f6e2cdc18740a2e08b187"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-jerseyzone-2e5d9082-7a02-43c1-9921-55c8da46738c");

// Fetch all products
export async function getProductsFromDb(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const list: Product[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Product);
    });
    return list;
  } catch (error) {
    console.error("Error getting products: ", error);
    return [];
  }
}

// Save or update product
export async function saveProductToDb(product: Product): Promise<void> {
  try {
    await setDoc(doc(db, "products", product.id), product);
  } catch (error) {
    console.error("Error saving product: ", error);
    throw error;
  }
}

// Delete product
export async function deleteProductFromDb(productId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "products", productId));
  } catch (error) {
    console.error("Error deleting product: ", error);
    throw error;
  }
}

// Fetch all orders
export async function getOrdersFromDb(): Promise<Order[]> {
  try {
    const querySnapshot = await getDocs(collection(db, "orders"));
    const list: Order[] = [];
    querySnapshot.forEach((doc) => {
      list.push(doc.data() as Order);
    });
    return list;
  } catch (error) {
    console.error("Error getting orders: ", error);
    return [];
  }
}

// Save or update order
export async function saveOrderToDb(order: Order): Promise<void> {
  try {
    await setDoc(doc(db, "orders", order.id), order);
  } catch (error) {
    console.error("Error saving order: ", error);
    throw error;
  }
}

// Fetch settings
export async function getSettingsFromDb(): Promise<StoreSettings | null> {
  try {
    const querySnapshot = await getDocs(collection(db, "settings"));
    if (!querySnapshot.empty) {
      // Find document with id "main"
      const mainDoc = querySnapshot.docs.find(d => d.id === "main");
      if (mainDoc) {
        return mainDoc.data() as StoreSettings;
      }
      return querySnapshot.docs[0].data() as StoreSettings;
    }
    return null;
  } catch (error) {
    console.error("Error getting settings: ", error);
    return null;
  }
}

// Save settings
export async function saveSettingsToDb(settings: StoreSettings): Promise<void> {
  try {
    await setDoc(doc(db, "settings", "main"), settings);
  } catch (error) {
    console.error("Error saving settings: ", error);
    throw error;
  }
}
