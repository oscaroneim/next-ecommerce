import Stripe from 'stripe'
import { prisma } from "@/util/prisma"
import { buffer } from 'micro'
import { NextApiRequest, NextApiResponse } from 'next'

export const config = {
    api: {
        bodyParser: false,
    },
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: "2022-11-15"
  })

  export default async function handler(
    req: NextApiRequest, 
    res: NextApiResponse
    ) {
        const buf = await buffer(req)
        const sig = req.headers["stripe-signature"]

        if(!sig){
            return res.status(400).send("Missing stripe signature")                       //-------------------- error if signature is missing
        }

        let event: Stripe.Event                       //------------ Handles different types of events

        try {
            event = stripe.webhooks.constructEvent(              //------------- the event needs buffer with the request, a signature from stripe and the secret to function
                buf,
                sig,
                process.env.STRIPE_WEBHOOK_SECRET!
            )
        }  catch (err) {                                            //------------ if something is missing from the constructEvent throw an error
            return res.status(400).send("Webhook error" + err)
        }
        switch (event.type) {                              //-------------------- case no1, event if payment intent has been created
            case "payment_intent.created": 
                const paymentIntent = event.data.object
                console.log("Payment intent was created")
                break
            case "charge.succeeded":                                 //-------------------- case no2 event if the paymentIntnentID matches the charge succeed
                const charge= event.data.object as Stripe.Charge
                if(typeof charge.payment_intent === "string"){
                  const order = await prisma.order.update({                          //-------------------- update the order field on the DB by Id and setting the statue to complete
                    where: { paymentIntentID: charge.payment_intent},
                    data: {status: "complete"},
                  })
                }
                break
                default:
                    console.log("Unhandled event type:" + event.type)                   
             }
             res.json({ received: true })                  //-------------------- this to confirm the event has been received 
  }
