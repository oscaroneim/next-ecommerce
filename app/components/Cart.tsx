"use client"

import { useCartStore } from "@/store";
import Image from "next/image";
import formatPrice from "@/util/PriceFormat";
import {IoAddCircle, IoRemoveCircle} from 'react-icons/io5'
import shoppingCart from '@/public/shoppingCart.png'
import { motion, AnimatePresence } from 'framer-motion'
import Checkout from "./Checkout";
import OrderConfirmed from "./OrderConfirmed";


export default function Cart(){

    const cartStore = useCartStore()

    {/*total price*/}
    const totalPrice = cartStore.cart.reduce((acc, item) => {
    return acc + item.unit_amount! * item.quantity!
}, 0)

    return( 
       <motion.div             //----------------- page surrounding the cart
       initial={{opacity: 0}}
       animate={{opacity: 1}}
       exit={{opacity: 0}}
       onClick={() => cartStore.toggleCart()} 
       className="fixed w-full h-screen left-0 top-0 bg-black/25 "
       > 

          {/*cart*/}       
           <motion.div        //------------ expanded cart menu 
           layout 
           onClick={(e) => e.stopPropagation()} 
           className="bg-white absolute right-0 top-0 w-full lg:w-2/5 h-screen p-12 overflow-y-scroll text-gray-700">

           {cartStore.onCheckout === 'cart' && (    //-------------- renders a button on the cart 
            <button 
            onClick={() => cartStore.toggleCart()}  
            className="text-sm font-bold pb-12-"
            >Back to Store 🏃‍♂️
            </button>
            )}

            {cartStore.onCheckout === 'checkout' && (       //-------------renders a button on the checkout
            <button 
            onClick={() => cartStore.setCheckout('cart')}  
            className="text-sm font-bold pb-12-"
            >Back to Cart 🏃‍♂️
            </button>
            )}

            {cartStore.onCheckout === 'cart' && (      //---------renders all the items inside the expanded cart
                <>
            {/*cart items*/}
            {cartStore.cart.map((item) => (
                <motion.div 
                layout 
                key={item.id}
                className="flex py-4 gap-4" 
                >
                    <Image 
                    src={item.image} 
                    alt={item.name} 
                    width={35} 
                    height={25}/> 
                    <div>
                        <h2>{item.name}</h2>
                        {/*Update prod quantity*/}
                        <div className="flex gap-2">
                        <h2>Quantity: {item.quantity}</h2>
                        <button onClick={() => cartStore.removeProduct({
                            id: item.id,
                            name: item.name, 
                            image: item.image, 
                            unit_amount:item.unit_amount, 
                            quantity: item.quantity,})}>
                            <IoRemoveCircle />
                        </button>
                        <button onClick={() => cartStore.addProduct({
                            id: item.id,
                            name: item.name, 
                            image: item.image, 
                            unit_amount:item.unit_amount, 
                            quantity: item.quantity,})}>
                            <IoAddCircle />
                        </button>
                        </div>
                        <p className="text-sm">{item.unit_amount !== null ? formatPrice(item.unit_amount) : "N/A"}</p>
                    </div>
                </motion.div>
                
            ))}
            </>
            )}
            
            {/*checkout and total */}
             
            {cartStore.cart.length > 0 && cartStore.onCheckout === "cart" ?  (         //-------------- only renders a cart if there are items inside and if the cart is set to cart
                <motion.div layout>
               <p>Total:{totalPrice !== null ? formatPrice(totalPrice) : "N/A"}</p>
                <button onClick={() => cartStore.setCheckout('checkout')} className="py-2 mt-4 bg-teal-700 w-full rounded-md text-white">
                   Checkout
                </button>
                </motion.div>
            ) : null }

            {cartStore.onCheckout === 'checkout' && <Checkout/>}            
            {cartStore.onCheckout === 'success' && <OrderConfirmed/>}   
                    
            <AnimatePresence>                                            
            {!cartStore.cart.length && cartStore.onCheckout === "cart" && (     //---------- This is to make sure the icon and text only load in the cart when its empty
                <motion.div                                                
                animate={{ scale: 1, rotateZ: 0, opacity: 0.75 }}               //---------- conditional animation triggered if cart length is 0
                initial={{ scale: 0.5, rotateZ: -20, opacity: 0 }}
                exit={{ scale: 0.5, rotateZ: -20, opacity: 0 }}
                className="flex flex-col items-center gap-12 text-2xl font-medium pt-56 opacity-75"
               >
                    <h1>Your basket is empty</h1>
                    <Image src={shoppingCart} alt="empty cart" width={100} height={100}/>
                </motion.div>
            )}
            </AnimatePresence>
            </motion.div> 
        </motion.div>
    )
}







