import apiClient from "./client";

export interface CartItemOptionResponse {
  id: number;
  label: string;
  extra_price: number;
}

export interface CartItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  image_url: string;
  base_price: number;
  quantity: number;
  note: string;
  options: CartItemOptionResponse[];
  item_total: number;
}

export interface CartResponse {
  id: number;
  items: CartItemResponse[];
  subtotal: number;
  total_items: number;
}

export interface AddCartItemPayload {
  product_id: number;
  quantity: number;
  note?: string;
  option_value_ids: number[];
}

export const getCart = async (): Promise<CartResponse> => {
  const response = await apiClient.get<{ data: CartResponse }>("/api/cart");
  return response.data.data;
};

export const addCartItem = async (payload: AddCartItemPayload): Promise<void> => {
  await apiClient.post("/api/cart/items", payload);
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<void> => {
  await apiClient.put(`/api/cart/items/${itemId}`, { quantity });
};

export const deleteCartItem = async (itemId: number): Promise<void> => {
  await apiClient.delete(`/api/cart/items/${itemId}`);
};
