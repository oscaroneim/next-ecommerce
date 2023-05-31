'use client'

import { useCartStore } from "@/store"
import { AddCartType } from "@/types/AddCartType"
import { useState } from "react"


export default function AddCart({id, name, unit_amount, quantity, image}: AddCartType){
     const cartStore = useCartStore()
     const [added, setAdded] = useState(false)

     const handleAddToCart = () => {
        cartStore.addProduct({id, image, quantity, name, unit_amount})
        setAdded(true)
        setTimeout(() => {
          setAdded(false)
        }, 500)
     }

    return(
        <> 
        <button 
        onClick={handleAddToCart} 
        className="my-4 btn btn-primary w-full"
        disabled={added}
        >
          {!added && <span>Add to Cart</span>}
          {added && <span>Adding to Cart</span>}
        </button>
        </>
    )
}