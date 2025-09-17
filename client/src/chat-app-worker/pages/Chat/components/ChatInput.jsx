import React, {useRef, useState} from "react";
import Icon from "./../../../components/Icon";
import EmojiPicker from 'emoji-picker-react';

import CIcon from '@coreui/icons-react'
import {
  cilPen,
  cilMediaPlay
} from '@coreui/icons'

import useAutosizeTextArea from "./useAutosizeTextArea.ts";
import {Dropdown, DropdownButton, ButtonGroup } from 'react-bootstrap';

const ChatInput = ({
	showAttach,
	setShowAttach,
	showEmojis,
	setShowEmojis,
	showPicker,
	setShowPicker,
	chosenEmoji,
	mess,
	setMess,
	submitNewMessage,
	onFileChange,
	setSelectedElement,
}) => {

	const [showSave, setShowSave] = useState(false);
	const [showSave2, setShowSave2] = useState(false);
	const [showSave3, setShowSave3] = useState(false);
	const [showSave4, setShowSave4] = useState(false);
	const [showSave5, setShowSave5] = useState(false);
	const [showSave6, setShowSave6] = useState(false);
	const [showSave7, setShowSave7] = useState(false);
	const [showSave8, setShowSave8] = useState(false);

	const textAreaRef = useRef(null);
	useAutosizeTextArea(textAreaRef.current, mess);

	const handleChange = (e) => {
		console.log(e.target.value)
		setMess(e.target.value)
	};

	const detectEnterPress = (e) => {
		if ((e.key === "Enter" && !e.shiftKey) || (e.keyCode === 13 && !e.shiftKey) ) {
			submitNewMessage();
		} 
	};


	const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
		<button
			aria-label="Message options"
			ref={ref}
			onClick={(e) => {
				e.preventDefault();
				onClick(e);
			}}
		>
			{children}
			<Icon id="downArrow"/>											
		</button>
	));

	CustomToggle.displayName = "Search";

	const CustomMenu = React.forwardRef(
		({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
		  const [value, setValue] = useState('');
	  
		  return (
			<div
			  ref={ref}
			  style={{backgroundColor: '#20272b'}}
			  className={className}
			  aria-labelledby={labeledBy}
			>
			  <ul className="list-unstyled">
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

	const change = async (eventkey) => {
		//alert(`you chosen: ${eventkey}`)
		console.log(eventkey)
		setSelectedElement(eventkey)
	}

	const clickEmojis = () => {
		setShowPicker(true)
		setShowEmojis(true)
	}

	const clickClose = () => {
		setShowEmojis(false)
		setShowPicker(false)
	}

	return (
		<div className="chat__input-wrapper">
			{showEmojis && (
				<button aria-label="Close emojis" onClick={clickClose}>
					<Icon id="cancel" className="chat__input-icon" />
				</button>
			)}
			<button aria-label="Emojis" onClick={clickEmojis}>
				<Icon
					id="smiley"
					className={`chat__input-icon ${
						showEmojis ? "chat__input-icon--highlight" : ""
					}`}
				/>
			</button>
			{/* {showEmojis && (
				<>
					<button aria-label="Choose GIF">
						<Icon id="gif" className="chat__input-icon" />
					</button>
					<button aria-label="Choose sticker">
						<Icon id="sticker" className="chat__input-icon" />
					</button>
				</>
			)} */}
			<div className="pos-rel">
				<button aria-label="Attach" onClick={() => setShowAttach(!showAttach)}>
					<Icon
						id="attach"
						className={`chat__input-icon ${
							showAttach ? "chat__input-icon--pressed" : ""
						}`}
					/>
				</button>

				<div className={`chat__attach ${showAttach ? "chat__attach--active" : ""}`}>
						<button
							className="chat__attach-btn"
							aria-label="Choose document"
							key="Choose document"
							// onClick={()=>console.log("Choose document")}
						>
							<label htmlFor='fileInput2'>
								<Icon id="attachDocument" className="chat__attach-icon" />
							</label>
							<input
								type="file"
								id="fileInput2"
								name="photo"
								style={{ display: "none" }}
								onChange={(e)=>onFileChange(e, 'doc')}
							/>							
							
						</button>

						<button
							className="chat__attach-btn"
							aria-label="attachImage"
							key="attachImage"
							// onClick={()=>console.log("Choose image")}
						>
							<label htmlFor='fileInput'>
								<Icon id="attachImage" className="chat__attach-icon" />
							</label>
							<input
								type="file"
								id="fileInput"
								name="photo"
								style={{ display: "none" }}
								onChange={(e)=>onFileChange(e, 'image')}
							/>							
							
						</button>
				</div>


			</div>

			<div style={{marginLeft: '8px', marginRight: '8px'}}>
				{/* <Dropdown onSelect={change}>
					<Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components">											
					</Dropdown.Toggle>
					<Dropdown.Menu as={CustomMenu}>
					<Dropdown.Item eventKey="">Удалить сообщение</Dropdown.Item>
					</Dropdown.Menu>
				</Dropdown> */}

				<DropdownButton
					//onSelect={change}
					as={ButtonGroup}
					id={`dropdown-button-drop-up`}
					drop='up'
					variant="secondary"
					title=''
					// 
				>
					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave(true)} onMouseOut={()=>setShowSave(false)}>
						Приветствие
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(1)}>
							Приветствие
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(2)}>
							Коллеги
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(3)}>
							Новости
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(4)}>
							О себе
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(5)}>
							Реклама
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave2(true)} onMouseOut={()=>setShowSave2(false)}>
						Заявка 
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave2 ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(6)}>
							Новый проект
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(7)}>
							Заявка принята
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(8)}>
							Продолжаем поиски
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(9)}>
							Слабая конверсия
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(10)}>
							Недозвон
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(11)}>
							Долго по проекту
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave3(true)} onMouseOut={()=>setShowSave3(false)}>
						Проект 
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave3 ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(12)}>
							Претенденты
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(13)}>
							Нет связи
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(14)}>
							Техническое задание
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(15)}>
							Собеседование
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(16)}>
							Старший
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(17)}>
							Старший «U.L.E.Y»
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(18)}>
							Старший «R.O.Y»
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(19)}>
							Список паспортных данных
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(20)}>
							Нарушение
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(21)}>
							Форс-мажор
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave4(true)} onMouseOut={()=>setShowSave4(false)}>
						Условия 
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave4 ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(22)}>
							Смета / Проект
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(23)}>
							Смета / Период
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(24)}>
							Смета / Контроль
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(25)}>
							Смета / Собрать
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(26)}>
							Предварительная смета
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(27)}>
							Предварительная финалка
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(28)}>
							Финальная смета
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(29)}>
							Способ оплаты
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(30)}>
							Рейтинг
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave5(true)} onMouseOut={()=>setShowSave5(false)}>
						Ответ 
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave5 ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(31)}>
							Оборудование
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(32)}>
							Обновление системы / ошибки
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(33)}>
							Обратная связь по работе сервиса
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave6(true)} onMouseOut={()=>setShowSave6(false)}>
						Быстрый ответ 
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave6 ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(34)}>
								Принято, спасибо
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(35)}>
								До встречи!
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(36)}>
								Информация получена, ваш вопрос уже в работе
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(37)}>
								Информация получена, мы уже работаем в этом направлении
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(38)}>
								Информация зафиксирована{/*, мы уже работаем над этим  */}
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(39)}>
								Спасибо за информацию, сообщим вам{/*}, как только все будет готово*/}
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(40)}>
								Мы работаем над вашим запросом  {/*  и уже скоро предоставим результаты */}
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(41)}>
								Информация принята, постараемся ответить  {/*  на ваш вопрос в ближайшее время */}
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(42)}>
								На данный момент мы изучаем ваш вопрос {/*и постараемся вернуться к вам с ответом как можно скорее  */}
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					<Dropdown.Item class="dropdown-menu" onMouseOver={()=>setShowSave7(true)} onMouseOut={()=>setShowSave7(false)}>
						Контакты 
						<span style={{position: 'absolute', right: '15px'}}>
							&raquo;
						</span>
						<ul className="dropdown-menu dropdown-submenu" style={{display: showSave7 ? 'block' : 'none'}}>
							<Dropdown.Item onClick={()=>change(43)}>
							Контакты
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(44)}>
							Контакты [Белов]
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(45)}>
							Офис «U.L.E.Y»
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(46)}>
							Почта
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(47)}>
							Реквизиты №1
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(48)}>
							Реквизиты №2 [Белов]
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(49)}>
							Сайт / Vk / Telegram
							</Dropdown.Item>
							<Dropdown.Item onClick={()=>change(50)}>
							Кабинет
							</Dropdown.Item>
						</ul>						
					</Dropdown.Item>

					{/* <Dropdown.Item class="dropdown-menu" eventKey="0">Стандартный ответ</Dropdown.Item>
					<Dropdown.Item eventKey="1">Паспорт</Dropdown.Item>
					<Dropdown.Item eventKey="2">Кнопка с номером</Dropdown.Item>
					<Dropdown.Item eventKey="3">Запас</Dropdown.Item>
					<Dropdown.Item eventKey="4">Офис U.L.E.Y</Dropdown.Item>
					<Dropdown.Item eventKey="5">Оплата / смета</Dropdown.Item>
					<Dropdown.Item eventKey="6">Заявка отклонена</Dropdown.Item>
					<Dropdown.Item eventKey="7">Заявка одобрена</Dropdown.Item>
					<Dropdown.Item eventKey="8">Запрос ключевых данных</Dropdown.Item>
					<Dropdown.Divider />
					<Dropdown.Item eventKey="9">Первый проект</Dropdown.Item>
					<Dropdown.Item eventKey="10">Постер</Dropdown.Item> */}
				</DropdownButton>
				{/* <CFormSelect 
						style={{marginTop: '10px', marginBottom: '10px',  display: "block"}}
                        aria-label="Default select example"
                        options={scenarios}  
						// value={scenari}
						selectedElement={selectedElement}
                    	setSelectedElement={setSelectedElement}
                        onChange={onSelectChange}
				/> */}
				{/* <button className="profile__action-right" style={{padding: '6px'}}>
					<CIcon icon={cilMediaPlay} 
					<Icon id="downArrow" style={{color: 'white'}}/>{" "} 
				</button> */}
			</div>
			
			<textarea
				className="chat__input"
				placeholder="Введите сообщение"
				value={mess} 
				onChange={handleChange} 
				ref={textAreaRef}			
				rows={1}
			/>

			<button aria-label="Send message" onClick={submitNewMessage}>
				<Icon id="send" className="chat__input-icon" />
			</button>
		</div>
	);
};

export default ChatInput;
