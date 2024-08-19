import React, { Suspense, useEffect, useState, useContext } from 'react'
import { CContainer, CSpinner, CNav, CNavLink, CNavItem } from '@coreui/react'
import { AppSidebar, AppFooter, AppHeaderChat } from '../components/index'

import "./../chat-app-new/App.css";
import "./../chat-app-new/assets/css/index.css";

// import Loader from "../chat-app-new/components/Loader";
import Home from "../chat-app-new/pages/Home";
import Sidebar from "../chat-app-worker/components/Sidebar";
import Chat from "../chat-app-worker/pages/Chat";

import { AccountContext } from "../chat-app-new/context/AccountProvider";

const ChatsWorker = () => {

  const { personW } = useContext(AccountContext); 

	useEffect(() => {
		document.body.classList.add("dark-theme");
	});   


  return (
            <CContainer lg>
                <Suspense fallback={<CSpinner color="primary" />}>                 
                  
                  <div className="app">
                    <p className="app__mobile-message"> Доступно только на компьютере 😊. </p> 
                    <div className="app-content">
                      <Sidebar />
                      {Object.keys(personW).length ? <Chat /> : <Home /> }
                    </div>
                  </div>

                </Suspense>
            </CContainer>
  )
}

export default ChatsWorker
