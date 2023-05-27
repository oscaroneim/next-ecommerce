import { SearchParamTypes  } from "@/types/SearchParamType";
import formatPrice from "@/util/PriceFormat";
import Image from "next/image";
import AddCart from "./AddCart";

export default async function Product({ searchParams }: SearchParamTypes) {
    return (
  <div className="flex">     
<div className="flex flex-col 2xl:flex-row items-center justify-between gap-24 text-gray-700">
 <Image 
 src={searchParams.image} 
 alt={searchParams.name}
 width={130}
 height={120}
 
/>
<div className="font-medium text-gray-700">
    <h1 className="text-2xl font-medium py-2">{searchParams.name}</h1>
    <p>{searchParams.description}</p>
    <p className="py-2">{searchParams.features}</p>
<div className="flex gap-2">
    <p className="font-bold text-teal-700">{searchParams.unit_amount !== null ? formatPrice(searchParams.unit_amount) : "N/A"}</p>
</div>
<AddCart {...searchParams}/>
</div>
</div>
</div> 
    )
}


