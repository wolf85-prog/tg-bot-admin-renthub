import React, { useState, useContext, useEffect, useRef }  from "react";
import { Link, useLocation } from 'react-router-dom'
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'

import { useUsersContext } from '../../../../chat-app-new/context/usersContext'

import Icon from "./../../../components/Icon";
import OptionsBtn from "./../../../components/OptionsButton";
import avatarDefault from "./../../../../chat-app-new/assets/images/no-avatar.png";
import editIcon from './../../../../assets/images/pencil.png'
import Trubka from './../../../../assets/images/trubka.png'

import { 
	CButton
  } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPhone } from '@coreui/icons'

import sendSound from './../../../../chat-app-new/assets/sounds/sendmessage.mp3';
import ishodCall from './../../../../assets/sound/call_out.mp3';

import { getSendCall } from './../../../../http/adminAPI';
  
const Header = ({ user, userH, manager, openProfileSidebar, openSearchSidebar, closeSidebar, showCloseButton, clearFile, setClearFile, clickClearFile  }) => {

	const [press, setPress] = useState(false)

	const { workersAll, setManagerIshod, setShowCallCardManager } = useUsersContext()

	const audio = new Audio(sendSound);
	const audioIshodCall = new Audio(ishodCall);

	const host = process.env.REACT_APP_API_URL

	//console.log("user: ", user)

	const onSelected = (index) => {
		switch(index) {
			case 0: //данные о контакте
				openProfileSidebar()
				break
		  
			case 1: 
				console.log('1')
				break
		  
			default:
				console.log("В разработке")
				break
		  }
	};

	const onImageError = (e) => {
		e.target.src = avatarDefault
	}


	const clickToCall = async(id, type, managerId) => {
		// Button begins to shake
		setPress(true);
		//console.log(id)
        
		// Buttons stops to shake after 2 seconds
		setTimeout(() => setPress(false), 200);

		audioIshodCall.play();
		await getSendCall(id, type, managerId)
	}

	const CustomMenu = React.forwardRef(
		({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
		  const [value, setValue] = useState('')
	
		  return (
			<div
			  ref={ref}
			  style={{
				backgroundColor: '#20272b',
				position: 'absolute',
				top: '65px',
				left: '15px',
				borderRadius: '6px',
				padding: '0 0 0 0',
				fontSize: '14px',      
				minWidth: '50px',
			  }}
			  className={className}
			  aria-labelledby={labeledBy}
			>
			  <ul className="list-unstyled" style={{ marginBottom: '0', padding: '5px 10px' }}>
				{React.Children.toArray(children).filter(
				  (child) => !value || child.props.children?.toLowerCase().startsWith(value),
				)}
			  </ul>
			</div>
		  )
		},
	)
	CustomMenu.displayName = 'Edit'

	const CustomToggleCall = React.forwardRef(({ children, onClick }, ref) => (
		<img
		  src={Trubka}
		  alt=""
		  ref={ref}
		  onClick={(e) => {
			e.preventDefault()
			onClick(e)
		  }}
		  width={15}
		  style={{ cursor: 'pointer', width: '20px', marginLeft: '15px' }}
		>
		  {children}
		</img>
	  ))
	
	CustomToggleCall.displayName = 'Call'


	const changeCallManager = async (eventkey) => {
		if (eventkey.split(' ')[0] === '101' || eventkey === '101') {
		  console.log(eventkey)
	
		  const managerChatId = parseInt(eventkey.split(' ')[1]) //mainspec.find((item, index) => index === parseInt(eventkey.split(' ')[2]))
	
		  if (managerChatId) {
			const worker = workersAll.find(item2=> item2.chatId === managerChatId.toString())
			//console.log("worker id: ", workersAll, worker)
			if (worker) {
			  setManagerIshod({fio: worker?.fio, city: worker?.city, avatar: worker?.avatar})
			  setShowCallCardManager(true)
			  clickToCall(managerChatId, 'm', '12')
			}
		  }
		} else if (eventkey.split(' ')[0] === '102' || eventkey === '102') {
			const managerChatId = parseInt(eventkey.split(' ')[1]) //mainspec.find((item, index) => index === parseInt(eventkey.split(' ')[2]))
	
			if (managerChatId) {
				const worker = workersAll.find(item2=> item2.chatId === managerChatId.toString())
				//console.log("worker id: ", workersAll, worker)
				if (worker) {
				setManagerIshod({fio: worker?.fio, city: worker?.city, avatar: worker?.avatar})
				setShowCallCardManager(true)
				clickToCall(managerChatId, 'm', '10')
				}
			}
		}
	}

	return (
		<header className="headerB chat__header">
			<div className="chat__avatar-wrapper" onClick={openProfileSidebar}>
				{
					user.avatar
					? <img src={`${user.avatar}`} onError={onImageError} alt={user?.name} className="avatar-adm" />
					: <img src={avatarDefault} alt={user?.name} className="avatar-adm" />
				}
			</div>

			<div className="chat__contact-wrapper" onClick={openProfileSidebar}>
				<h2 className="chat__contact-name">{userH?.company} | {user?.name ? user?.name.split(' ')[0] : ''} {user?.name ? user?.name.split(' ')[1]: ''} {user?.name ? user?.name.split(' ')[2] : ''} </h2>
				<p className="chat__contact-desc">
					{user.typing ? "печатает..." : "данные контакта"}
				</p>
			</div>
			<div className="chat__actions">
				{clearFile ? <CButton color="danger" onClick={clickClearFile}>Очистить</CButton> : ''}

				<Dropdown onSelect={changeCallManager}>
					<Dropdown.Toggle
						as={CustomToggleCall}
						//id="dropdown-custom-components"
						key={user?.id}
						id={`dropdown-button-drop-${user?.id}`}
						drop={'up'}
					></Dropdown.Toggle>
					<Dropdown.Menu as={CustomMenu}>
					<Dropdown.Item eventKey={`101 ${user?.id}`}>
						Менеджер №1
					</Dropdown.Item>
					<Dropdown.Item eventKey={`102 ${user?.id}`}>
						Менеджер №2
					</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>

				<Link to={'https://proj.uley.team:3000/' + manager[0]?.id}>
					<button
						className="chat__action"
						aria-label="profile"
					>
						<img src={editIcon} width={18} alt='' style={{verticalAlign: 'text-bottom'}} />
					</button>
				</Link>
				
				<button
					className="chat__action"
					aria-label="Search"
					onClick={openSearchSidebar}
				>
					<Icon
						id="search"
						className="chat__action-icon chat__action-icon--search"
					/>
				</button>


				{/* <OptionsBtn
					className="chat__action"
					ariaLabel="Menu"
					iconId="menu"
					iconClassName="chat__action-icon"
					onSelected={onSelected}
					options={[
						"Данные о контакте",
						"Очистить переписку",
						"Удалить чат",
					]}
				/> */}

				<button onClick={closeSidebar} style={{marginLeft: '15px', display: showCloseButton ? "block": "none"}}>
					<Icon id="cancel" className="chat-sidebar__header-icon-close" />
				</button>
			</div>
		</header>
	);
};

export default Header;
