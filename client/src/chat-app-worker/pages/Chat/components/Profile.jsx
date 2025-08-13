import React, { useState, useContext, useEffect, useRef } from "react";
import { useUsersContext } from "../../../../chat-app-new/context/usersContext";
import { AccountContext } from './../../../../chat-app-new/context/AccountProvider';
import { Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap'


import Icon from "./../../../components/Icon";
import { getLastPretendent, getProjectId, blockedWorkers, getWorker } from './../../../../http/workerAPI';
import { getSendCall } from './../../../../http/adminAPI';

import defaultAvatar from "./../../../../chat-app-new/assets/images/no-avatar.png";
import Trubka from './../../../../assets/images/trubka_green.png';

import { $host } from './../../../../http/index';
import sendSound from './../../../../chat-app-new/assets/sounds/sendmessage.mp3';
import ishodCall from './../../../../assets/sound/call_out.mp3';


const Profile = ({ user, closeSidebar }) => {

	const { workersAll, setManagerIshod, setShowCallCardManager } = useUsersContext()

	//console.log('user: ', user)
	const chatAdminId = process.env.REACT_APP_CHAT_ADMIN_ID
	const token = process.env.REACT_APP_TELEGRAM_API_TOKEN_WORK
	const host = process.env.REACT_APP_HOST
	const webAppPassport = process.env.REACT_APP_WEBAPP_PASSPORT
	const webAppAnketa = process.env.REACT_APP_WEBAPP_ANKETA

	const [username, setUsername] = useState("")
	//const [worker, setWorker] = useState("")
	const [manager, setManager] = useState("")
	const [avatar, setAvatar] = useState("")
	const [form, setForm] = useState(false)
	const { addNewName, addNewAvatar } = useUsersContext();
	const { userWorkers } = useUsersContext();
	const { addNewMessage2 } = useUsersContext();
	const { setPersonW } = useContext(AccountContext);
	const [img, setImg] = useState(null)
	const [showEdit, setShowEdit] = useState(false)
	const input = React.useRef();

	const [phone, setPhone] = useState("")
	const [showButton, setShowButton] = useState(false)
	const [blockWorker, setBlockWorker] = useState(false)
	const [press, setPress] = useState(false)

	const audio = new Audio(sendSound);
	const audioIshodCall = new Audio(ishodCall);

	//select
    const [selectedElement, setSelectedElement] = useState("")
	const [scenari, setScenari] = useState("")

	const [heightImage, setHeightImage] = useState({})

	const divBlock = useRef(null);

	const [crmId, setCrmId] = useState("")
	const [crmId2, setCrmId2] = useState("")
	const [crmId3, setCrmId3] = useState("")

	useEffect(() => {
		setImg(`${host}${user.avatar}`)
		//console.log(user)

		//получить данные из ноушена по телеграм id
		const fetchData = async () => {
			//console.log("user: ", user)
			//const fio_notion = await getManagerNotion(user.chatId)
			//console.log("manager: ", fio_notion[0])
			//setManager(fio_notion[0])

			//const avatars = await getWorkerChildrenId(fio_notion[0]?.id)
			//const avatars = await getWorker(user.chatId)
			setAvatar(user.avatar)
		}

		fetchData();
	}, [user]);

	useEffect(() => {
		console.log("user: ", user)

		setTimeout(()=>{
			setHeightImage(divBlock.current.getBoundingClientRect())

			var imgsize = new Image();

			imgsize.onload = function(){
				var height = imgsize.height;
				var width = imgsize.width;

				// code here to use the dimensions
				//console.log("height: ", height, "width: ", width)
			}

			imgsize.src = user?.avatar;
		}, 2000)
		
		setPhone(user.phone)
		
		// if (user.phone?.includes('-')) {
		// 	setPhone(user.phone)
		// } else {
		// 	let str = user.phone
		// 	//setPhone(`+7 (${str.slice(1, 4)}) ${str.slice(4, 7)}-${str.slice(7, 9)}-${str.slice(9, 11)}`)
		// 	setPhone(user.phone)
		// }
		
	}, [user])


	useEffect(()=>{

		const fetch = async() => {
			setCrmId('—')	
		}
		
		fetch()
	}, [user])

	const clickSetBlocked = () => {
		setBlockWorker(!blockWorker)
		//заблокировать/разблокировать пользователю рассылки
		blockedWorkers(user.chatId)
	}
	
	const onImageError = (e) => {
		e.target.src = defaultAvatar
	}

	const clickToCall = async(id, type, managerId) => {
		// Button begins to shake
		setPress(true);
		console.log(press)
        
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
			  width={25}
			  style={{ cursor: 'pointer'}}
			>
			  {children}
			</img>
		))
		
	CustomToggleCall.displayName = 'Call'

	const CustomToggleCall2 = React.forwardRef(({ children, onClick }, ref) => (
			<p 
				className="profile__success-text profile__worker" 
				ref={ref}
				onClick={(e) => {
					e.preventDefault()
					onClick(e)
				}}>Позвонить
			  {children}
			</p>
		))
		
	CustomToggleCall2.displayName = 'Call2'

	const CustomMenu2 = React.forwardRef(
			({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
			  const [value, setValue] = useState('')
		
			  return (
				<div
				  ref={ref}
				  style={{
					backgroundColor: '#20272b',
					position: 'absolute',
					top: '65px',
					right: '65px',
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
	CustomMenu2.displayName = 'Edit2'


	const changeCallManager = async (eventkey) => {
        if (eventkey.split(' ')[0] === '101' || eventkey === '101') {
          console.log(eventkey)
      
          const manager = parseInt(eventkey.split(' ')[1]) //mainspec.find((item, index) => index === parseInt(eventkey.split(' ')[2]))
      
          if (manager) {
            const managerItem = workersAll.find(item2=> item2.chatId === manager.toString())
            //console.log("worker id: ", workersAll, worker)
            if (managerItem) {
              setManagerIshod({fio: managerItem?.fio, city: managerItem?.city, avatar: managerItem?.avatar})
              setShowCallCardManager(true)
              clickToCall(manager, 'm', '12')
            }
          }
        } else if (eventkey.split(' ')[0] === '102' || eventkey === '102') {

          const manager = parseInt(eventkey.split(' ')[1]) //mainspec.find((item, index) => index === parseInt(eventkey.split(' ')[2]))
      
          if (manager) {
            const managerItem = workersAll.find(item2=> item2.chatId === manager.toString())
            //console.log("worker id: ", workersAll, worker)
            if (managerItem) {
              setManagerIshod({fio: managerItem?.fio, city: managerItem?.city, avatar: managerItem?.avatar})
              setShowCallCardManager(true)
              clickToCall(manager, 'm', '10')
            }
          }
        }
    }

	return (
		<div className="profile">
			<div className="profile__sectionW profile__sectionW--personal">
				<div className="profile__avatar-wrapperW profile__avatar-worker" ref={divBlock}>
					{
						user?.avatar
							? <img src={user?.avatar} onError={onImageError} alt={user?.name} width='100%' height={heightImage.width} style={{objectFit: 'cover'}} />//<img src={`${host}${user.avatar}`} alt={user?.name} className="avatar-adm" />
							: <img src={defaultAvatar} alt={user?.name} width='100%' height={heightImage.width} style={{objectFit: 'cover'}} />
					}
				</div>
				<h2 className="profile__name" style={{textAlign: 'center'}}>{user?.name.split(' ')[0]} {user?.name.split(' ')[1]}</h2>
			</div>

			<ul className="profile__sectionW profile__section--actions">	

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<span className="profile__action-text--bottom">
							Компания
						</span>
						<span className="profile__action-text--top profile__notion">
							{user ? 
							(user.company !== '' ? user.company : "—")
							: "—"}
						</span>
					</p>
				</li>

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<span className="profile__action-text--bottom">
							Телефон
						</span>
						<span className="profile__action-text--top profile__notion">
							{user ? 
							(user.phone !== null ? user.phone : "—")
							: "—"}
						</span>
					</p>
				</li>	

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<span className="profile__action-text--bottom">
							Должность
						</span>
						<span className="profile__action-text--top profile__notion">
						{user ? 
							(user.dolgnost ? user.dolgnost : "—")
							: "—"}
						</span>	
					</p>
				</li>		

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<span className="profile__action-text--bottom">
							Город
						</span>
						<span className="profile__action-text--top profile__notion">
						{user ? 
							(user.city !== null ? user.city : "—")
							: "—"}
						</span>	
					</p>
				</li>			

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<span className="profile__action-text--bottom">
							Сфера деятельности
						</span>
						<span className="profile__action-text--top profile__notion" style={{textAlign: 'right'}}>
							<table className="table-noborder">{user.sfera ? JSON.parse(user.sfera).map((man, index) => <tr key={index}><td>{man.name}</td></tr> ) : '—'}</table> 
						</span>	
					</p>
				</li>

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<span className="profile__action-text--bottom">
							Ник / ID
						</span>
						
						<span className="profile__action-text--top profile__notion">
							{user.chatId}
							<div style={{fontSize: '16px', color: '#656565'}}>{user.username ? `@${user.username}` : user.username}</div>				
						</span>
					</p>
				</li>

				<li className="profile__actionW">
					<p className="profile__actionW-left">
						<div style={{display: 'flex', justifyContent: 'space-between'}}>
							<span className="profile__action-text--bottom">
								Проекты
							</span>
							<span className="profile__action-text--top" style={{marginRight: '15px'}}>0</span>
						</div>
						
						{/* <span className="profile__action-text--top profile__notion" style={{textAlign: 'right'}}>
							—
							<table className="table-noborder">{worker ? worker.spec?.map((worker, index) => <tr key={index}><td>{worker.name}</td></tr> ) : '—'}</table> 
						</span>	*/}
					</p>

				</li>
			</ul>

			<div 
				className="profile__sectionW profile__section--success" 
				style={{cursor: 'pointer', backgroundColor: press ? '#0e1518' : '#131c21'}} 
			>
				{/* <CIcon icon={cilPhone} className="profile__success-icon" /> */}
				{/* <Icon id="phone" className="profile__success-icon" />
				<p className="profile__success-text profile__proj">Позвонить</p> */}
				<Dropdown onSelect={changeCallManager}>
					<Dropdown.Toggle
						as={CustomToggleCall}
						//id="dropdown-custom-components"
						key={user?.chatId}
						id={`dropdown-button-drop-${user?.chatId}`}
						drop={'up'}
					></Dropdown.Toggle>
					<Dropdown.Menu as={CustomMenu}>
					<Dropdown.Item eventKey={`101 ${user?.chatId}`}>
						Менеджер №1
					</Dropdown.Item>
					<Dropdown.Item eventKey={`102 ${user?.chatId}`}>
						Менеджер №2
					</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>

				{/* <p className="profile__success-text profile__worker">Позвонить</p> */}
				<Dropdown onSelect={changeCallManager}>
					<Dropdown.Toggle
						as={CustomToggleCall2}
						//id="dropdown-custom-components"
						key={user?.chatId}
						id={`dropdown-button-drop-${user?.chatId}`}
						drop={'up'}
					></Dropdown.Toggle>
					<Dropdown.Menu as={CustomMenu2}>
					<Dropdown.Item eventKey={`101 ${user?.chatId}`}>
						Менеджер №1
					</Dropdown.Item>
					<Dropdown.Item eventKey={`102 ${user?.chatId}`}>
						Менеджер №2
					</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown>
			</div>

			<div className="profile__sectionW profile__sectionW--danger">
				<Icon id="block" className="profile__danger-icon" />
				<p className="profile__danger-text profile__proj" style={{cursor: 'pointer'}} onClick={clickSetBlocked}>{blockWorker ? 'Разблокировать' : 'Заблокировать'}</p>
			</div>

			<div className="profile__sectionW profile__sectionW--danger">
				<Icon id="delete" className="profile__danger-icon" />
				<p className="profile__danger-text profile__proj"> Очистить переписку </p>
			</div>

			<div className="profile__sectionW profile__sectionW--danger">
				<Icon id="delete" className="profile__danger-icon" />
				<p className="profile__danger-text profile__proj"> Удалить чат </p>
			</div>
		</div>
	);
};

export default Profile;
