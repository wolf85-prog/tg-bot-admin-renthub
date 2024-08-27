import React from 'react'

// const Chats = React.lazy(() => import('./pages/Chats'))
// const Chats2 = React.lazy(() => import('./pages/Chats2'))
// const Chats3 = React.lazy(() => import('./pages/Chats3'))
const ChatWorker = React.lazy(() => import('./pages/ChatWorker'))
const Managers = React.lazy(() => import('./pages/Managers'))
const DistributionR = React.lazy(() => import('./pages/DistributionR'))

const routes = [
  // { path: '/', exact: true, name: 'Пункт управления / ' },
  // { path: '/dashboard', name: 'Пункт управления / ', Component: Admin },
  // { path: "/chat", name: 'Чаты', Component: Chats },
  // { path: "/chat2", name: 'Чаты 2.0', Component: Chats2 },
  { path: "/chatwork", name: 'Workhub', Component: ChatWorker }, 
  { path: "/managers", name: 'Renthub / Уведомления', Component: Managers },
  { path: '/distributionr', name: 'Renthub / Рассылки', Component: DistributionR },
]

export default routes
