import apiClient from "./client";
import { Category, Product, ProductDetail } from "../types/product";

export const getCategories = async (): Promise<Category[]> => {
  const response = await apiClient.get<{ data: Category[] }>("/api/categories");
  return response.data.data;
};

export const getProducts = async (categoryId?: number): Promise<Product[]> => {
  const params = categoryId ? { category_id: categoryId } : {};
  const response = await apiClient.get<{ data: Product[] }>("/api/products", { params });
  return response.data.data;
};

export const getProductDetail = async (id: number): Promise<ProductDetail> => {
  const response = await apiClient.get<{ data: ProductDetail }>(`/api/products/${id}`);
  return response.data.data;
};
