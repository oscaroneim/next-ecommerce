export type ProductType = {
    name: string
    unit_amount: number | null
    image: string
    description: string | null
    metadata: MetadataType
    quantity?: number | 1
    id: string 
}

type MetadataType = {
    features: string
}