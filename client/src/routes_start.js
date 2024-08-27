import React from 'react'
import { 
    DISTRIBUTIONADDR_ROUTE,
    DISTRIBUTIONEDITR_ROUTE,
    DISTRIBUTIONRPLANER_ROUTE,
    DISTRIBUTIONR_ROUTE,
    MANAGERS_ROUTE,
} from "./utils/consts";

// const Chats = React.lazy(() => import('./pages/Chats'))
// const Chats2 = React.lazy(() => import('./pages/Chats2'))
// const Chats3 = React.lazy(() => import('./pages/Chats3'))
// const ChatWorker = React.lazy(() => import('./pages/ChatWorker'))


// const SoundsNotif = React.lazy(() => import('./pages/SoundsNotif'))
// const FileManager = React.lazy(() => import('./pages/FileManager'))

const Managers = React.lazy(() => import('./pages/Managers'))
const DistributionR = React.lazy(() => import('./pages/DistributionR'))
//const DistributionAddR = React.lazy(() => import('./pages/DistributionAddR'))
//const DistributionEditR = React.lazy(() => import('./pages/DistributionEditR'))
//const DistributionRPlaner = React.lazy(() => import('./pages/DistributionRPlaner'))

export const authRoutes = [
    // { path: ADMIN_ROUTE, name: 'Панель управления', Component: Admin },

    
    
    // { path: '/', name: 'Пункт управления', Component: Admin },
]
