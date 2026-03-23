import React from 'react'

const ChatWorker = React.lazy(() => import('./pages/ChatWorker'))
const ChatMax = React.lazy(() => import('./pages/ChatMax'))
const DistributionR = React.lazy(() => import('./pages/DistributionR'))
const DistributionAddR = React.lazy(() => import('./pages/DistributionAddR'))
const DistributionRPlaner = React.lazy(() => import('./pages/DistributionRPlaner'))

const routes = [
  { path: "/chatrent", name: 'Renthub', Component: ChatWorker }, 
  { path: "/chatmax", name: 'Renthub', Component: ChatMax }, 
  { path: '/distributionr', name: 'Renthub', Component: DistributionR },
  { path: '/distributionr_add', name: 'Renthub', Component: DistributionAddR },
  { path: '/distributionr_planer', name: 'Renthub', Component: DistributionRPlaner },
]

export default routes
