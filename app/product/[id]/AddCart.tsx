'use client'

import { useCartStore } from "@/store"
import { AddCartType } from "@/types/AddCartType"

export default function AddCart({id, name, unit_amount, quantity, image}: AddCartType){
     const cartStore = useCartStore()
     cartStore.addProduct
    return(
        <> 
        <button onClick={() => cartStore.addProduct({id, image, quantity, name, unit_amount})} className="bg-teal-700 my-12 py-2 px-6 text-white font-medium rounded-md">Add to Cart
        </button>
        </>
    )
}