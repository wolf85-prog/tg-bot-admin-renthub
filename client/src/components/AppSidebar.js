import React, {useEffect, useState} from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilEnvelopeClosed,
  cilSpeedometer,
  cilPeople,
  cilMicrophone,
  cilSend,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavLink, CNavTitle } from '@coreui/react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logo from 'src/assets/brand/logo_04_light.png'
import logo2 from 'src/assets/brand/logo_04_blue.png'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useUsersContext } from "./../chat-app-new/context/usersContext";
import CompIcon from 'src/assets/images/dashboard3.png'
import ProjIcon from 'src/assets/images/projects.png'
import ChatIcon from 'src/assets/images/chat.png'
import SupportIcon from 'src/assets/images/support_icon.png'

import { newPretendent, getCountMessage } from 'src/http/adminAPI'

// sidebar nav config
//import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const host = process.env.REACT_APP_HOST_ADMIN

  const { countMessage, countMessageRent, newProject, countProjects, countMessageWork, countPretendent, showGetMess } = useUsersContext();

  const [count, setCount ] = useState(0);
  const [countMesW, setCountMesW ] = useState(0);
  //console.log("countMessage: ", countMessageWork)

  const handleLinkClick = (url) => {
    // Open the link in a new tab with desired features (optional)
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleLinkClick2 = (url) => {
    // Open the link in a new tab with desired features (optional)
    window.open(url, '_self', 'noopener,noreferrer');
  };
  
  let navigation = []

  navigation = [ //показывать бейдж
    {
      component: CNavLink,
      name: 'Пункт управления',
      //to: '/dashboard',
      onClick: ()=>handleLinkClick2(`${host}/dashboard`),
      // icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
      icon: <img src={CompIcon} style={{width: '25px', marginRight: '18px', marginLeft: '4px'}} />,
      style: {backgroundColor: '#2a2f32', cursor: 'pointer'}, //1b2227 //1f282c
    },
    {
      component: CNavTitle,
      name: '',
    },


    {
      component: CNavLink,
      name: 'Проекты',
      onClick: ()=>handleLinkClick2(`${host}/projects`),
      // href: 'https://www.notion.so/amusienko/0e317603bca24676ac25616243e10ab4?v=d61a947d60834e3eafcc2dba4b46cb96',
      icon: <img src={ProjIcon} style={{width: '25px', marginRight: '18px', marginLeft: '4px'}} />,
      style: {backgroundColor: '#0078d421', cursor: 'pointer'},
      //onClick: ()=>handleLinkClick('https://www.notion.so/amusienko/0e317603bca24676ac25616243e10ab4?v=d61a947d60834e3eafcc2dba4b46cb96'),
    },
    {
      component: CNavLink,
      name: 'В эфире',
      //href: 'https://www.notion.so/amusienko/On-Air-fc187957a95a4814ac365d6ce6188585',
      icon: <CIcon icon={cilMicrophone} customClassName="nav-icon" />,
      //onClick: ()=>handleLinkClick('https://www.notion.so/amusienko/On-Air-fc187957a95a4814ac365d6ce6188585'),
      style: {cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Площадки',
      onClick: ()=>handleLinkClick2(`${host}/platforms`),
      //href: 'https://www.notion.so/amusienko/0fd7496301ad48d0abe1cd19fc5d1930?v=4c1b2cf253324a80baad33f591da43be',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      //onClick: ()=>handleLinkClick('https://www.notion.so/amusienko/0fd7496301ad48d0abe1cd19fc5d1930?v=4c1b2cf253324a80baad33f591da43be'),
      style: {cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Компании',
      //to: '/companys',
      onClick: ()=>handleLinkClick2(`${host}/companys`),
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      //onClick: ()=>handleLinkClick('https://www.notion.so/amusienko/b1b7c39c50a7497da828d7e568f062de?v=5f8ceffc7f7340f4ba5aa3739457f1e7'),
      //style: {color: '#e55353',},
      style: {cursor: 'pointer'},
    },

    {
      component: CNavTitle,
      name: '',
    },


    {
      component: CNavItem,
      name: 'Менеджеры',
      to: '/chatrent',
      //onClick: ()=>handleLinkClick2(`${host}/chatrent`),
      icon: <img src={ChatIcon} style={{width: '21px', marginRight: '20px', marginLeft: '6px'}} />,
      badge: countMessage !== 0 ? {color: 'info', text: countMessage,} : "",
      style: {backgroundColor: '#0078d421', cursor: 'pointer'},
    },
    
    {
      component: CNavItem,
      name: 'Рассылки',
      to: '/distributionr',
      //onClick: ()=>handleLinkClick2(`${host}/distributionr`),
      icon: <CIcon icon={cilEnvelopeClosed} customClassName="nav-icon" />,
      style: {cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Профиль',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      onClick: ()=>handleLinkClick2(`${host}/managers`),
      style: {cursor: 'pointer'},
    },
    
    {
      component: CNavItem,
      name: 'Уведомления',
      //onClick: ()=>handleLinkClick2(`${host}/notifications`),
      to: '/notifications',
      icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
      badge: countProjects !== 0 ? {color: 'info', text: countProjects,} : "",
      style: {cursor: 'pointer'},
    },

    {
      component: CNavTitle,
      name: '',
    },


    {
      component: CNavLink,
      name: 'Специалисты',
      onClick: ()=>handleLinkClick2(`${host}/chatwork`),
      icon: <img src={ChatIcon} style={{width: '21px', marginRight: '20px', marginLeft: '6px'}} />,
      badge: countMessageWork !== '0' ? {color: 'info', text: countMessageWork,} : "",
      style: {backgroundColor: '#0078d421', cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Рассылки',
      //to: '/distributionw',
      onClick: ()=>handleLinkClick2(`${host}/distributionw`),
      icon: <CIcon icon={cilEnvelopeClosed} customClassName="nav-icon" />,
      style: {cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Профиль',
      icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
      onClick: ()=>handleLinkClick2(`${host}/specialist`),
      style: {cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Уведомления',
      //to: '/workers',
      onClick: ()=>handleLinkClick2(`${host}/workers`),
      icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
      badge: countPretendent ? {color: 'info', text: countPretendent,} : "",
      style: {cursor: 'pointer'},
    },

    {
      component: CNavTitle,
      name: '',
    },

    
    {
      component: CNavLink,
      name: 'Тех. поддержка',
      //to: '/support',
      onClick: ()=>handleLinkClick2('https://proj.uley.team:3001/support'),
      icon: <img src={SupportIcon} style={{width: '21px', marginRight: '20px', marginLeft: '6px'}} />,
      // badge: countMessageWork !== '0' ? {color: 'info', text: countMessageWork,} : "",
      style: {backgroundColor: '#0078d421', cursor: 'pointer'},
    },
    {
      component: CNavLink,
      name: 'Архив',
      onClick: ()=>handleLinkClick2(`${host}/chat2`),
      icon: <img src={ChatIcon} style={{width: '21px', marginRight: '20px', marginLeft: '6px'}} />,
      style: {color: '#e55353', cursor: 'pointer'},
    },
    {
      component: CNavTitle,
      name: '',
    },

    
    
    // {
    //   component: CNavItem,
    //   name: 'Рассылки',
    //   to: '/distributionr',
    //   icon: <CIcon icon={cilEnvelopeClosed} customClassName="nav-icon" />,
    //   style: {color: '#e55353'},
    // },
    // {
    //   component: CNavItem,
    //   name: 'Уведомления',
    //   to: '/managers',
    //   icon: <CIcon icon={cilBell} customClassName="nav-icon" />,
    //   badge: countProjects !== 0 ? {color: 'info', text: countProjects,} : "",
    //   style: {color: '#e55353'},
    // },
    
  ]

  return (
    <CSidebar
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/dashboard">
        <img src={logo} alt='' height={35} style={{position: 'absolute'}} className={showGetMess ? "logo-anim sidebar-brand-full" : "sidebar-brand-full"}/>
        <img src={logo2} alt='' height={35} style={{position: 'absolute', opacity: 0}} className={showGetMess ? "logo-anim2 sidebar-brand-full" : "sidebar-brand-full"}/>
      </CSidebarBrand>

      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>

      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
