import { requireAuth } from '@/lib/auth'
import React from 'react'

const HomePageLayout = async ({
    children

}: { children: React.ReactNode }) => {
    const user = await requireAuth()
    console.log(user)
    return (
        <div>
            {children}
        </div>
    )
}

export default HomePageLayout