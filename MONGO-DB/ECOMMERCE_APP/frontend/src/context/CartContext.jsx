import { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext(null);

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM": {
      const exists = state.items.find((i) => i._id === action.payload._id);
      const items = exists
        ? state.items.map((i) =>
            i._id === action.payload._id
              ? { ...i, quantity: i.quantity + (action.payload.quantity || 1) }
              : i
          )
        : [...state.items, { ...action.payload, quantity: action.payload.quantity || 1 }];
      return { ...state, items };
    }

    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i._id !== action.payload) };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((i) =>
          i._id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "SET_SHIPPING":
      return { ...state, shippingAddress: action.payload };

    default:
      return state;
  }
};

const initialState = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  shippingAddress: JSON.parse(localStorage.getItem("shippingAddress") || "null"),
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(state.items));
  }, [state.items]);

  useEffect(() => {
    if (state.shippingAddress)
      localStorage.setItem("shippingAddress", JSON.stringify(state.shippingAddress));
  }, [state.shippingAddress]);

  // Derived totals
  const itemCount    = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const itemsPrice   = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice      = +(itemsPrice * 0.18).toFixed(2); // 18% GST
  const totalPrice    = +(itemsPrice + shippingPrice + taxPrice).toFixed(2);

  return (
    <CartContext.Provider
      value={{
        items:           state.items,
        shippingAddress: state.shippingAddress,
        itemCount,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
        addItem:        (product) => dispatch({ type: "ADD_ITEM",        payload: product }),
        removeItem:     (id)      => dispatch({ type: "REMOVE_ITEM",     payload: id }),
        updateQuantity: (id, quantity) => dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } }),
        clearCart:      ()        => dispatch({ type: "CLEAR_CART" }),
        setShipping:    (addr)    => dispatch({ type: "SET_SHIPPING",    payload: addr }),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be inside CartProvider");
  return ctx;
};