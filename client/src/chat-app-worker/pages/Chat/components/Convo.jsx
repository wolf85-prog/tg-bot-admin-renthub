import Icon from "./../../../components/Icon";
import React, { useContext, useState, useRef, useEffect } from "react";

import { CSpinner } from '@coreui/react'

// import pdf from "./../../../assets/images/PDFicon.png";
import docIcon from "./../../../../chat-app-new/assets/images/DOCicon.jpg";
import xlsIcon from "./../../../../chat-app-new/assets/images/XLSicon.png";
import pdf from "./../../../../chat-app-new/assets/images/PDFicon.png";
import formatTime from "./../../../../chat-app-new/utils/formatTime";
import { AccountContext } from './../../../../chat-app-new/context/AccountProvider';
import { useUsersContext } from "../../../../chat-app-new/context/usersContext";
import { $host } from './../../../../http/index'
import { getWMessages2 } from "src/http/workerAPI";
import { delRMessage } from "src/http/renthubAPI";
import Dropdown from 'react-bootstrap/Dropdown';
import imageIcon from "./../../../assets/images/sp-i-m-image-placeholder.svg";
import { delMessageToTelegram } from "src/http/telegramAPI";

const Convo = ({ lastMsgRef, messages: allMessages, convId }) => {
	const { personW } = useContext(AccountContext);
	
	const chatAdminId = process.env.REACT_APP_CHAT_ADMIN_ID 
	const tokenR = process.env.REACT_APP_TELEGRAM_API_TOKEN_RENTHUB

	const [showImage, setShowImage] = useState([false])
	const [loading, setLoading]= useState(false);

	const [newMessages, setNewMessages] = useState([])
	const [dates, setDates] = useState([])
	const [allArr, setAllArr] = useState(0)

	//const dates = Object.keys(allMessages);  //['01/01/2023', 'Сегодня']

	const msgRef = useRef([]);

	let replyMessage;
	let array = []

	const { delRMessageContext } = useUsersContext();

	useEffect(() => {
		setDates(Object.keys(allMessages))  //['01/01/2023', 'Сегодня']
		setNewMessages(allMessages)

		//console.log("array: ", allMessages)

		const objDate = Object.keys(allMessages)
		
		objDate.map((date, dateIndex) => {
			array.push(...allMessages[date]) //allMessages[date];
		}) 
		//console.log("array: ", array)
		setAllArr(array.length)
		
	}, [allMessages])

	useEffect(() => {
		setDates(Object.keys(newMessages))  //['01/01/2023', 'Сегодня']
		
	}, [newMessages])

	const startLoadMessages = async() => {
        console.log('convId: ', convId)
		setLoading(!loading)

		console.log("array: ", allArr)

		const newMess = await getWMessages2(convId, 20, allArr)
		console.log("newMessages: ", newMess.length + allArr)

		setAllArr(newMess.length + allArr)

		const arrayMessage = []
		const allDate = []

		if (newMess && newMess.length > 0) {
			newMess.map(message => {
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
		console.log("obj: ", obj)

		if (Object.keys(obj).length !== 0) {
			setNewMessages(obj)
		}

		setLoading(false)
    }


	//прокрутка
	const scrollToMsg = (id) => {
		console.log(id)
		//alert(id)
		console.log(msgRef.current)
		msgRef.current[id].scrollIntoView({transition: "smooth"});
	};

	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<button
			aria-label="Message options"
			className="chat__msg-options"
			style={{right: '0', top: '0px'}}
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
			<Icon id="downArrow" className="chat__msg-options-icon" />											
		</button>
	));

	const CustomToggleBottom = React.forwardRef(({ children, onClick }, ref) => (
		<button
			aria-label="Message options"
			className="chat__msg-options"
			style={{right: '0', top: '-35px'}}
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
			<Icon id="downArrow" className="chat__msg-options-icon" />											
		</button>
	));

	const CustomToggle2 = React.forwardRef(({ children, onClick }, ref) => (
		<button
			aria-label="Message options"
			className="chat__msg-options"
			style={{right: '0', top: '-20px'}}
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
			<Icon id="downArrow" className="chat__msg-options-icon" />											
		</button>
	));

	CustomToggle.displayName = "Del";
	CustomToggle2.displayName = "Del2";
	CustomToggleBottom.displayName = "Del3";

	const CustomMenu = React.forwardRef(
		({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
		  const [value, setValue] = useState('');
	  
		  return (
			<div
			  ref={ref}
			  style={{backgroundColor: '#20272b', left: 0, borderRadius: '15px', padding: '0 0 0 0', fontSize: '14px', top: '10px', minWidth:'50px'}}
			  className={className}
			  aria-labelledby={labeledBy}
			>
			  <ul className="list-unstyled" style={{marginBottom: '0'}}>
				{React.Children.toArray(children).filter(
				  (child) =>
					!value || child.props.children?.toLowerCase().startsWith(value),
				)}
			  </ul>
			</div>
		  );
		},
	);

	const CustomMenu2 = React.forwardRef(
		({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
		  const [value, setValue] = useState('');
	  
		  return (
			<div
			  ref={ref}
			  style={{backgroundColor: '#20272b', right: 0, borderRadius: '15px', padding: '0 0 0 0', fontSize: '14px', top: '10px', minWidth:'50px'}}
			  className={className}
			  aria-labelledby={labeledBy}
			>
			  <ul className="list-unstyled" style={{marginBottom: '0'}}>
				{React.Children.toArray(children).filter(
				  (child) =>
					!value || child.props.children?.toLowerCase().startsWith(value),
				)}
			  </ul>
			</div>
		  );
		},
	);

	const CustomMenuBottom = React.forwardRef(
		({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
		  const [value, setValue] = useState('');
	  
		  return (
			<div
			  ref={ref}
			  style={{backgroundColor: '#20272b', right: 0, borderRadius: '15px', padding: '0 0 0 0', fontSize: '14px', bottom: '-28px', minWidth:'50px'}}
			  className={className}
			  aria-labelledby={labeledBy}
			>
			  <ul className="list-unstyled" style={{marginBottom: '0'}}>
				{React.Children.toArray(children).filter(
				  (child) =>
					!value || child.props.children?.toLowerCase().startsWith(value),
				)}
			  </ul>
			</div>
		  );
		},
	);

	CustomMenu.displayName = CustomMenu
	CustomMenu2.displayName = CustomMenu2
	CustomMenuBottom.displayName = CustomMenuBottom

	const change = async (eventkey) => {
		//alert(`you chosen: ${eventkey}`)
		const message = JSON.parse(eventkey);
		console.log("message: ", message)

		//удалить сообщение через сокет
		delRMessageContext(message.id, message.date, message.chatId)

		//удалить сообщение в базе данных
		await delRMessage(message.id)

		//const url_del_msg = `https://api.telegram.org/bot${tokenR}/deleteMessage?chat_id=${personW.id}&message_id=${message.id}`
		//const delToTelegram = await $host.get(url_del_msg);
		const delToTelegram = await delMessageToTelegram({user: personW.id, messageId: message.id})

		console.log("Удаляемое сообщение: ", message.id)
		console.log("Дата сообщения: ", message.date)

		//Выводим сообщение об успешной отправке
		if (delToTelegram) {
			console.log('Ваше сообщение удалено из телеграм! ', delToTelegram);	
		}           
		//А здесь сообщение об ошибке при отправке
		else {
			console.log('Что-то пошло не так. Попробуйте ещё раз.');
		}		
	}

	const handleClick = (ind) => {
        //console.log(ind, showImage)
		window.event.stopPropagation();	

        setShowImage(prevShownImage => ({
            ...prevShownImage,
            [ind]: !prevShownImage[ind]
        }));

		// setTimeout(()=> {
		// 	setShowImage(false)
		// }, 30000)

    }

	const findLinksWithPrefix = (text)=> {
		const prefix = "http://" // Список известных префиксов ссылок

		const regex = new RegExp(`\\b${prefix}.*\\b`, 'i'); // \\b - граница слова, 'i' - без учета регистра
		const match = text.match(regex);
		if (match) {
			return match[0];
		}
		return null;
	}


	return dates.map((date, dateIndex) => {
		const messages = newMessages[date] //allMessages[date]; 
		
		return (
			<div key={dateIndex}>
				{dateIndex === 0 && (
					<>
						<div className="chat__date-wrapper">{loading && <CSpinner/>}</div>
					
						<div className="chat__date-wrapper" style={{cursor: 'pointer', textAlign: 'end'}}>
							<span className="chat__date" onClick={startLoadMessages}>Загрузить ещё</span>
						</div>
					</>
				)}
				
				<div key={dateIndex} className="chat__date-wrapper">
					<span className="chat__date"> {date}</span>
				</div>
				{dateIndex === 0 && (

					<p className="chat__encryption-msg">
						<Icon id="lock" className="chat__encryption-icon" />
						Сообщения шифруются сквозным шифрованием. Никто за пределами этого чата не может читать или слушать их
					</p>
				)}
				<div className="chat__msg-group" >
					{messages.map((message, msgIndex) => {	
						
						//получить сообщение по его id
						if (message.content?.includes('_reply_')) {
							replyMessage = message?.content.split('_reply_')[0] //messages.find(mess=> mess.id === message.content.split('_reply_')[0])
					   	} 

						const assignRef = () =>
							dateIndex === dates.length - 1 && msgIndex === messages.length - 1
								? lastMsgRef
								: undefined;
						return (
							<>
								{message.image ? (	//картинки		
									<div
										className={`chat__msg chat__img-wrapper ${
											message.sender !== chatAdminId ? "chat__msg_img--rxd" : "chat__msg_img--sent"
										}`}
										ref={assignRef()}
									>
										{message.content.endsWith('.pdf') ? ( //pdf		
										<figure >
											<img src={pdf} width={30}/>
											<a href={message.content} target="_blank" rel="noreferrer">{message.content.includes("pre") ? "Предварительная смета" : (message.content.includes("final") ? "Финальная смета" : message.content) }</a>
											{/* <iframe src={message.content} height="235px" width="100%" title="myFramePdf"/> */}
											
											{/* footer */}
											<span className="chat__msg_img-footer">
													<span>{formatTime(message.time)}</span>
														{!message.sender && (
															<Icon
																id={
																	message?.status === "sent"
																		? "singleTick"
																		: "doubleTick"
																}
																aria-label={message?.status}
																className={`chat__msg-status-icon ${
																	message?.status === "read"
																		? "chat__msg-status-icon--blue"
																		: ""
																}`}
															/>
														)}
											</span>

											<Dropdown onSelect={change}>
												<Dropdown.Toggle as={CustomToggleBottom} id="dropdown-custom-components">											
												</Dropdown.Toggle>
												<Dropdown.Menu as={CustomMenuBottom}>
												<Dropdown.Item eventKey={JSON.stringify({id: message.id, date: message.date, chatId: personW.id})}>Удалить</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>	
										</figure>) : 
											message.content.endsWith('.xlsx') 
											? <figure> 
												<img src={xlsIcon} width={30}/>
												<a href={message.content} target="_blank" rel="noreferrer">{message.content}</a> 
												{/* footer */}
												<span className="chat__msg_img-footer">
														<span>{formatTime(message.time)}</span>
															{!message.sender && (
																<Icon
																	id={
																		message?.status === "sent"
																			? "singleTick"
																			: "doubleTick"
																	}
																	aria-label={message?.status}
																	className={`chat__msg-status-icon ${
																		message?.status === "read"
																			? "chat__msg-status-icon--blue"
																			: ""
																	}`}
																/>
															)}
												</span>

												<Dropdown onSelect={change}>
													<Dropdown.Toggle as={CustomToggleBottom} id="dropdown-custom-components">											
													</Dropdown.Toggle>
													<Dropdown.Menu as={CustomMenuBottom}>
													<Dropdown.Item eventKey={JSON.stringify({id: message.id, date: message.date, chatId: personW.id})}>Удалить</Dropdown.Item>
													</Dropdown.Menu>
												</Dropdown>	
											</figure> 
											: message.content.endsWith('.docx') 
											? <figure> 
												<img src={docIcon} width={30}/>
												<a href={message.content} target="_blank" rel="noreferrer">{message.content}</a> 
												{/* footer */}
												<span className="chat__msg_img-footer">
														<span>{formatTime(message.time)}</span>
															{!message.sender && (
																<Icon
																	id={
																		message?.status === "sent"
																			? "singleTick"
																			: "doubleTick"
																	}
																	aria-label={message?.status}
																	className={`chat__msg-status-icon ${
																		message?.status === "read"
																			? "chat__msg-status-icon--blue"
																			: ""
																	}`}
																/>
															)}
												</span>

												<Dropdown onSelect={change}>
													<Dropdown.Toggle as={CustomToggleBottom} id="dropdown-custom-components">											
													</Dropdown.Toggle>
													<Dropdown.Menu as={CustomMenuBottom}>
													<Dropdown.Item eventKey={JSON.stringify({id: message.id, date: message.date, chatId: personW.id})}>Удалить</Dropdown.Item>
													</Dropdown.Menu>
												</Dropdown>	
											</figure> 
											: (
											<figure style={{margin:showImage[msgIndex + personW.id] ? '0 0 3rem': '0 0 1rem', position: 'relative'}}>
												{showImage[msgIndex + personW.id]  
												? <a href={message.content} target="_blank" rel="noreferrer"><img src={message.content} alt="" className="chat__img" /></a>	
												: <div 
													onClick={()=>handleClick(msgIndex + personW.id)}
													style={{
														width: '100%', 
														height: '100px', 
														backgroundColor: '#3179a3', 
														borderRadius: '10px', 
														padding: '25px 75px',
														textAlign: 'center',
														position: 'relative',
														cursor: 'pointer',
													}}>
														<div onClick={()=>console.log("console")}>
															{/* <a href={message.content} target="_blank" rel="noreferrer"> */}
																<img src={imageIcon} alt="" className="chat__img"  style={{width: '50px'}}/>
															{/* </a> */}
														</div>	
													
												</div>}

												{/* footer */}
												<span className="chat__msg_img-footer">
													<span>{formatTime(message.time)}</span>
														{!message.sender && (
															<Icon
																id={
																	message?.status === "sent"
																		? "singleTick"
																		: "doubleTick"
																}
																aria-label={message?.status}
																className={`chat__msg-status-icon ${
																	message?.status === "read"
																		? "chat__msg-status-icon--blue"
																		: ""
																}`}
															/>
														)}
												</span>
												
												{/*<figcaption style={{textAlign: 'center', borderRadius: '5px'}}>
													{message.descript}
													 <div style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0'}}>
														<div style={{width:'100px', height: '30px', backgroundColor: '#7b7777', borderRadius: '10px', padding: '3px 0'}}>Принять</div>
														<div style={{width:'100px', height: '30px', backgroundColor: '#7b7777', borderRadius: '10px', padding: '3px 0'}}>Отклонить</div>
													</div> 
												</figcaption>*/}

										<Dropdown onSelect={change}>
											<Dropdown.Toggle as={CustomToggleBottom} id="dropdown-custom-components">											
											</Dropdown.Toggle>
											<Dropdown.Menu as={CustomMenuBottom}>
											<Dropdown.Item eventKey={JSON.stringify({id: message.id, date: message.date, chatId: personW.id})}>Удалить</Dropdown.Item>
											</Dropdown.Menu>
										</Dropdown>	

											</figure>)
										}
										
									</div>
								) : message.sender !== chatAdminId ? (
									<p className="chat__msg chat__msg--rxd" ref={assignRef()}>
										<div className="flex-row" ref={el => msgRef.current[message.id] = el} >
											{/* пересылаемое сообщение */}
											{message.content?.includes('_reply_') 
											? <div className="chat__msg--reply" onClick={()=>scrollToMsg(message.reply)}>
												<div className="reply__content">
													<div className="reply__full">
														<span className="reply__left"></span>
														<div className="reply__pad">
															<div className="reply__contact">U.L.E.Y</div>
															<div className="reply__text">
																{/* {replyMessage?.content.endsWith('.pdf') ? (
																<figure>
																	<iframe src={message.content} height="50px" width="50px" title="myFramePdf"/>
																</figure>) : (
																<figure>
																	<a href={replyMessage?.content} target="_blank" rel="noreferrer"><img src={replyMessage?.content} alt="" width='50px' height='50px' /></a>
																	<figcaption style={{textAlign: 'center', backgroundColor: '#607a7a', borderRadius: '5px'}}></figcaption>
																</figure>
																)} */}
																{replyMessage?.startsWith('http') ?
																	<a href={replyMessage} target="_blank" rel="noreferrer"><img src={replyMessage} alt='' width='50px' height='50px' /></a>
																	: replyMessage
																}
															</div>
														</div>
													</div>
													
												</div>
											</div>
											: <span>
												{/* {
												message.content?.includes('https://') 
												? 
												(message.content.split(" ").map((item, index) => (
													item.startsWith('https://') ?
													<a key={index} className="chat__href" href={item} target="_blank" rel="noreferrer">{item}</a> 
													: <span key={index}>{item}</span>	
												))
												: message.content)} */}
											</span>
											}
											<span>
												{/* {message.content?.startsWith('http') 
												? <a className="chat__href" href={message.content} target="_blank" rel="noreferrer">{message.content}</a> 
												: message.content.includes('_reply_') ? message.content.split('_reply_')[1] : message.content}  */}
												{message.content?.includes('_reply_') 
												? message.content.split('_reply_')[1] 
												: 
													(message.content.split(' ').map((item, index) => (
														item.startsWith('https://') ?
														<a key={index} className="chat__href" href={item} target="_blank" rel="noreferrer">{item.length > 20 ? item.substring(0, 20) + "..." : item}</a> 
														: (item.length > 25 ? 
															<a key={index} className="chat__href" href={item} target="_blank" rel="noreferrer">{item.substring(0, 25) + "..."}</a>
															:<span key={index}>{item + ' '}</span>
														   )	
														))
													)
												}
											</span>
											<span className="chat__msg-filler"> </span>
											<span className="chat__msg-footer">
												{formatTime(message.time)}
											</span>
										</div>	
											<Dropdown onSelect={change}>
												<Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">											
												</Dropdown.Toggle>
												<Dropdown.Menu as={CustomMenu}>
												<Dropdown.Item eventKey={JSON.stringify({id: message.id, date: message.date, chatId: personW.id})}>Удалить</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>									
									</p>
								) : (
									<p className="chat__msg chat__msg--sent" ref={assignRef()}>
										<div ref={el => msgRef.current[message.id] = el}>
											<span>
												{message.content}
											</span>
											<span className="chat__msg-filler"> </span>
											<span className="chat__msg-footer">
												<span> {formatTime(message.time)} </span>
												<Icon
													id={
														message?.status === "sent"
															? "singleTick"
															: "doubleTick"
													}
													aria-label={message?.status}
													className={`chat__msg-status-icon ${
														message?.status === "read"
															? "chat__msg-status-icon--blue"
															: ""
													}`}
												/>
											</span>

											<Dropdown onSelect={change}>
												<Dropdown.Toggle as={CustomToggle2} id="dropdown-custom-components">											
												</Dropdown.Toggle>
												<Dropdown.Menu as={CustomMenu2}>
												<Dropdown.Item eventKey={JSON.stringify({id: message.id, date: message.date, chatId: personW.id})}>Удалить</Dropdown.Item>
												</Dropdown.Menu>
											</Dropdown>
										</div>
										
									</p>
								)}
							</>
						);
					})}
				</div>
			</div>
		);
	});
};

export default Convo;
