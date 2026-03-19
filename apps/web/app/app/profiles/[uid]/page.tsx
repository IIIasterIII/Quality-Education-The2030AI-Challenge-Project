"use client"
import React from 'react'
import { useParams } from 'next/navigation'

const page = () => {
    const { uid } = useParams()
    return (
        <div>{uid}</div>
    )
}

export default page