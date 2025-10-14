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
	const managerId = personW.managerId
	let user = userRenthub.find((user) => user.chatId === chatId?.toString());
	let convs = conversations.find((conv) => conv.members[0] === chatId?.toString());

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

	useEffect(() => {
		console.log(selectedElement)
		setSelectedElement(selectedElement);
		setScenari(selectedElement)

		let nameUser = personW.name ? personW.name.replace(/\[.+\]/,'').replace(/\s+/g, ' ').split(' ')[1] : ''
        //console.log("nameUser: ", nameUser)
        if (!nameUser || nameUser.length === 0) {
            nameUser = personW.name ? personW.name.replace(/\[.+\]/,'').replace(/\s+/g, ' ').split(' ')[0] : ''
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
			//console.log(text)
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
•⁠ ⁠Нажмите на кнопку «Проект» слева внизу
•⁠ ⁠Далее кнопка «Новый проект»
•⁠ ⁠Заполните заявку, нажимаем кнопку «Создать проект»

«Цена услуги» — одно из окон вашего профиля, где указаны стандартные ставки за 1 смену. Вы всегда можете предложить свою ставку, в зависимости от сложности и особенностей проекта.

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
			text = `${nameUser}, к сожалению по вашей заявке откликов пока нет. Продолжаем поиски.`
			setMess(text)
		}

		else if (selectedElement === 9) {
			text = `${nameUser}, по вашей текущей заявке слабая конверсия кандидатов. Можем предложить поднять ставку до ..0 рублей в час, это может исправить ситуацию в лучшую сторону. Что скажете?`

			setMess(text)

		}

		else if (selectedElement === 10) {
			text = `Добрый день, ${nameUser}.
Не можем до вас дозвониться уже несколько часов.
Перезвоните, пожалуйста: +7(499)500-14-11 — менеджер «U.L.E.Y»`

			setMess(text)

		}

		else if (selectedElement === 11) {
			text = `Добрый день, ${nameUser}. 
Для подачи новой заявки просим оплатить проекты, которые уже завершены. Спасибо за понимание.`

			setMess(text)
		}
//-----------------------------------------------------------------

		else if (selectedElement === 12) {
			text = `${nameUser}, у нас есть претенденты на ваш проект. Как только мы проведем бриф со специалистами и получим от них подтверждение, вернемся к вам с подробной информацией.`

			setMess(text)
		}

		else if (selectedElement === 13) {
			text = `Добрый день, ${nameUser}.
У нас есть еще претенденты на ваш проект, но мы пока не можем с ними связаться. Завтра проведем бриф и вернемся с информацией для вас.`

			setMess(text)
		}

		else if (selectedElement === 14) {
			text = `Добрый день, ${nameUser}. 
Для вас уже есть претенденты на данный проект. Можно немного подробней по задачам, какой объем работы и ориентировочный диапазон времени?`

			setMess(text)
		}

		else if (selectedElement === 15) {
			text = `Добрый день, ${nameUser}.
У нас есть претенденты на ваш проект. Когда вам будет удобно связаться со специалистами для проведения собеседования?`

			setMess(text)
		}

		else if (selectedElement === 16) {
			text = `Добрый день, ${nameUser}. 
Подскажите, пожалуйста, с кем быть на связи после приезда на локацию?`

			setMess(text)
		}

		else if (selectedElement === 17) {
			text = `🔵 Старший от «U.L.E.Y»

◉ 31.12 | 23:59 | Проект
◉ +7(900)800-70-60 — Имя`

			setMess(text)
		}

		else if (selectedElement === 18) {
			text = `🔵 Старший от «R.O.Y»

◉ 31.12 | 23:59 | Проект
◉ +7(900)800-70-60 — Имя`

			setMess(text)
		}

		else if (selectedElement === 19) {
			text = `🔵 Сценарий «Список паспортных данных»`

			setMess(text)
		}

		else if (selectedElement === 20) {
			text = `Добрый день, ${nameUser}.
Опишите, пожалуйста, ситуацию, мы найдем всех причастных и привлечем к ответственности.`

			setMess(text)
		}

		else if (selectedElement === 21) {
			text = `Добрый день, ${nameUser}.
У одного из наших специалистов форс-мажор, делаем всё возможное, чтобы найти ему замену. Как только это произойдет, мы сразу же отправим его на проект и обязательно вас оповестим. От имени нашей компании приносим извинения, и сделаем всё возможное, чтобы в будущем такого не повторилось.`

			setMess(text)
		}
//----------------------- Условия ---------------------------------------

		else if (selectedElement === 22) {
			text = `Добрый день, ${nameUser}.
Отправляем вам смету за проект «Проект» 31.12.2025 на проверку. Посмотрите, пожалуйста.`

			setMess(text)
		}

		else if (selectedElement === 23) {
			text = `Добрый день, ${nameUser}.
Отправляем вам смету за период 01.12 — 31.12.2025 на проверку. Посмотрите, пожалуйста.`

			setMess(text)
		}

		else if (selectedElement === 24) {
			text = `${nameUser}, мы отправили вам смету, она висит выше в ленте сообщений. Посмотрите, пожалуйста.`
			setMess(text)
		}

		else if (selectedElement === 25) {
			text = `Добрый день, ${nameUser}.
Постараемся как можно скорее собрать для вас смету за проекты. Обычно мы делаем это по завершению месяца, потому что очень много мелких проектов и мы их суммируем, чтобы не делать 20-40 счетов для каждой компании за месяц.`

			setMess(text)
		}

		else if (selectedElement === 26) {
			text = `Доброе утро, ${nameUser}.
Система сгенерировала для вас новую предварительную смету. Обратите внимание, что ставка указана за 10 часов работы, далее переработка 10%`

			setMess(text)
		}


		else if (selectedElement === 29) {
			text = `Удобная для вас форма оплаты. Наличный расчет и безналичный расчет через договор и электронный документооборот, или подписание документов традиционным способом.`
			setMess(text)
		}
//-------------------------Ответ---------------------------------------------
		else if (selectedElement === 31) {
			text = `Добрый день, ${nameUser}.
У вас в наличии оборудование из списка, которое вы готовы сдать в аренду на указанные даты?`

			setMess(text)
		}

		else if (selectedElement === 312) {
			text = `${nameUser}, по регламенту специалисты по приезду на проект считаются находящимися на рабочем месте. В случае опоздания специалиста это считается нарушением. Если же все специалисты прибыли на площадку вовремя, встретились и связались с заказчиком, это является штатным состоянием проекта, и специалисты считаются уже на рабочем месте. На тех проектах, где доставка оборудования производится с какой-либо задержкой, специалисты фиксируют начало рабочего времени с момента своего прибытия на проект, а не с момента начала разгрузки.` 
			setMess(text)
		}

		else if (selectedElement === 32) {
			text = `${nameUser}, в данный момент идет обновление системы, возможны ошибки.
Спасибо за вашу обратную связь по работе нашего сервиса. Запрос передан специалистам, они устранят проблему. Благодарим за бдительность и активное участие.`

			setMess(text)
		}

		else if (selectedElement === 33) {
			text = `Большое спасибо за обратную связь по работе нашего сервиса, ${nameUser}. Наши IT-специалисты уже занимаются решением этого вопроса. Спасибо за вашу бдительность и активное участие.`
			setMess(text)
		}


//-------------------------Быстрые ответы-------------------------------------

		//Быстрые ответы
		else if (selectedElement === 341) {
			text = `Добрый день, ${nameUser}. 
Вы на связи?`
			setMess(text)
		}

		else if (selectedElement === 34) {
			text = 'Принято, спасибо.'
			setMess(text)
		}

		else if (selectedElement === 35) {
			text = `${nameUser}, информация принята. До встречи на новых проектах!`
			setMess(text)
		}

		else if (selectedElement === 36) {
			text = `Информация получена, ваш вопрос уже в работе, ${nameUser}.`
			setMess(text)
		}	

		else if (selectedElement === 37) {
			text = `Информация получена, мы уже работаем в этом направлении, ${nameUser}.`
			setMess(text)
		}

		else if (selectedElement === 38) {
			text = `Информация зафиксирована, мы уже работаем над этим, ${nameUser}.`
			setMess(text)
		}

		else if (selectedElement === 39) {
			text = `Спасибо за информацию, ${nameUser}. Сообщим вам, как только все будет готово.`
			setMess(text)
		}

		else if (selectedElement === 40) {
			text = `Мы работаем над вашим запросом и уже скоро предоставим результаты, ${nameUser}.`
			setMess(text)
		}

		else if (selectedElement === 41) {
			text = `Информация принята, постараемся ответить на ваш вопрос в ближайшее время, ${nameUser}.`
			setMess(text)
		}

		else if (selectedElement === 42) {
			text = `На данный момент мы изучаем ваш вопрос и постараемся вернуться к вам с ответом как можно скорее, ${nameUser}.`
			setMess(text)
		}

//---------------------Контакты---------------------------------------------
		else if (selectedElement === 43) {
			text = '🔵 Сценарий «Контакты»'
			setMess(text)
		}

		else if (selectedElement === 44) {
			text = '🔵 Сценарий «Контакты [Белов]»'
			setMess(text)
		}

		else if (selectedElement === 45) {
			text = '🔵 Сценарий «Офис U.L.E.Y»'
			setMess(text)
		}

		else if (selectedElement === 46) {
			text = `🔵 Почта компании:
◉ u.l.e.y@mail.ru`
			setMess(text)
		}

		else if (selectedElement === 47) {
			text = '🔵 Сценарий «Реквизиты №1»'
			setMess(text)
		}

		else if (selectedElement === 48) {
			text = '🔵 Сценарий «Реквизиты №2 [Белов]»'
			setMess(text)
		}

		else if (selectedElement === 50) {
			text = '🔵 Сценарий «Кабинет»'
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

		} else if (selectedElement === 4) { //выбран О себе
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «О себе»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «О себе»', 'text', '', convs.id, null, null);
				
			sendScenariy4()

		} else if (selectedElement === 5) { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Реклама»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Реклама»', 'text', '', convs.id, null, null);
				
			sendScenariy5()

		} else if (temp === 'Поиск' || temp === 'поиск') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			const text = `${nameUser}, к сожалению по вашей заявке откликов пока нет. Продолжаем поиски.`

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

			const text = `${nameUser}, по вашей текущей заявке слабая конверсия кандидатов. Можем предложить поднять ставку до ..0 рублей в час, это может исправить ситуацию в лучшую сторону. Что скажете?`



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

		} else if (temp === 'Долг' || temp === 'долг') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}. 
Для подачи новой заявки просим оплатить проекты, которые уже завершены. Спасибо за понимание.`

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

//--------------------------------------------------------------------------------
		} else if (temp === 'Бриф' || temp === 'бриф') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `${nameUser}, у нас есть претенденты на ваш проект. Как только мы проведем бриф со специалистами и получим от них подтверждение, вернемся к вам с подробной информацией.`

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

//--------------------------------------------------------------------------------
		} else if (temp === 'Претенденты' || temp === 'претенденты') { //выбран Правила
			//отправка сценария
			//console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}.
У нас есть еще претенденты на ваш проект, но мы пока не можем с ними связаться. Завтра проведем бриф и вернемся с информацией для вас.`

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

		} else if (temp === 'Подробности' || temp === 'Подробности') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}. 
Для вас уже есть претенденты на данный проект. Можно немного подробней по задачам, какой объем работы и ориентировочный диапазон времени?`

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

		} else if (temp === 'Собес' || temp === 'собес') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}.
У нас есть претенденты на ваш проект. Когда вам будет удобно связаться со специалистами для проведения собеседования?`

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

		} else if (temp === 'Ошибка' || temp === 'ошибка') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `${nameUser}, в данный момент идет обновление системы, возможны ошибки.
Спасибо за вашу обратную связь по работе нашего сервиса. Запрос передан специалистам, они устранят проблему. Благодарим за бдительность и активное участие.`

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

		} else if (temp === 'Связь' || temp === 'связь') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}. 
Подскажите, пожалуйста, с кем быть на связи после приезда на локацию?`

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

		} else if (temp === 'Улей' || temp === 'улей') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `🔵 Старший от «U.L.E.Y»

◉ 31.12 | 23:59 | Проект
◉ +7(900)800-70-60 — ${nameUser}`

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

		} else if (temp === 'Рой' || temp === 'рой') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `🔵 Старший от «R.O.Y»

◉ 31.12 | 23:59 | Проект
◉ +7(900)800-70-60 — ${nameUser}`

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

		} else if (selectedElement === 19 && temp === '🔵 Сценарий «Список паспортных данных»' || temp === 'Паспорт' || temp === 'паспорт') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Список паспортных данных»',
				isBot: null,
				messageId: null,
			}

			//сохранение сообщения в базе данных
			await newRMessage(message)	

			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Список паспортных данных»', 'text', '', convs.id, null, null);

			//сценарий
			sendPassport()

		} else if (temp === 'Нарушение' || temp === 'нарушение') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}. 
Опишите, пожалуйста, ситуацию, мы найдем всех причастных и привлечем к ответственности.`

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

		} else if (temp === 'Форс-мажор' || temp === 'форс мажор' || temp === 'форс') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}.
У одного из наших специалистов форс-мажор, делаем всё возможное, чтобы найти ему замену. Как только это произойдет, мы сразу же отправим его на проект и обязательно вас оповестим. От имени нашей компании приносим извинения, и сделаем всё возможное, чтобы в будущем такого не повторилось.`

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
		
//-------------Условия--------------------------------------------------------------------			
		} else if (temp === 'Проект') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}.
Отправляем вам смету за проект «Проект» 31.12.2025 на проверку. Посмотрите, пожалуйста.`

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

		} else if (temp === 'Период') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день, ${nameUser}.
Отправляем вам смету за период 01.12 — 31.12.2025 на проверку. Посмотрите, пожалуйста.`

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

		} else if (temp === 'Контроль' || temp === 'контроль') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `${nameUser}, мы отправили вам смету, она висит выше в ленте сообщений. Посмотрите, пожалуйста.`

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

//------------------Ответ--------------------------------------------------------------------

		} else if (temp === 'Оборудование') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const text = `Добрый день,${nameUser}.
У вас в наличии оборудование из списка, которое вы готовы сдать в аренду на указанные даты?`

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

//------------------------Контакты------------------------------------------------------------
		} else if (selectedElement === 43 && temp === '🔵 Сценарий «Контакты»' || temp === 'Контакты' || temp === 'Контакты') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Контакты»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Контакты»', 'text', '', convs.id, null, null);
				
			sendScenariy43()

		} else if (selectedElement === 44 && temp === '🔵 Сценарий «Контакты [Белов]»' || temp === 'Белов' || temp === 'белов') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Контакты [Белов]»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Контакты [Белов]»', 'text', '', convs.id, null, null);
				
			sendScenariy44()

		} else if (selectedElement === 45 || temp === 'Офис' || temp === 'офис') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Офис «U.L.E.Y»»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Офис «U.L.E.Y»»', 'text', '', convs.id, null, null);
				
			sendScenariy45()

		} else if (selectedElement === 46 || temp === 'Почта') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			let text = `🔵 Почта компании:
◉ u.l.e.y@mail.ru`

			let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
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
				
			//sendScenariy45()

		} else if (selectedElement === 47 || temp === 'Оплата1' || temp === 'оплата1') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Реквизиты №1»',
				isBot: null,
				messageId: null,
			}
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Реквизиты №1»', 'text', '', convs.id, null, null);
				
			sendScenariy47()

		} else if (selectedElement === 48 || temp === 'Оплата2' || temp === 'оплата2') { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)

			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Реквизиты №2 [Белов]»',
				isBot: null,
				messageId: null,
			}
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Реквизиты №2 [Белов]»', 'text', '', convs.id, null, null);
				
			sendScenariy48()

		} else if (selectedElement === 50 && temp === '🔵 Сценарий «Кабинет»' ) { //выбран Правила
			//отправка сценария
			console.log("отправка сценария: ", selectedElement, temp)
			//setSelectedElement(1)

			//let sendToTelegram = await sendMessageToTelegram({user: personW.id, text: temp})
			const message = {
				senderId: chatAdminId, 
				receiverId: personW.id,
				conversationId: convs.id,
				type: "text",
				text: '🔵 Сценарий «Кабинет»',
				isBot: null,
				messageId: null,
			}
				
			// console.log("message send: ", message);
		
			//сохранение сообщения в базе данных
			await newRMessage(message)
		
			//сохранить в контексте
			addNewMessage(personW.id, '🔵 Сценарий «Кабинет»', 'text', '', convs.id, null, null);
				
			sendScenariy50()
	
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

		//отправить в телеграмм
		
		//send photo
		let poster1 = 'https://proj.uley.team/upload/posters/about.jpg' //poster 1

		let arr = [poster1]

		arr.map(async(item, index)=> {
			setTimeout(async()=> {
				await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: ''})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
			}, 500 * ++index)
		})			
    }
	

	const sendScenariy5 = async() => {
		console.log("send scenariy5")

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Renthub", web_app: {url: webAppUrl}},
					{"text": "Workhub", url:'https://t.me/ULEY_Workhub_Bot'},
				],
				[
					{"text": "Контакты", callback_data:'/send_contact'},
				],
			]
		});

		//отправить в телеграмм
		
		//send photo
		let poster1 = 'https://proj.uley.team/upload/posters/reklama.jpg' //poster 1

		let arr = [poster1]

		arr.map(async(item, index)=> {
			setTimeout(async()=> {
				await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})
			}, 500 * ++index)
		})			
    }

	const sendScenariy43 = async() => {
		console.log("send scenariy43")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Позвонить", callback_data: '/send_contact'},
				],
			]
		});

		//отправить в телеграмм
		
		//Office
		//if (selectedElement === 5 || mess === 'Реквизиты1' || mess === 'реквизиты1') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/contact.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		//} 
    }

	const sendScenariy44 = async() => {
		console.log("send scenariy44")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Позвонить", callback_data: '/send_belov_contact'},
				],
			]
		});

		//отправить в телеграмм
		
		//Office
		//if (selectedElement === 5 || mess === 'Реквизиты1' || mess === 'реквизиты1') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/Belov.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		//} 
    }

	const sendScenariy45 = async() => {
		console.log("send scenariy44")
		//audio.play();

		//let client = userWorkers.find((client) => client.chatId === user.chatId);

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Офис", callback_data:'/send_office'},
				],
			]
		});

		//отправить в телеграмм
		
		//Office
		//if (selectedElement === 5 || mess === 'Реквизиты1' || mess === 'реквизиты1') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/Office.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})

					// setTimeout(async()=> {
                    //     await delMessageToTelegram({user: user.chatId, messageId: sendToTelegram?.data.result.message_id}) 
                    // }, 1200000) //20 мин.
				}, 500 * ++index)
			})			
		//} 
    }

	const sendScenariy47 = async() => {
		console.log("send scenariy47")


		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Реквизиты", url:'https://uley.team/property'},
				],
			]
		});

		//отправить в телеграмм
		
		//if (selectedElement === 5 || mess === 'Реквизиты1' || mess === 'реквизиты1') {
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
		//} 
    }

	const sendScenariy48 = async() => {
		console.log("send scenariy48")
		const str = `+7 (905) 793-51-49`

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Реквизиты", copy_text: {text: `8(905) 793-51-49`}},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		//if (selectedElement === 6 || mess === 'Реквизиты2' || mess === 'реквизиты2') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/rekviz_nal.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})
				}, 500 * ++index)
			})			
		//} 
    }

	const sendScenariy50 = async() => {
		console.log("send scenariy50")

		const keyboard = JSON.stringify({
			inline_keyboard: [
				[
					{"text": "Открыть", url:'https://uley.team/'},
				],
			]
		});

		//отправить в телеграмм
		
		//Правила
		//if (selectedElement === 6 || mess === 'Реквизиты2' || mess === 'реквизиты2') {
			//send photo
			let poster1 = 'https://proj.uley.team/upload/posters/maya_system.jpg' //poster 1

			let arr = [poster1]

			arr.map(async(item, index)=> {
				setTimeout(async()=> {
					await sendPhotoToTelegram({user: user.chatId, photo: item, keyboard: keyboard})
				}, 500 * ++index)
			})			
		//} 
    }

	const sendPassport = async() => {
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
		//if (selectedElement === 19 || mess === 'Паспорт' || mess === 'паспорт') {
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
		//} 
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
					manager={workersAll.filter((item)=> item.id === managerId)}
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
