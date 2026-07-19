import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { Product } from "../types/product";
import {
  getCart,
  addCartItem,
  deleteCartItem,
  updateCartItem,
  CartResponse,
  CartItemResponse,
} from "../api/cart";
import { useAuth } from "./AuthContext";

export interface SelectedOptions {
  options: Record<number, number>; // option_group_id -> option_value_id
  addons: Record<number, boolean>; // option_value_id -> checked
}

interface CartContextType {
  cartItems: CartItemResponse[];
  cartCount: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (
    product: Product,
    quantity: number,
    selectedOptions?: SelectedOptions
  ) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  updateItemOptions: (
    itemId: number,
    product: Product,
    quantity: number,
    selectedOptions: SelectedOptions
  ) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const cartItems = cartData?.items ?? [];
  const cartCount = cartData?.total_items ?? 0;
  const totalPrice = cartData?.subtotal ?? 0;

  // Load cart dari backend saat user login (token tersedia)
  const refreshCart = useCallback(async () => {
    if (!token) {
      setCartData(null);
      return;
    }
    try {
      setIsLoading(true);
      const data = await getCart();
      setCartData(data);
    } catch (err) {
      // Cart mungkin belum ada, abaikan error
      setCartData(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  /**
   * Tambah produk ke cart.
   * Jika produk punya option groups, kirim option_value_ids ke backend.
   * Jika tidak ada opsi, kirim array kosong.
   */
  const addToCart = async (
    product: Product,
    quantity: number,
    selectedOptions?: SelectedOptions
  ) => {
    // Kumpulkan semua option value ID yang dipilih
    const optionValueIds: number[] = [];

    if (selectedOptions && product.option_groups) {
      product.option_groups.forEach((group) => {
        if (group.selection_type === "single") {
          const valId = selectedOptions.options[group.id];
          if (valId !== undefined) {
            optionValueIds.push(valId);
          }
        } else {
          group.values.forEach((val) => {
            if (selectedOptions.addons[val.id]) {
              optionValueIds.push(val.id);
            }
          });
        }
      });
    }

    await addCartItem({
      product_id: product.id,
      quantity,
      option_value_ids: optionValueIds,
    });

    // Refresh cart dari backend untuk sinkronisasi
    await refreshCart();
  };

  const removeFromCart = async (itemId: number) => {
    await deleteCartItem(itemId);
    await refreshCart();
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateCartItem(itemId, quantity);
      await refreshCart();
    }
  };

  const updateItemOptions = async (
    itemId: number,
    product: Product,
    quantity: number,
    selectedOptions: SelectedOptions
  ) => {
    // 1. Delete old item
    await deleteCartItem(itemId);

    // 2. Collect new option value IDs
    const optionValueIds: number[] = [];
    if (product.option_groups) {
      product.option_groups.forEach((group) => {
        if (group.selection_type === "single") {
          const valId = selectedOptions.options[Number(group.id)];
          if (valId !== undefined) {
            optionValueIds.push(Number(valId));
          }
        } else {
          group.values.forEach((val) => {
            if (selectedOptions.addons[Number(val.id)]) {
              optionValueIds.push(Number(val.id));
            }
          });
        }
      });
    }

    // 3. Add new item configuration
    await addCartItem({
      product_id: product.id,
      quantity,
      option_value_ids: optionValueIds,
    });

    // 4. Refresh cart to sync UI
    await refreshCart();
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        totalPrice,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateItemOptions,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart harus dipakai di dalam CartProvider");
  }
  return context;
}
