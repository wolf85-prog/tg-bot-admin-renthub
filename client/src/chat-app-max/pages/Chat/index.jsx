import React, { useEffect, useRef, useState, useContext } from "react";
import "./styles/main.css";
import EmojiPicker from 'emoji-picker-react';

import EmojiTray from "./components/EmojiTray";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import ChatSidebar from "./components/ChatSidebar";
import Icon from "../../components/Icon";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Convo from "./components/Convo";
import { useUsersContext } from "../../../chat-app-new/context/usersContext";
import { AccountContext } from '../../../chat-app-new/context/AccountProvider';
import { uploadFile } from "src/http/workerAPI";
import { newRMessage } from "src/http/renthubAPI";
import { newCountWMessage, getCountMessage } from "src/http/adminAPI";
import { $host } from '../../../http/index'
import sendSound from './../../../chat-app-new/assets/sounds/sendmessage.mp3';
import axios from 'axios';
import ChatSidebarProfile from "./components/ChatSidebarProfile";

import { 
	CButton,
	CModal,
	CModalHeader,
	CModalTitle,
	CModalBody,
	CModalFooter
  } from '@coreui/react'
import { newMaxMessage, sendMessageToMax, sendPhotoToMax } from "src/http/maxAPI";

const chatAdminId = process.env.REACT_APP_CHAT_ADMIN_ID
const token_work = process.env.REACT_APP_TELEGRAM_API_TOKEN_RENTHUB
const host = process.env.REACT_APP_HOST
const baseURL = process.env.REACT_APP_API_URL
const webAppAnketa = process.env.REACT_APP_WEBAPP_ANKETA
const webAppUrl = process.env.REACT_APP_WEBAPP_URL;

const Chat = () => {
	const { userRenthub, userMaxRenthub, addNewMessageMax, conversationsMax, workersAll } = useUsersContext();
	const { personW } = useContext(AccountContext);
	const { setCountMessage } = useUsersContext();

	const chatId = personW.id;
	const managerId = personW.managerId
	let user = userMaxRenthub.find((user) => user.chatId === chatId?.toString());
	let convs = conversationsMax.find((conv) => conv.members[0] === chatId?.toString());

	console.log("header chatId: ", personW, user)

	const lastMsgRef = useRef(null);
	const [showAttach, setShowAttach] = useState(false);
	const [showEmojis, setShowEmojis] = useState(false);
	const [showProfileSidebar, setShowProfileSidebar] = useState(false);
	const [showSearchSidebar, setShowSearchSidebar] = useState(false);
	const [file, setFile] = useState();
	const [image, setImage]= useState("");
	const [mess, setMess] = useState("");
	const [fileType, setFileType] = useState("");
	const [showPicker, setShowPicker] = useState(false)
	const [chosenEmoji, setChosenEmoji] = useState('');
	const [pathFile, setPathFile] = useState("");
	const [originalName, setOriginalName] = useState("");

	const [clearFile, setClearFile] = useState(false)
	const [showCloseButton, setShowCloseButton] = useState(false)
	const [showErrorFile, setShowErrorFile] = useState(false);

	//select
    const [selectedElement, setSelectedElement] = useState("")
	const [scenari, setScenari] = useState("")
	const [nameUser, setNameUser] = useState("")

	// для хранения ответа от бекенда
	const [data, getFile] = useState({ name: "", path: "" });
	const [progress, setProgess] = useState(0); // progessbar
  	const el = useRef(); // для доступа к инпуту

	const audio = new Audio(sendSound);

	const [poster, setPoster] = useState("")

	const refreshPage = ()=>{
		window.location.reload(true);
	 }

	useEffect(() => {
		//console.log("personW: ", personW.id)
		if (user) {
			console.log("personW: ", personW.id)

			//setUserAsUnread(user.chatId);
			setCountMessage(0)
			//обнулить кол-во сообщений
			//const kol_mess = getCountMessage()
			//newCountWMessage(kol_mess - 1)

			setTimeout(()=> {
				scrollToLastMsg();
			}, 1000)
		}
	}, [user]);

	useEffect(() => {
		user && scrollToLastMsg();
	}, [userRenthub]);

	useEffect(() => {
		//setTimeout(()=> {
			console.log("lastMsgRef: ", lastMsgRef.current)
		//}, 3000)
		
		//lastMsgRef.current = lastMsgRef.current + 1
		//scrollToLastMsg();
	}, [lastMsgRef.current]);

	

	//прокрутка
	const scrollToLastMsg = () => {
		//console.log("Прокрутка: ", lastMsgRef.current)
		lastMsgRef.current?.scrollIntoView({transition: "smooth"});
	};

	useEffect(() => {
        const getImage = async () => {
            if (file) {
                const data = new FormData();
                data.append("name", file.name); // добавление имени файла
                data.append("photo", file); // добавление файла

               let response = await uploadFile(data);
			   console.log("response: ", response)

			//    axios.post(baseURL + 'api/file/upload', data, {
			// 		onUploadProgress: (ProgressEvent) => {
			// 			let progress = Math.round(
			// 			ProgressEvent.loaded / ProgressEvent.total * 100
			// 			) + '%';
			// 			setProgess(progress);
			// 		}
			// 	}).then(res => {
			// 	console.log(res);
			// 	getFile({
			// 		name: res.data.name,
			// 		path: baseURL + res.data.path
			// 	})
			// 	}).catch(err => console.log(err))

               setImage(response.data.path.split('.team')[1]);
			   //сообщение с ссылкой на файл
			   setMess(host + response.data.path.split('.team')[1])

			   setPathFile(response.data.path)
			   setOriginalName(response.data.originalname)
            }
        }
        getImage();
    }, [file])

	const onFileChange = (e, key) => {	
		setProgess(0)
		const file = e.target.files[0]; // доступ к файлу
		console.log("key: ", key);
		setFileType(key)
		console.log(file);
		setFile(file); // сохранение файла
		setShowAttach(false)
    }

	const openSidebar = (cb) => {
		// close any open sidebar first
		setShowProfileSidebar(false);
		setShowSearchSidebar(false);

		setShowCloseButton(true)

		// call callback fn
		cb(true);
	};

	const closeSidebar = (cb) => {
		// close any open sidebar first
		setShowProfileSidebar(false);

		setShowCloseButton(false)

		// call callback fn
		cb(false);
	};

	//функция отправки сообщения
	const sendText = async () => {
		console.log("selectedElement: ", selectedElement)

		let temp=mess.replace(/\n/g, '%0A'); //экранирование переноса строки
			temp = temp.replace(/#/g, '%23'); 		 //экранирование решетки
			temp = temp.replace(/&/g, '%26'); 		 //экранирование &
			temp = temp.replace(/\+/g, '%2b'); 		 //экранирование +
			temp = temp.replace(/>/g, '%3e'); 		 //экранирование >
			temp = temp.replace(/</g, '%3c'); 

		if (selectedElement === 1) { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

	
		} else {
			//отправка сообщения

			//Передаем данные боту
			let temp=mess.replace(/\n/g, '%0A'); //экранирование переноса строки
			temp = temp.replace(/#/g, '%23'); 		 //экранирование решетки
			temp = temp.replace(/&/g, '%26'); 		 //экранирование &
			temp = temp.replace(/\+/g, '%2b'); 		 //экранирование +
			temp = temp.replace(/>/g, '%3e'); 		 //экранирование >
			temp = temp.replace(/</g, '%3c'); 		 //экранирование <
			
			let sendToMax

			// const url_send_msg = `https://api.telegram.org/bot${token_work}/sendMessage?chat_id=${personW.id}&parse_mode=html&text=${temp}`
			// const sendToTelegram = await $host.get(url_send_msg);

			if(!file) {
				// const url_send_msg = `https://api.telegram.org/bot${token_work}/sendMessage?chat_id=${personW.id}&parse_mode=html&text=${temp}`				
				// sendToTelegram = await $host.get(url_send_msg);
				sendToMax = await sendMessageToMax({user: personW.id, text: temp})
			} else {
				if (fileType === 'doc') { //(image.slice(-3) === 'gif' || image.slice(-3)==='zip') {
					// if (image.slice(-3) === 'ocx' || image.slice(-3)==='doc' || image.slice(-3)==='lsx' || image.slice(-3)==='xls' || image.slice(-3)==='iff' || image.slice(-3)==='IFF') {
					// 	const url_send_doc = `https://api.telegram.org/bot${token_work}/sendMessage?chat_id=${personW.id}&parse_mode=html&text=${host+image}`
					// 	//console.log("url_send_doc: ", url_send_doc)
					// 	sendPhotoToTelegram = await $host.get(url_send_doc);
					// } else if (image.slice(-3) === 'png' || image.slice(-3)==='jpg' || image.slice(-3)==='peg' || image.slice(-3) !== 'PNG' || image.slice(-3)!=='JPG' || image.slice(-3)!=='PEG') {
					// 	setShowErrorFile(true)
					// } else if (image.slice(-3) === 'pdf' ) {
					// 	const url_send_doc = `https://api.telegram.org/bot${token_work}/sendDocument?chat_id=${personW.id}&document=${host+image}`
					// 	//console.log("url_send_doc: ", url_send_doc)
					// 	sendPhotoToTelegram = await $host.get(url_send_doc);
					// } else {
						// const url_send_doc = `https://api.telegram.org/bot${token_work}/sendDocument?chat_id=${personW.id}&document=${host+image}`
						// //console.log("url_send_doc: ", url_send_doc)
						// //sendPhotoToTelegram = await $host.get(url_send_doc);
						const form = new FormData();
						form.append("chat_id", personW.id); // добавление имени файла
						form.append("document", file); // добавление файла
						//const form = new FormData();
						sendToMax = await $host.post(`https://api.telegram.org/bot${token_work}/sendDocument`, form, {headers: { 'Content-Type': 'multipart/form-data' },})
					//}		

					//sendToTelegram = await sendDocumentFormToTelegram({chatId: personW.id, path: pathFile, filename:originalName})
				} else if (fileType === 'image') {
					// if (image.slice(-3) !== 'png' || image.slice(-3)!=='jpg' || image.slice(-3)!=='peg' || image.slice(-3) !== 'PNG' || image.slice(-3)!=='JPG' || image.slice(-3)!=='PEG') {
					// 	setShowErrorFile(true)
					// } else {
						//const url_send_photo = `https://api.telegram.org/bot${token_work}/sendPhoto?chat_id=${personW.id}&photo=${host+image}`
						//sendToMax = await $host.get(url_send_photo);
						sendToMax = await sendPhotoToMax({user: personW.id, image: host+image})
					//}		
				}	
			}

			//Выводим сообщение об успешной отправке
			if (sendToMax) {
				console.log('Спасибо! Ваша сообщение отправлено! ');
			}           
			//А здесь сообщение об ошибке при отправке
			else {
				console.log('Что-то пошло не так. Попробуйте ещё раз.');
			}

			let message = {};
			if(!file) {
				console.log("text")
				message = {
					senderId: chatAdminId, 
					receiverId: user.chatId,
					conversationId: convs.id,
					type: "text",
					text: mess,
					isBot: null,
					messageId: '', //sendToMax.data.result.message_id,
				}

				//сохранение сообщения в базе данных
				await newMaxMessage(message)	

				//сохранить в контексте
				addNewMessageMax(user.chatId, mess, 'text', '', convs.id, '', null);
			} else {
				console.log("image")
				message = {
					senderId: chatAdminId, 
					receiverId: user.chatId,
					conversationId: convs.id,
					type: "image",
					text: host + image,
					isBot: null,
					messageId: '',//sendToMax.data.result.message_id,
				}

				//сохранение сообщения в базе данных
				await newMaxMessage(message)	

				//сохранить в контексте
				addNewMessageMax(user.chatId, host + image, 'image', '', convs.id, '', null);
			}
			console.log("message send: ", message);

			
		}
	}

	const submitNewMessage = () => {
		audio.play();
		sendText();

		setMess("");
		scrollToLastMsg();
		setFile("");
        setImage("");
		setSelectedElement('')
	};


	//отправка сценария


	const clickClearFile = () => {
		console.log("clear file...")
		setClearFile(false)
		
	}

	const onEmojiClick = (emojiObject, event) => {
		console.log(emojiObject)
		setMess(prevInp =>prevInp + emojiObject.emoji);

	};

	return (
		<div className="chat">
			<div className="chat__body">
				<div className="chat__bg"></div>

				<Header
					user={personW}
					userH={user}
					manager={workersAll.filter((item)=> item.chatId === chatId)}
					openProfileSidebar={() => openSidebar(setShowProfileSidebar)}
					openSearchSidebar={() => openSidebar(setShowSearchSidebar)}
					closeSidebar={() => closeSidebar(setShowProfileSidebar)}
					showCloseButton={showCloseButton}
					setClearFile={setClearFile}
					clearFile={clearFile}
					clickClearFile={clickClearFile}
				/>
				<div className="chat__content">
					<Convo lastMsgRef={lastMsgRef} messages={user?.messages} convId={user?.conversationId} />
					<CModal alignment="center" visible={showErrorFile} onClose={() => setShowErrorFile(false)}>
                        <CModalHeader>
                        	<CModalTitle>Предупреждение</CModalTitle>
                        </CModalHeader>
                        <CModalBody>
                        	...
                        </CModalBody>
                        <CModalFooter>
                        	<CButton color="primary" onClick={() => setShowErrorFile(false)}>ОК</CButton>
                        </CModalFooter>
                    </CModal>
					
				</div>
				<div style={{position: 'absolute', bottom: '70px', zIndex: '100'}}>
					<EmojiPicker 
						open={showPicker} 
						theme='dark'
						height={400} 
						width={400} 
						onEmojiClick={onEmojiClick}
					/>
				</div>
				
				<footer className="chat__footer">
				
					<div className="chat__footer-wrapper">
						<button
							className="chat__scroll-btn"
							aria-label="scroll down"
							onClick={scrollToLastMsg}
						>
						<Icon id="downArrow" />
						</button>
						{/* <EmojiTray
							showEmojis={showEmojis}
							mess={mess}
							setMess={setMess}
						/> */}
						{/* <EmojiPicker 
							open={showPicker} 
							theme='dark'
							height={500} 
							width={400} 
							onEmojiClick={onEmojiClick}
						/> */}
						<ChatInput
							showEmojis={showEmojis}
							setShowEmojis={setShowEmojis}
							setShowPicker={setShowPicker}
							showAttach={showAttach}
							setShowAttach={setShowAttach}
							onFileChange={onFileChange}
							mess={mess}
							setMess={setMess}
							submitNewMessage={submitNewMessage}
							setSelectedElement={setSelectedElement}
							chosenEmoji={chosenEmoji}
						/>

						{/* <div className="progessBar" style={{ width: progress, height: '1rem', width: '0%',  backgroundColor: 'rgb(68, 212, 231)', color: 'white',  padding: '2px' }}>
							{progress}
						</div> */}
					</div>		
				</footer>
			</div>
			<ChatSidebar
				heading="Поиск сообщения"
				active={showSearchSidebar}
				closeSidebar={() => setShowSearchSidebar(false)}
			>
				<Search />
			</ChatSidebar>

			<ChatSidebarProfile
				// heading="Данные контакта"
				active={showProfileSidebar}
			>
				<Profile user={user} />
			</ChatSidebarProfile>

		</div>
	);
};

export default Chat;
