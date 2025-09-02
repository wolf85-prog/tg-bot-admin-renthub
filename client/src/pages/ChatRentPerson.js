import React, { Suspense, useEffect, useState, useContext } from 'react'
import { useUsersContext } from "../chat-app-new/context/usersContext";
import { CContainer, CSpinner, CNav, CNavLink, CNavItem } from '@coreui/react'
import { AppSidebar, AppFooter, AppHeaderChat } from '../components/index'

import "./../chat-app-new/App.css";
import "./../chat-app-new/assets/css/index.css";

// import Loader from "../chat-app-new/components/Loader";
import Home from "../chat-app-new/pages/Home";
import Sidebar from "../chat-app-worker/components/Sidebar";
import Chat from "../chat-app-worker/pages/Chat";

import { AccountContext } from "../chat-app-new/context/AccountProvider";

const ChatRentPerson = () => {

  const { personW, setPersonW } = useContext(AccountContext); 
  const { workersAll } = useUsersContext()

	useEffect(() => {
		document.body.classList.add("dark-theme");
	}); 
  
  useEffect(() => {
    console.log("workersAll: ", workersAll)
    console.log("id: ", 1172)
    const contact = workersAll.find(item => item.id === 1172)
    console.log("contact: ", contact)

		setPersonW({
      name: contact.fio, 
      id: contact.chatId, 
			avatar: contact.avatar
    });
	}, []); 


  return (
    <div>
    <AppSidebar />
    <div className="wrapper d-flex flex-column min-vh-100 bg-uley">
      <AppHeaderChat />
      <div className="body flex-grow-1 px-3">

          <CContainer lg>
              <Suspense fallback={<CSpinner color="primary" />}>                 
                
                <div className="app">
                  <p className="app__mobile-message"> Доступно только на компьютере 😊. </p> 
                  <div className="app-content">
                    <Sidebar />
                    <Chat />
                  </div>
                </div>

              </Suspense>
          </CContainer>

      </div>
      <AppFooter />
    </div>
  </div>
  )
}

export default ChatRentPerson
