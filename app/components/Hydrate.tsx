'use client'

import { useThemeStore } from "@/store"
import {ReactNode, useEffect, useState  } from "react"

export default function Hydrate({children} : {children: ReactNode}){
const [isHydrate, setIsHydrate] = useState(false)
const themeStore = useThemeStore()

useEffect(() => {
setIsHydrate(true)
}, [])


    return(
        <>
        {isHydrate ? <body className="px-4 lg:px-48" data-theme={themeStore.mode}>{children}</body> : (<body></body>)}
        </>
    )
}