"use client"
import React from 'react'
import { useParams } from 'next/navigation'

{/* sub notes without id -> sub Graph  */}
{/* sub notes with id -> sub note page */}

const page = () => {
    const id = useParams().id
    return (
        <div>{id}</div>
    )
}

export default page