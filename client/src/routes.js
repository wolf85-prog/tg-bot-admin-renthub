import React from 'react'

// const Chats = React.lazy(() => import('./pages/Chats'))
// const Chats2 = React.lazy(() => import('./pages/Chats2'))
// const Chats3 = React.lazy(() => import('./pages/Chats3'))
const ChatWorker = React.lazy(() => import('./pages/ChatWorker'))
const Managers = React.lazy(() => import('./pages/Managers'))
const DistributionR = React.lazy(() => import('./pages/DistributionR'))
const DistributionAddR = React.lazy(() => import('./pages/DistributionAddR'))
const DistributionRPlaner = React.lazy(() => import('./pages/DistributionRPlaner'))

const routes = [
  // { path: '/', exact: true, name: 'Пункт управления / ' },
  // { path: '/dashboard', name: 'Пункт управления / ', Component: Admin },
  // { path: "/chat", name: 'Чаты', Component: Chats },
  // { path: "/chat2", name: 'Чаты 2.0', Component: Chats2 },
  { path: "/chatrent", name: 'Renthub', Component: ChatWorker }, 
  { path: "/managers", name: 'Renthub / Уведомления', Component: Managers },
  { path: '/distributionr', name: 'Renthub / Рассылки', Component: DistributionR },
  { path: '/distributionr_add', name: 'Renthub / Рассылки', Component: DistributionAddR },
  { path: '/distributionr_planer', name: 'Renthub / Рассылки', Component: DistributionRPlaner },
]

export default routes
