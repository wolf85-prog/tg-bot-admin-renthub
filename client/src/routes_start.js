import React from 'react'
import { 
    DISTRIBUTIONADDR_ROUTE,
    DISTRIBUTIONEDITR_ROUTE,
    DISTRIBUTIONRPLANER_ROUTE,
    DISTRIBUTIONR_ROUTE,
    CHAT_WORKER,
} from "./utils/consts";

const DistributionR = React.lazy(() => import('./pages/DistributionR'))
const DistributionAddR = React.lazy(() => import('./pages/DistributionAddR'))
const DistributionEditR = React.lazy(() => import('./pages/DistributionEditR'))
const DistributionRPlaner = React.lazy(() => import('./pages/DistributionRPlaner'))

export const authRoutes = [
    // { path: ADMIN_ROUTE, name: 'Панель управления', Component: Admin },

    
    
    // { path: '/', name: 'Пункт управления', Component: Admin },
]
