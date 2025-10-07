import React, { Suspense, useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'

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

import { getRMessages2} from '../http/renthubAPI'

const ChatRentPerson = () => {

  const params = useParams();
  const managerId = params.id;

  const { userRenthub, setUserRenthub, workersAll } = useUsersContext();
  const { personW, setPersonW } = useContext(AccountContext); 

	useEffect(() => {
		document.body.classList.add("dark-theme");
	}); 
  
  useEffect(() => {

    const users = localStorage.getItem("userRenthub");

    console.log("userRenthub: ", userRenthub, JSON.parse(users).length)
    console.log("id: ", managerId)
    
    const contact = JSON.parse(users).find(item => item.id === parseInt(managerId))
    console.log("contact: ", contact)

		setPersonW({
      name: contact?.name, 
      id: contact?.chatId, 
			avatar: contact?.avatar,
      managerId: contact?.id
    });


    const fetchMessage = async()=> {
      if (contact?.messages && Object.keys(contact?.messages).length === 0) {
          console.log("Сообщения не загружены!")
          const messages = await getRMessages2(contact.conversationId, 10, 0)
          //console.log("messages: ", messages)
    
          const arrayMessage = []
            const allDate = []
            
            if (messages) {
              [...messages].map(message => {
                const d = new Date(message.createdAt);
                const year = d.getFullYear();
                const month = String(d.getMonth()+1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                const chas = d.getHours();
                const minut = String(d.getMinutes()).padStart(2, "0");
              
                const newDateMessage = `${day}.${month}.${year}`
            
                const newMessage = {
                  date: newDateMessage,
                  content: message.text,
                  image: message.type === 'image' ? true : false,
                  descript: message.buttons ? message.buttons : '',
                  sender: message.senderId,
                  time: chas + ' : ' + minut,
                  status: 'sent',
                  id:message.messageId,
                  reply:message.replyId,
                }
                arrayMessage.push(newMessage)
                allDate.push(newDateMessage)
              })
            }	
            
            const dates = [...allDate].filter((el, ind) => ind === allDate.indexOf(el));
            
            let obj = {};
            for (let i = 0; i < dates.length; i++) {
              const arrayDateMessage = []
              for (let j = 0; j < arrayMessage.length; j++) {
                if (arrayMessage[j].date === dates[i]) {
                  arrayDateMessage.push(arrayMessage[j])							
                }
              }	
              obj[dates[i]] = arrayDateMessage;
            }
    
            //console.log("obj: ", obj)
    
            //сохранить сообщения в контексте пользователя
            setUserRenthub((userRenthub) => {
              let userIndex = userRenthub.findIndex((user) => user.chatId === contact?.chatId);
              const usersCopy = JSON.parse(JSON.stringify(userRenthub));
              console.log("userIndex: ", userIndex)
              if (usersCopy.length > 0 && userIndex >= 0) {
                usersCopy[userIndex].messages = obj
              }           
    
              return usersCopy;
            })
        } else {
          //console.log(contact.conversationId)
        }
    }

    fetchMessage()

    
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
