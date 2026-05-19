import { DashboardShell } from '@/components/dashboard/DashboardShell'
import { requireAuth } from '@/lib/auth'
import React from 'react'

const HomePageLayout = async ({
    children

}: { children: React.ReactNode }) => {
    const user = await requireAuth()
    return (
       <DashboardShell userEmail={user.email}>
        {children}
       </DashboardShell>
    )
}

export default HomePageLayout