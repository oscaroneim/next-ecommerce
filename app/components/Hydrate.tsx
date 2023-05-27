'use client'

import {ReactNode, useEffect, useState  } from "react"

export default function Hydrate({children} : {children: ReactNode}){
const [isHydrate, setIsHydrate] = useState(false)

useEffect(() => {
setIsHydrate(true)
}, [])


    return(
        <>
        {isHydrate ? <>{children}</> : <div>Loading...</div>}
        </>
    )
}