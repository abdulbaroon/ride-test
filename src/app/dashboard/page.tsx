
import { DashboardPage } from '@/components/page'
import React from 'react'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Chasing Watts Dashboard",
  description: "Dashboard for Chasing Watts cycling community",
};

const Dashboard = () => {
  return (
    <DashboardPage/>
  )
}

export default Dashboard