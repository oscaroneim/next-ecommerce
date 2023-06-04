import { createEmitAndSemanticDiagnosticsBuilderProgram, isJsxOpeningElement, isTemplateExpression } from 'typescript'
import zustand, { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AddCartType } from './types/AddCartType'

type CartState = {                  
    isOpen: boolean                 //--------------- is the cart expanded or not (default false)
    cart: AddCartType[]                       //--------------- data types that the cart should expect
    toggleCart: () => void                         //--------------- toggle cart to true if used
    clearCart: () => void                                 //--------------- set the cart to an empty array 
    addProduct: (item: AddCartType) => void                       
    removeProduct: (item: AddCartType) => void
    paymentIntent: string                                 //--------------- default is an empty string
    onCheckout: string                                         
    setPaymentIntent: (val: string) => void                      
    setCheckout: (val: string) => void                       //--------------- sets the cart items for the checkouts
    
}


export const useCartStore = create<CartState>()(
    persist(
        (set) => ({
            cart: [],
            isOpen: false,
            paymentIntent: "",
            onCheckout: "cart",
            toggleCart: () => set((state) => ({isOpen: !state.isOpen})),
            addProduct: (item) => set((state) => {
                const existingItem = state.cart.find(cartItem => cartItem.id === item.id)
                    if(existingItem){
                        const updatedCart = state.cart.map((cartItem) => {
                            if(cartItem.id === item.id){
                                return({...cartItem, quantity: cartItem.quantity! + 1})
                        }
                        return cartItem
                    })
                    return {cart: updatedCart}
                } else {
                        return {cart: [...state.cart, {...item, quantity: 1}]}
                }
            }),
            removeProduct: (item) => set((state) => {
                //check if the item exists and remove quantity -1
                const existingItem = state.cart.find((cartItem) => cartItem.id === item.id)
                if(existingItem && existingItem.quantity! > 1) {
                    const updatedCart = state.cart.map((cartItem) => {
                        if(cartItem.id === item.id){
                            return({...cartItem, quantity: cartItem.quantity! - 1})
                        }
                        return cartItem
                    })
                    return {cart: updatedCart}
                }  else{
                    //remove item from cart if less than 0
                    const filteredCart = state.cart.filter((cartItem) => cartItem.id !== item.id)
                    return {cart: filteredCart}
                } 
            }), 
            setPaymentIntent: (val) => set((state) => ({paymentIntent: val})), 
            setCheckout: (val) => set((state) => ({onCheckout: val})),
            clearCart: () => set((state) => ({cart: []}))
        }),
        { name: "cart-store" }
    )
)

type themeState = {
    mode: ('light' | 'dark'), 
    toggleMode: (theme: 'light' | 'dark') => void
}

export const useThemeStore = create<themeState>()(                            
    persist(
        (set)=> ({
            mode: 'light',
            toggleMode: (theme) => set((state) => ({mode: theme})),
        }),
        {name: 'theme-store'}
    )
)
  
