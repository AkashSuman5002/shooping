import React, { createContext, useEffect, useState } from "react";
import all_product from "../Components/Asset/all_product"


export const ShopContext = createContext(null);

const getDefaultCart = () => ({});

const createCartKey = (itemId, size = 'M') => `${itemId}_${size}`;

const parseCartKey = (key) => {
    const [itemId, ...sizeParts] = key.split('_');
    return {
        itemId: Number(itemId),
        size: sizeParts.join('_') || 'M',
    };
};

const normalizeStoredCart = (storedCart) => {
    if (!storedCart || typeof storedCart !== 'object') {
        return getDefaultCart();
    }

    const normalized = {};

    Object.entries(storedCart).forEach(([key, value]) => {
        const quantity = Number(value) || 0;
        if (quantity <= 0) {
            return;
        }

        if (key.includes('_')) {
            normalized[key] = (normalized[key] || 0) + quantity;
            return;
        }

        const itemId = Number(key);
        if (!Number.isNaN(itemId)) {
            const newKey = createCartKey(itemId, 'M');
            normalized[newKey] = (normalized[newKey] || 0) + quantity;
        }
    });

    return normalized;
};


const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? normalizeStoredCart(JSON.parse(savedCart)) : getDefaultCart();
    });

    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (itemId, size = 'M') => {
        const cartKey = createCartKey(itemId, size);
        setCartItems((prev) => ({ ...prev, [cartKey]: (prev[cartKey] || 0) + 1 }));
     }
    const removeFromCart = (itemId, size = 'M') => {
        const cartKey = createCartKey(itemId, size);
        setCartItems((prev) => ({ ...prev, [cartKey]: Math.max((prev[cartKey] || 0) - 1, 0) }));
     }
    const clearCart = () => {
        setCartItems(getDefaultCart());
    }

     const getCartLineItems = () => {
        return Object.entries(cartItems)
            .filter(([, quantity]) => quantity > 0)
            .map(([cartKey, quantity]) => {
                const { itemId, size } = parseCartKey(cartKey);
                const product = all_product.find((entry) => entry.id === itemId);
                if (!product) {
                    return null;
                }

                return {
                    ...product,
                    quantity,
                    size,
                };
            })
            .filter(Boolean);
    }

     const getTotalCartAmount = () => {
        let totalAmount= 0;
        getCartLineItems().forEach((item) => {
            totalAmount += item.new_price * item.quantity;
        });
        return totalAmount;
    }
     const getTotalCartItems = () => {
        let totalItem = 0;
        for (const cartKey in cartItems) {
            if(cartItems[cartKey] > 0){
                totalItem += cartItems[cartKey];
            }
        }
        return totalItem;
    }


     const contextValue = {getTotalCartItems,getTotalCartAmount,getCartLineItems,all_product,cartItems,addToCart,removeFromCart,clearCart};


    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    )
       
    
}
export default ShopContextProvider;
