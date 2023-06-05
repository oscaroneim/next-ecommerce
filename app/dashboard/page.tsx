import { prisma } from "@/util/prisma"
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { getServerSession } from 'next-auth'
import formatPrice from '@/util/PriceFormat'
import Image from 'next/image'



export const revalidate = 0

const fetchOrders = async () => {                 //------------- this async function fetches all of the users orders from the database  or returns null if user is not logged in
   
    const user = await getServerSession(authOptions)
    if(!user){
        return null
    }
    const orders = await prisma.order.findMany({
        where: { userId: user?.user?.id, status: 'complete' },          //---------- only gets the orders that are complete
        include: {products: true}
    })
    return orders
}


export default async function Dashboard(){
    const orders = await fetchOrders()
    if(orders === null){
        return(
      <div>
        <h1>You need to be signed in to see your Orders</h1>
        </div>
    )}

    if(orders?.length === 0 ){
       return(
        <div>
            <h1>No orders placed</h1>
            </div>
       )
    }
    return(
        <div>
            <div>
                {orders.map((order) => (                           //---------------- maps through orders on DB to grab order data

                    <div className="rounded-lg p-8 my-12 space-y-2 bg-base-200" key={order.id}>
                        <h2>Order Reference: {order.id}</h2>
                        <p className=" text-md py-2">Status: 
                        <span 
                        className={`${
                            order.status === "complete" ? "bg-green-500" : "bg-orange-500"
                        } text-white py-1 rounded-md px-2 text-sm`}
                        >
                          {order.status}
                          </span>
                        </p>
                        <p className=" text-xs">Time: {new Date(order.createdDate).toString()}</p>
                        <div className="text-sm lg:flex gap-8">

                            {order.products.map((product) => (                  //---------------- maps through products on DB to get related product data

                                <div className="py-2" key={product.id}>
                                    <h2 className="py-2">{product.name}</h2>
                                    <div className="flex items-center gap-4">
                                        <Image
                                    src={product.image!}
                                    alt={product.name}
                                    width={16}
                                    height={16}
                                    priority={true}
                                    />
                                    <p>{product.unit_amount != null ? formatPrice(product.unit_amount) : "N/A"}</p>
                                    <p>Quantity: {product.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div>
                        <h2 className="font-medium">
                            Order total: {order.amount != null ? formatPrice(order.amount) : "N/A" }
                        </h2>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
    
}
