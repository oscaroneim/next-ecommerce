import Stripe from 'stripe'
import {NextApiRequest, NextApiResponse} from "next" 
import { authOptions } from './auth/[...nextauth]'
import {getServerSession} from 'next-auth'
import { AddCartType } from '@/types/AddCartType'
import { prisma } from "@/util/prisma"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15"
  }) 

  const calculateOrderAmount = (items: AddCartType[]) => {
    const totalPrice = items.reduce((acc, item) => {
      return acc + item.unit_amount! * item.quantity!
  }, 0)
  return totalPrice
  }

  export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
    ) {
    
    const userSession = await getServerSession(req, res, authOptions)  //------------------- Get the user 
    if(!userSession?.user){
        res.status(403).json({message: 'Not logged in'})  //-------------------- if there is no user here i want to give an error message 403 (not authorised, need to sign in)
        return
    }
    //Extract data from the body
    const {items, payment_intent_id } = req.body //--------- frontend cart plus the empty payment intent
   

    //Create order data (prisma code that will be saved to the Data base)
    const orderData ={
      user: {connect: {id: userSession.user?.id}}, //--------------------- connect to user currently signed in
      amount: calculateOrderAmount(items),    //----------------------- Sums the carts amount
      currency: 'GBP',  
      status: 'pending',
      paymentIntentID: payment_intent_id, //------------------- payment id created from the order model
      products: {        //--------------------- also from the order model that will be saved on railway DB
        create: items.map((item) => ({ 
          name:item.name,
          description: item.description || null,
          image: item.image,
          unit_amount: parseFloat(item.unit_amount),   //------------------------ If this errors out try wrapping in parseFloat() or changing the order model from unit_amount back to amount
          quantity: item.quantity
        }))
      }
    }
     
    //check if payment intent exists update order 
    if(payment_intent_id) {
      const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id)  //----------**RETRIEVE PAYMENT INTENT**
    
    if(current_intent){ 
      const updated_intent = await stripe.paymentIntents.update(   //------------- **UPDATE PAYMENT INTENT ID CART TOTAL**
        payment_intent_id,
        {amount: calculateOrderAmount(items)}
        )

        //Fetch order with product id from newly created payment intent id (updated_intent)
        const existing_order = await prisma.order.findFirst({
          where: {paymentIntentID: updated_intent.id},
          include: {products: true},         //----------------------------- By default the order will return everything except the products so we have to mention it(see model Order)
        }) 
        if(!existing_order){
          res.status(400).json({message : 'Invalid Payment Intent'}) //--------- error if payment intent is missing
          }

      // Update existing order
         const updated_order = await prisma.order.update({  //-------------- **UPDATING EXISTING ORDER ON DB USING 'const existing_order'**
           where: {id: existing_order?.id}, 
           data : {
             amount: calculateOrderAmount(items),  //------------sum of fresh cart
             products: {
               deleteMany: {},     //-------------------- here its deleting the entire order so that we can push a fresh order
               create: items.map((item) => ({    //------------- here we push the product details order
                 name: item.name,
                 description: item.description || null,
                 image: item.image,
                 unit_amount: parseFloat(item.unit_amount),
                 quantity: item.quantity
         }))
       }
     }
  })
  res.status(200).json({paymentIntent: updated_intent})  //---------- return the updated intent
  return
    }

    } else {
      //Create new order with prisma
      const paymentIntent = await stripe.paymentIntents.create({ //------------ **CREATION INTENT** here we create a new payment intent
        amount: calculateOrderAmount(items),
        currency: "GBP",
        automatic_payment_methods: {enabled: true },  //------------------- This will detect whether you can pay using google pay or card etc
      })

      orderData.paymentIntentID = paymentIntent.id  
      const newOrder = await prisma.order.create({          //--------------------- **CREATION DB** here we are creating it for our DB (railway.app)
        data: orderData,                              
      })
      res.status(200).json({ paymentIntent })  //------- return newly created payment intent id to frontend and save it in out **state**
    }    
  }