import React, { useEffect, useRef, useState, useContext } from "react";
import "./styles/main.css";
import EmojiPicker from 'emoji-picker-react';

import EmojiTray from "./components/EmojiTray";
import ChatInput from "./components/ChatInput";
import Header from "./components/Header";
import ChatSidebar from "./components/ChatSidebar";
import Icon from "./../../components/Icon";
import Search from "./components/Search";
import Profile from "./components/Profile";
import Convo from "./components/Convo";
import { useUsersContext } from "./../../../chat-app-new/context/usersContext";
import { AccountContext } from './../../../chat-app-new/context/AccountProvider';
import { uploadFile } from "src/http/workerAPI";
import { newRMessage } from "src/http/renthubAPI";
import { newCountWMessage, getCountMessage } from "src/http/adminAPI";
import { $host } from './../../../http/index'
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
import { sendMessageToTelegram, sendPhotoToTelegram, sendDocumentFormToTelegram } from "src/http/telegramAPI";

const chatAdminId = process.env.REACT_APP_CHAT_ADMIN_ID
const token_work = process.env.REACT_APP_TELEGRAM_API_TOKEN_RENTHUB
const host = process.env.REACT_APP_HOST
const baseURL = process.env.REACT_APP_API_URL
const webAppAnketa = process.env.REACT_APP_WEBAPP_ANKETA
const webAppUrl = process.env.REACT_APP_WEBAPP_URL;

const Chat = () => {
	const { userRenthub, addNewMessage, conversations, workersAll } = useUsersContext();
	const { personW } = useContext(AccountContext);
	const { setCountMessage } = useUsersContext();

	const chatId = personW.id;
	let user = userRenthub.find((user) => user.chatId === chatId?.toString());
	let convs = conversations.find((conv) => conv.members[0] === chatId?.toString());

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

	useEffect(() => {
		console.log(selectedElement)
		setSelectedElement(selectedElement);
		setScenari(selectedElement)

		let nameUser = personW.name.replace(/\[.+\]/,'').replace(/\s+/g, ' ').split(' ')[1]
        //console.log("nameUser: ", nameUser)
        if (!nameUser || nameUser.length === 0) {
            nameUser = personW.name.replace(/\[.+\]/,'').replace(/\s+/g, ' ').split(' ')[0]
        }
		setNameUser(nameUser)

		let text = ''

		//Приветстиве
		if (selectedElement === 1) {
			text = '🔵 Сценарий «Приветствие»'
			console.log(text)
			setMess(text)
		}

		//Дорогие коллеги
		else if (selectedElement === 2) {
			text = '🔵 Cценарий «Дорогие коллеги»'
			setMess(text)
		}

		//Новости
		else if (selectedElement === 3) {
			text = '🔵 Сценарий «Новости»'
			setMess(text)
		}

		//О себе
		else if (selectedElement === 4) {
			text = '🔵 Сценарий «О себе»'
			console.log(text)
			setMess(text)
		}

		//Реклама
		else if (selectedElement === 5) {
			text = '🔵 Cценарий «Реклама»'
			setMess(text)
		}

//--------------------------------------------------------		
		//Новый проект
		else if (selectedElement === 6) {
			text = `Для создания новой заявки:
•⁠  ⁠Нажмите на кнопку «Проект» слева внизу
•⁠  ⁠Далее кнопка «Новый проект»
•⁠  ⁠Заполните заявку, нажимаем кнопку «Создать проект»

В профиле есть окошко «Цена услуги». Там размещены все 14 отделов со стандартными ставками за смену. Вы всегда можете предложить свою ставку, в зависимости от сложности и особенностей проекта.

Все вопросы пишите в этот чат, или звоните:
+7(499)500-14-11
Ждем ваших заявок!` 

			setMess(text)
		}

		else if (selectedElement === 7) {
			text = `Ваша заявка принята, мы свяжемся с вами в ближайшее время.`

			setMess(text)
		}

		else if (selectedElement === 8) {
			text = `${nameUser}, к сожалению по Вашей заявке откликов пока нет. Продолжаем поиски.`
			setMess(text)
		}

		else if (selectedElement === 9) {
			text = `${nameUser}, по Вашей текущей заявке слабая конверсия кандидатов. 
Можем предложить поднять ставку до ..0 рублей в час, это может исправить ситуацию в лучшую сторону, 
Что скажете?`

			setMess(text)

		}
		


	}, [selectedElement]);

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

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Приветствие»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Приветствие»', 'text', '', convs.id, null, null);
				
			sendScenariy1()

		} else if (selectedElement === 2) { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Дорогие коллеги»',
				isBot: null,
				messageId: null,
			}
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Дорогие коллеги»', 'text', '', convs.id, null, null);
				
			sendScenariy2()

		} else if (selectedElement === 3 || temp === 'Новости' || temp === 'новости') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Новости»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Новости»', 'text', '', convs.id, null, null);
				
			sendScenariy3()

		// } else if (selectedElement === 4 || temp === 'Паспорт' || temp === 'паспорт') { //выбран Правила
		// 	//отправка сценария
		// 	console.log("отправка сценария: ", selectedElement, temp)
		// 	//setSelectedElement(1)

		// 	//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
		// 	const message = {
		// 		senderId: chatAdminId, 
		// 		receiverId: personW.id,
		// 		conversationId: convs.id,
		// 		type: "text",
		// 		text: '🔵 Сценарий «Список паспортных данных»',
		// 		isBot: null,
		// 		messageId: null,
		// 	}
				
		// 	// console.log("message send: ", message);
		
		// 	//сохранение сообщения в базе данных
		// 	await newRMessage(message)
		
		// 	//сохранить в контексте
		// 	addNewMessage(personW.id, '🔵 Сценарий «Список паспортных данных»', 'text', '', convs.id, null, null);
				
		// 	sendScenariy4()

		// } else if (selectedElement === 5 || temp === 'Реквизиты1' || temp === 'реквизиты1') { //выбран Правила
		// 	//отправка сценария
		// 	console.log("отправка сценария: ", selectedElement, temp)
		// 	//setSelectedElement(1)

		// 	//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
		// 	const message = {
		// 		senderId: chatAdminId, 
		// 		receiverId: personW.id,
		// 		conversationId: convs.id,
		// 		type: "text",
		// 		text: '🔵 Сценарий «Реквизиты №1»',
		// 		isBot: null,
		// 		messageId: null,
		// 	}
				
		// 	// console.log("message send: ", message);
		
		// 	//сохранение сообщения в базе данных
		// 	await newRMessage(message)
		
		// 	//сохранить в контексте
		// 	addNewMessage(personW.id, '🔵 Сценарий «Реквизиты №1»', 'text', '', convs.id, null, null);
				
		// 	sendScenariy5()

		} else if (temp === 'Поиск' || temp === 'поиск') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			const text = `${nameUser}, к сожалению по Вашей заявке откликов пока нет. Продолжаем поиски.`

			let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: text})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: text,
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, text, 'text', '', convs.id, null, null);

		} else if (temp === 'Конверсия' || temp === 'конверсия') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `${nameUser}, по Вашей текущей заявке слабая конверсия кандидатов. 
Можем предложить поднять ставку до ..0 рублей в час, это может исправить ситуацию в лучшую сторону, 
Что скажете?`

			let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: text})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: text,
				isBot: null,
				messageId: null,
			}
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, text, 'text', '', convs.id, null, null);
		
	
		} else {
			//отправка сообщения

			//Передаем данные боту
			let temp=mess.replace(/\n/g, '%0A'); //экранирование переноса строки
			temp = temp.replace(/#/g, '%23'); 		 //экранирование решетки
			temp = temp.replace(/&/g, '%26'); 		 //экранирование &
			temp = temp.replace(/\+/g, '%2b'); 		 //экранирование +
			temp = temp.replace(/>/g, '%3e'); 		 //экранирование >
			temp = temp.replace(/</g, '%3c'); 		 //экранирование <
			
			let sendToTelegram

			// const url_send_msg = `https://api.telegram.org/bot${token_work}/sendMessage?chat_id=${personW.id}&parse_mode=html&text=${temp}`
			// const sendToTelegram = await $host.get(url_send_msg);

			if(!file) {
				// const url_send_msg = `https://api.telegram.org/bot${token_work}/sendMessage?chat_id=${personW.id}&parse_mode=html&text=${temp}`				
				// sendToTelegram = await $host.get(url_send_msg);
				sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
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
						sendToTelegram = await $host.post(`https://api.telegram.org/bot${token_work}/sendDocument`, form, {headers: { 'Content-Type': 'multipart/form-data' },})
					//}		

					//sendToTelegram = await sendDocumentFormToTelegram({chatId: personW.id, path: pathFile, filename:originalName})
				} else if (fileType === 'image') {
					// if (image.slice(-3) !== 'png' || image.slice(-3)!=='jpg' || image.slice(-3)!=='peg' || image.slice(-3) !== 'PNG' || image.slice(-3)!=='JPG' || image.slice(-3)!=='PEG') {
					// 	setShowErrorFile(true)
					// } else {
						const url_send_photo = `https://api.telegram.org/bot${token_work}/sendPhoto?chat_id=${personW.id}&photo=${host+image}`
						sendToTelegram = await $host.get(url_send_photo);
						//sendToTelegram = await sendPhotoToTelegram({user: personW.id, image: host+image})
					//}		
				}	
			}

			//Выводим сообщение об успешной отправке
			if (sendToTelegram) {
				console.log('Спасибо! Ваша сообщение отправлено! ', sendToTelegram.data.result.message_id);
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
					messageId: sendToTelegram.data.result.message_id,
				}

				//сохранение сообщения в базе данных
				await newRMessage(message)	

				//сохранить в контексте
				addNewMessage(user.chatId, mess, 'text', '', convs.id, sendToTelegram.data.result.message_id, null);
			} else {
				console.log("image")
				message = {
					senderId: chatAdminId, 
					receiverId: user.chatId,
					conversationId: convs.id,
					type: "image",
					text: host + image,
					isBot: null,
					messageId: sendToTelegram.data.result.message_id,
				}

				//сохранение сообщения в базе данных
				await newRMessage(message)	

				//сохранить в контексте
				addNewMessage(user.chatId, host + image, 'image', '', convs.id, sendToTelegram.data.result.message_id, null);
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
	const sendScenariy1 = async() => {
		console.log("send scenariy1")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Поехали", web_app: {url: webAppUrl}},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		if (selectedElement === 1) {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/hello_renthub.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})
				}, 500 * ++index)
			})			
		} 
    }

	const sendScenariy2 = async() => {
		console.log("send scenariy2")
		//audio.play();

		//отправить в телеграмм
		
		//Правила
		if (selectedElement === 2) {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/kollegi.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: ''})
				}, 500 * ++index)
			})			
		} 
    }

	const sendScenariy3 = async() => {
		console.log("send scenariy3")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "VK", url:'https://vk.com/uley.team'},
                    {"text": "Telegram", url:'https://t.me/uley_team'},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		if (selectedElement === 3 || mess === 'Новости' || mess === 'новости') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/3/news.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		} 
    }

	const sendScenariy4 = async() => {
		console.log("send scenariy4")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "XLSX", url:'https://ya.ru'},
                    {"text": "PDF", url:'https://ya.ru'},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		if (selectedElement === 4 || mess === 'Паспорт' || mess === 'паспорт') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/akred.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		} 
    }

	const sendScenariy5 = async() => {
		console.log("send scenariy5")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Открыть", url:'https://uley.team/property'},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		if (selectedElement === 5 || mess === 'Реквизиты1' || mess === 'реквизиты1') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/rekviz_beznal.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		} 
    }

	const sendScenariy6 = async() => {
		console.log("send scenariy6")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Скопировать номер", copy_text: {text: '+7(905)793-51-49'}},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		if (selectedElement === 6 || mess === 'Реквизиты2' || mess === 'реквизиты2') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/rekviz_nal.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		} 
    }

	//отправка сценария
	const sendMyMessage = async() => {
		console.log("send passport")
		//audio.play();

		let client = userRenthub.filter((client) => client.chatId === user.chatId)[0];

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Заполнить анкету", web_app: {url: webAppAnketa}},
				],
			]
		});

		//отправить в телеграмм
		let sendToTelegram
		let text = ''
		
		//Паспорт
		if (selectedElement === '1') {
			//send photo
			let anketa = 'https://proj.uley.team/upload/2023-11-10T15:12:36.770Z.png' //poster anketa
			// const url_send_photo = `https://api.telegram.org/bot${token_work}/sendPhoto?chat_id=${user.chatId}&photo=${anketa}&reply_markup=${keyboard}`
			// sendToTelegram = await $host.get(url_send_photo);
			sendToTelegram = await sendPhotoToTelegram({user: user.chatId, image: anketa, keyboard: keyboard})
		} 
		

		//отправить в админку
		let message = {};
			
		message = {
			senderId: chatAdminId, 
			receiverId: user.chatId,
			conversationId: client.conversationId,
			type: "text",
			text: text,
			messageId: sendToTelegram.data.result.message_id,
			buttons: 'Согласен предоставить персональные данные',
		}
			
		// console.log("message send: ", message);
	
		//сохранение сообщения в базе данных
		await newRMessage(message)
	
		//сохранить в контексте
		addNewMessage(user.chatId, text, 'text', 'Согласен предоставить персональные данные', client.conversationId, sendToTelegram.data.result.message_id);
    }

	//отправка сценария Правила
	const sendMyMessage2 = async() => {
		console.log("send rule")
		//audio.play();

		let client = userRenthub.filter((client) => client.chatId === user.chatId)[0];

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Прочитал правила", callback_data:'/accept_rule'},
				],
			]
		});

		//отправить в телеграмм
		let sendToTelegram
		let sendPhotoToTelegram

		const text = `🔵 <b>Правила первого проекта</b>

ВНИМАТЕЛЬНО прочитайте перед выходом на работу!

✅ <b>Общие правила:</b>
• Не опаздывать | Не флудить
• Не покидать чат проекта без согласования
• После подтверждения участия выход на проект обязателен
• Форс-мажор — необходимо найти себе замену
• Не нашли замену — едете на проект лично
• Невыход — система вносит в чёрный список
• Расходы на такси в ночное время компания берет на себя
• Всегда с собой:
— Паспорт
— Зарядное устройство / Power Bank
— Мерч [одежда с логотипом компании | получаете в офисе после нескольких отработаных проектов]
• Рассчитывать время прибытия на площадку заранее
• Вести себя культурно и выполнять задания заказчика
• До выхода на проект зарегистрироваться, ответив на вопросы:
https://t.me/ULEY_Office_Bot

✅ <b>День проекта:</b>
• Выйти на связь в чат проекта за 2 часа до начала
• Кнопка «Подтвердить» — нажатие подтверждает, что вы на связи [обязательно]
• Кнопка «В пути» — нажать в момент выхода из дома
• Кнопка «На месте» — после прибытия на адрес
• Встретиться с коллегами в указанном месте
• Позвонить заказчику

✅ <b>На проекте:</b>
• Кнопка «Начал работу» — нажать после начала работы | подтвердить кнопкой «Да»
• Кнопка «Закончил работу» — нажать по завершению работ | подтвердить кнопкой «Да»
• Все вопросы в чат проекта, или по номеру: +7(499)500-14-11
• Внимание! Обязательно фиксировать статусы — влияет на своевременную оплату
• Оплата в течение 1-3 рабочих дней`

		//Передаем данные боту
		let temp=text.replace(/\n/g, '%0A'); //экранирование переноса строки
		temp = temp.replace(/#/g, '%23'); 		 //экранирование решетки
		temp = temp.replace(/&/g, '%26'); 		 //экранирование &
		temp = temp.replace(/\+/g, '%2b'); 		 //экранирование +
		temp = temp.replace(/>/g, '%3e'); 		 //экранирование >
		temp = temp.replace(/</g, '%3c'); 		 //экранирование <
		
		//Правила
		// const url_send_text = `https://api.telegram.org/bot${token_work}/sendMessage?chat_id=${user.chatId}&parse_mode=html&text=${temp}`	
		// sendToTelegram = await $host.get(url_send_text);
		sendToTelegram = await sendMessageToTelegram({user: user.chatId, text: temp})
		

		//отправить в админку
		let message = {};
			
		message = {
			senderId: chatAdminId, 
			receiverId: user.chatId,
			conversationId: client.conversationId,
			type: "text",
			text: 'Сценарий "Первый проект"',
			isBot: null,
			messageId: sendToTelegram.data.result.message_id,
			buttons: '',
		}
			
	
		//сохранение сообщения в базе данных
		await newRMessage(message)
	
		//сохранить в контексте
		addNewMessage(user.chatId, 'Сценарий "Первый проект"', 'text', '', client.conversationId, sendToTelegram.data.result.message_id);
    
	}

	//отправка сценария Постер
	const sendMyMessagePoster = async() => {
		console.log("send poster")
		//audio.play();

		let client = userRenthub.filter((client) => client.chatId === user.chatId)[0];

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Принято / Понято", callback_data:'/poster_accept'},
				],
			]
		});

		let sendToTelegram
		
		//Постер
		// const url_send_photo = `https://api.telegram.org/bot${token_work}/sendPhoto?chat_id=${user.chatId}&photo=${poster}&reply_markup=${keyboard}`
		// sendToTelegram = await $host.get(url_send_photo);
		sendToTelegram = await sendPhotoToTelegram({user: user.chatId, image: poster, keyboard: keyboard})
		

		//отправить в админку
		let message = {};
			
		message = {
			senderId: chatAdminId, 
			receiverId: user.chatId,
			conversationId: client.conversationId,
			type: "image",
			text: poster,
			isBot: null,
			messageId: sendToTelegram.data.result.message_id,
			buttons: '',
		}
			
	
		//сохранение сообщения в базе данных
		await newRMessage(message)
	
		//сохранить в контексте
		addNewMessage(user.chatId, poster, 'image', '', client.conversationId, sendToTelegram.data.result.message_id);
    
	}

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
					manager={workersAll.filter((item)=> item.chatId === user?.chatId)}
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
