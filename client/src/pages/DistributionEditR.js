import React, { Suspense, useState, useEffect } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
import { AppSidebar, AppFooter, AppHeader } from '../components/index'
import { Link, useLocation } from 'react-router-dom'
import { 
  CRow,
  CCol,
  CCard,
  CCardBody,
  CForm,
  CFormLabel,
  CFormInput,
  CFormTextarea,
  CButton,
  CAlert,
  CFormCheck,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter
} from '@coreui/react'
import CIcon from '@coreui/icons-react';
import { cilX, cilCaretBottom, cilCarAlt, cilCaretLeft } from '@coreui/icons';

//import { MultiSelect } from "react-multi-select-component";
import { useUsersContext } from "../chat-app-new/context/usersContext";
import { $host } from '../http/index';
import { useNavigate } from 'react-router-dom';

import { 
  newDistributionR, 
  getDistributionsR,
  getDistributionR, 
  getWorkerId, 
  getProjects3, 
  getBlocks, 
  getDatabaseId,
  newPretendent,
  editDistributionW2,
  getProjectNewDate, 
  editDistributionWAll, 
  getProjectNewCash,
} from '../http/adminAPI';

import { uploadFile } from '../http/chatAPI';
import { newMessage, delWMessage } from '../http/workerAPI';
import specData from '../data/specData';
import categories from '../data/categories';

import sendSound from './../chat-app-new/assets/sounds/distribution_sound.mp3';
import phone_image from './../assets/images/phone2.png';
import noimage2 from './../assets/images/images.png';
import treug from './../assets/images/treugolnik.png';
import { locale } from 'core-js/web';
import { v4 as uuidv4 } from 'uuid';
import { delMessageToTelegram } from 'src/http/telegramAPI'

const DistributionEditR = () => {
  const [poster, setPoster]= useState('');

  const location = useLocation()
  const projId = location.state?.project //? location.state.project : ""
  const distribId = location.state?.id
  const categoriesitem = location.state?.category
  const datestart = location.state?.date
  const img = location.state?.img
  const text2 = location.state?.text
  const uuidProj = location.state?.uuid
  const editDistrib = location.state?.editD
  const delivered = location.state?.delivered
  const users = location.state?.users
  const target2 = location.state?.target
  const stavka = location.state?.stavka
  const button = location.state?.button
  const editButton = location.state?.editButton
  
  const token = process.env.REACT_APP_TELEGRAM_API_TOKEN_WORK
	const host = process.env.REACT_APP_HOST
  const chatAdminId = process.env.REACT_APP_CHAT_ADMIN_ID
  const webAppAddStavka = process.env.REACT_APP_WEBAPP_STAVKA
  const hostServer = process.env.REACT_APP_API_URL

  const { userWorkers: clients, workersAll } = useUsersContext();
  const { addNewDistrib, addNewMessage2, distributionsWork, setDistributionsWork, delWMessageContext } = useUsersContext();
  const [contacts, setContacts]= useState([]);
  const [projects, setProjects]= useState([]); 
  const [contacts2, setContacts2]= useState([]);
  const [labelName, setLabelName] = useState({})
  const [proj, setProj] = useState('');
  const [planShow, setPlanShow] = useState(false);
  const [uuidDistrib, setUuidDistrib] = useState('');
  const [target, setTarget] = useState('');

  const [arrCategory, setArrCategory] = useState([]);
  const [arrCategory2, setArrCategory2] = useState([]);
  const [arrCategory3, setArrCategory3] = useState([]);
  const [arrCategory4, setArrCategory4] = useState([]);
  const [arrCategory5, setArrCategory5] = useState([]);
  const [arrCategory6, setArrCategory6] = useState([]);
  const [arrCategory7, setArrCategory7] = useState([]);

  const [arrTemp, setArrTemp] = useState([]);
  const [arrTemp2, setArrTemp2] = useState([]);
  const [arrTemp3, setArrTemp3] = useState([]);
  const [arrTemp4, setArrTemp4] = useState([]);
  const [arrTemp5, setArrTemp5] = useState([]);
  const [arrTemp6, setArrTemp6] = useState([]);
  const [arrTemp7, setArrTemp7] = useState([]);

  const [categoryAll, setCategoryAll] = useState();
  const [categoryAll2, setCategoryAll2] = useState();

  const [selected, setSelected] = useState([]);
  const [arrSelect, setArrSelect] = useState([]);
  const [arrLength, setArrLength] = useState(0);
  const [text, setText] = useState('');
  const [countChar, setCountChar] = useState(0);
  const [visible, setVisible] = useState(false); //показать сообщенме об отпарвке
  const [visibleDelMess, setVisibleDelMess] = useState(false); //показать сообщенме об удалении
  const [showEditButtonAdd, setShowEditButtonAdd] = useState(false);
  const [showNameProject, setShowNameProject] = useState(true);
  const [sendToAdmin, setSendToAdmin] = useState(true);
  const [textButton, setTextButton] = useState('');
  const [textUrl, setTextUrl] = useState('');
  const [file, setFile] = useState(0);
  const [filePreview, setFilePreview] = useState();
  const [value, setValue] = useState("");
  const [image, setImage]= useState("");
  const [stavka2, setStavka2] = useState(false);

  const [value2, setValue2] = useState("");

  const [loader, setLoader] = useState(false);
  const [loaderStart, setLoaderStart] = useState(true);
  const [valueProject, setValueProject] = useState('')
  const [valueSelect, setValueSelect] = useState(0)
  const [valueSelect2, setValueSelect2] = useState(0)
  const [valueSelect3, setValueSelect3] = useState(0)
  const [valueSelect4, setValueSelect4] = useState(0)
  const [valueSelect5, setValueSelect5] = useState(0)
  const [valueSelect6, setValueSelect6] = useState(0)
  const [valueSelect7, setValueSelect7] = useState(0)

  const [showCategories2, setShowCategories2] = useState(false);
  const [showCategories3, setShowCategories3] = useState(false);
  const [showCategories4, setShowCategories4] = useState(false);
  const [showCategories5, setShowCategories5] = useState(false);
  const [showCategories6, setShowCategories6] = useState(false);
  const [showCategories7, setShowCategories7] = useState(false);

  const [disabledBtn, setDisabledBtn] = useState(true);

  const [count, setCount] = useState(0);

  const [visibleModal, setVisibleModal] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [countSend, setCountSend] = useState(0)

  const [onButtonStavka, setOnButtonStavka] = useState(false)

  const [showCheckTarget, setShowCheckTarget] = useState(true)
  
  const audio = new Audio(sendSound);

  const navigate = useNavigate();
  const backPage = () => {
       navigate('/distributionw');
  } 


  //загрузка новых проектов
  useEffect(() => {
    const fetchData = async () => {

      let projects = await getProjectNewCash();
      console.log("Загрузка проектов из БД ...")
      console.log("projects planer: ", projects)
      console.log("clients: ", clients)

      setProjects(projects) 
    
      //для редактирования рассылки
      if (projId) {
        setPoster(img)
        console.log("Текущий проект: ", projId)
        console.log("Текущая рассылка: ", distribId)
        console.log("Текущий постер: ", img)
        console.log("Сохраненные категории: ", categoriesitem)
        console.log("Сохраненная дата: ", datestart)
        console.log("Сохраненный UUID", uuidProj)
        console.log("Доставлено: ", delivered)
        console.log("Получатели: ", users.split(',').length)
        console.log("Кнопка: ", button)
        console.log("Ставка: ", stavka)
        console.log("Ред. кнопка: ", editButton)
        console.log("Ссылка: ", target2)
        
        const distrib = await getDistributionR(distribId)
        onHandlingProject(projId, true, projects, uuidProj)

        const catItems = categoriesitem.split(',')
        console.log("catItems: ", catItems)

        //установка категорий
        catItems.map((cat, index)=> {
          //console.log("cat: ", cat)
          const indexCat = categories.findIndex(item=>item.label === cat) //item.label
          // console.log("catItems: ", catItems)
          console.log("indexCat: ", indexCat)

          if (index === 0) {
            console.log("index1: ", index)
            setValueSelect(indexCat)
          }
          if (index === 1) {
            console.log("index2: ", index)
            setValueSelect2(indexCat)
            setShowCategories2(true)
          } 
          if (index === 2) {
            console.log("index3: ", index)
            setValueSelect3(indexCat)
            setShowCategories3(true)
          } 
          if (index === 3) {
            console.log("index4: ", index)
            setValueSelect4(indexCat)
            setShowCategories4(true)
          } 
          if (index === 4) {
            console.log("index5: ", index)
            setValueSelect5(indexCat)
            setShowCategories5(true)
          } 
          if (index === 5) {
            console.log("index6: ", index)
            setValueSelect6(indexCat)
            setShowCategories6(true)
          } 
          if (index === 6) {
            console.log("index7: ", index)
            setValueSelect7(indexCat)
            setShowCategories7(true)
          } 
        })
        

        //установка получателей
        setSelected([...users.split(',')])

        //установка категори получателей
        console.log("categoriesitem: ", categoriesitem)
        const cat1 = categoriesitem.split(',')
        setCategoryAll(cat1)

        cat1.map((cat)=> {
          const cat_name = categories.find(item=>item.label === cat)
          //const cat2 = cat_name.name.split(',')
          let arr = []
          arr.push(cat_name)
          setCategoryAll2(arr)    
        })

        //для текстового поля
        setText(text2)

        //для телефона
        if (img !== ' ') {
          setFilePreview(img) 
          setImage(img)
        }  
        
        setPlanShow(true)

        setShowEditButtonAdd(editButton)

        setTextButton(button)

        setStavka2(stavka)

        setTarget(target2)

        setLoaderStart(false)
      } 
    }

    fetchData();  
  },[])


   //проекты с названием
   useEffect(() => {
    const arrProjects = [{
      label: 'Выбрать...',
      value: '0',
    }]

    if (projects.length > 0) {
      projects.map((project) => {
        if (project != null) {
          const d = new Date(project.datestart);
          const month = String(d.getMonth()+1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");

          const newObj = {
            label: `${day}.${month} | ${project.name}`, 
            value: project.id,
          }
          arrProjects.push(newObj)
        }    
      })
      setContacts(arrProjects)    
    }  
  }, [projects]);
  

  //проекты с номерами
  useEffect(() => {
    const arrProjects = [{
      label: 'Выбрать...',
      value: '0',
    }]

    if (projects.length > 0) {
      projects.map((project) => {
        if (project != null) {
          const newObj = {
            label: project.crmID,
            value: project.id,
          }
          arrProjects.push(newObj)
        }
      })
      setContacts2(arrProjects)
    }
          
  }, [projects]);

//=======================================================

//выбор название проекта или номер проекта
const onChangeProjectName = () => {
  setShowNameProject(true)
  setSelected([])
  setValueSelect(0)
}

const onChangeProjectNumber = () => {
  setShowNameProject(false)
  setSelected([])
  setValueSelect(0)
}

function unDuplicateArraySingleValues(array) {
  // Проверка, что это не пустой массив
  if ((Array.isArray(array) || array instanceof Array) && array.length) {
    // Возвращает массив уникальных значений
    return [...new Set(array)];
  } else {
    // Это не заполненный массив,
    // возвращаем переданное без изменений
    return array;
  }
}

function unDuplicateArrayObjects(array, propertyName) {
  if ((Array.isArray(array) || array instanceof Array)
    && array.length
    && typeof propertyName === 'string'
    && propertyName.length) {
    // Массив значений из ключа propertyName, который надо проверить
    const objectValuesArrayFromKey = array.map(item => item[propertyName]);

    // Удалить дубли этих значений с помощью предыдущей функции
    const uniqueValues = unDuplicateArraySingleValues(objectValuesArrayFromKey);

    // Вернуть массив только с уникальными объектами
    return uniqueValues.map(
      key => array.find(
        item => item[propertyName] === key
      )
    );
  } else {
    return array;
  }
}

const setCategoryItem = (arr2) => {
  if(arr2[0]) {
    setValueSelect(arr2[0].value)
  }

  if(arr2[1]) {
    setValueSelect2(arr2[1]?.value)
    setShowCategories2(true)
  }

  if(arr2[2]) {
    setValueSelect3(arr2[2]?.value)
    setShowCategories3(true)
  }

  if(arr2[3]) {
    setValueSelect4(arr2[3].value)
    setShowCategories4(true)
  }

  if(arr2[4]) {
    setValueSelect5(arr2[4].value)
    setShowCategories5(true)
  }

  if(arr2[5]) {
    setValueSelect6(arr2[5].value)
    setShowCategories6(true)
  }

}

//ф-я получения категорий проекта
const getCategoryFromNotion = async(projectId) => {
  if (projectId !== '0') {
    let count_title;
    setLoader(true)
    const blockId = await getBlocks(projectId);

    if (blockId) {
      const databaseBlock = await getDatabaseId(blockId.data); 
      setLoader(false)
      const categories2 = [...databaseBlock.data]

      console.log("Основной состав: ", categories2)

      specData.map((category)=> {
        category.models.map((spec)=> {
          count_title = 0;

          if (databaseBlock.data.length > 0) {   
            databaseBlock.data.map((db) => {
              if (spec.name === db.spec) {
                count_title++
              }
            })
            
            if (count_title !== 0) {
              const obj = {
                id: category.id,
                title: category.icon,
                name: category.name,
                count: count_title,
              }
              arr_count.push(obj)
            }         
          }
        })
      })  

      console.log("arr_count: ", arr_count)
      setArrLength(arr_count.length)

      let unique = unDuplicateArrayObjects(arr_count, 'id')

      const arr2 = []
      const arr3 = []
      const arr4 = []
      unique.map((item)=> {
          const obj = {
            label: item.title,
            value: item.id,
            name: item.name
          }
          arr2.push(obj)
          arr3.push(item.title)
          arr4.push(item.name)
      })
      console.log("arr2: ", arr2)
      console.log("categoryAll2: ", arr4)
      
      setCategoryAll(arr3)
      setCategoryAll2(arr4)

      //ф-я установки списка категорий
      setCategoryItem(arr2)
      
      //список специалистов с массивом специальностей (категорий)
      workersAll.map((worker)=> {
        JSON.parse(worker.worklist).map((work) => {
          arr_count.map((cat)=>{
            //console.log("cat: ", work.cat)
            if (work.cat === cat.title) {
              arrSelect.push(worker.chatId)
            } 
          })
        })
      })
      //выбрать уникальных специалистов
      const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
      setSelected(arr)
      console.log("selected 0: ", arr)     
    }
  } else {
    setValueSelect(0)
  }
}



//функция обработки изменения текущего проекта
const onHandlingProject = async(projectId, save, projects, uuidProj) => {
  const arrProjects = []

  setUuidDistrib(uuidProj ? uuidProj : uuidv4())
  console.log("uuid: ", uuidv4()) // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  console.log("uuidSave: ", uuidProj) // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
  console.log("save: ", save)
  console.log("projectId: ", projectId)
  console.log("projects: ", projects)

  //для планировщика рассылок
  setProj(projectId)
  
  //для селектов (value)
  setValueProject(projectId)
  
  console.log("contacts: ", contacts)

  if (save) {
    projects.map((project) => {
      if (project != null) {
        const d = new Date(project.datestart);
        const month = String(d.getMonth()+1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");

        const newObj = {
          label: `${day}.${month} | ${project.name}`, 
          value: project.id,
        }
        arrProjects.push(newObj)
      }    
    })
    const obj = arrProjects.find((item1)=>item1.value === projectId)
    console.log("objSave: ", obj)
    setLabelName(obj)

  } else {
    const obj = contacts.find((item)=>item.value === projectId)
    console.log("obj: ", obj)
    setLabelName(obj)
  }

  

  if (save) {
    const result = categoriesitem.split(',');
    const arr2 = []
    const arr3 = []
    const arr4 = []
    specData.map((category)=> {
      result.map((item)=> {
        if (item === category.icon) {
          const obj = {
              label: category.icon,
              value: category.id,
              //name: category.name
          }
          arr2.push(obj)
          arr3.push(item)
          //arr4.push(item)
        }
      })
    })
      
    setCategoryAll(arr3)
    //setCategoryAll2(arr4)

    //ф-я установки списка категорий
    setCategoryItem(arr2)

    let arr_temp = []
    //список специалистов с массивом специальностей (категорий)
    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=>{
          specData.map((category)=> {
            if (cat === category.icon) {
              //console.log("cat_name: ", category.name)
              if (work.cat === category.name) {
                arr_temp.push(worker.chatId)
              } 
            }
          })
        })
      })
    })
    //выбрать уникальных специалистов
    const arr = [...arr_temp].filter((el, ind) => ind === arr_temp.indexOf(el));
    setSelected(arr)

  } else {
    await getCategoryFromNotion(projectId)
  }
  
}


let arr_count = []

//выбор проекта
const onChangeSelectProject = async(e) => {
  e.preventDefault();

  //сбросить кол-во получателей до 0
  setSelected([])
  setArrSelect([])
  //сбросить счетчик нажатий кнопки (Добавить)
  setCount(0)
  setValueSelect(0)
  setValueSelect2(0)
  setValueSelect3(0)
  setValueSelect4(0)
  setValueSelect5(0)
  setValueSelect6(0)
  setValueSelect7(0)
  setShowCategories2(false)
  setShowCategories3(false)
  setShowCategories4(false)
  setShowCategories5(false)
  setShowCategories6(false)
  setShowCategories7(false)
  
  //обработка проекта (поиск категорий)
  onHandlingProject(e.target.value, false) 
}

const onChangeAddButton = () => {
  setShowEditButtonAdd(true)
}

const onChangeAddButton2 = () => {
  setShowEditButtonAdd(false)
}

//=========================================================

//треугольник Добавить категорию
const onAddCategory0 = (e) => {
  e.preventDefault();
  if (count < 3) {
    setCount(count + 1)
    console.log(count + 1)
  }
  setValueSelect(e.target.value)

  if (arrLength < 2) {
    if ((count + 1) === 1) {
      setShowCategories2(true)
    }

    if ((count + 1) === 2) {
      setShowCategories3(true)
    }

    if ((count + 1) === 3) {
      setShowCategories4(true)
    }
  } else if (arrLength === 2) {
    if ((count + 1) === 1) {
      setShowCategories3(true)
    }

    if ((count + 1) === 2) {
      setShowCategories4(true)
    }

    if ((count + 1) === 3) {
      setShowCategories5(true)
    }
  } else if (arrLength === 3) {
    if ((count + 1) === 1) {
      setShowCategories4(true)
    }

    if ((count + 1) === 2) {
      setShowCategories5(true)
    }

    if ((count + 1) === 3) {
      setShowCategories6(true)
    }
  } else if (arrLength === 4) {
    if ((count + 1) === 1) {
      setShowCategories5(true)
    }

    if ((count + 1) === 2) {
      setShowCategories6(true)
    }

    if ((count + 1) === 3) {
      setShowCategories7(true)
    }
  } 
}

//Изменить категорию (1-й селект)
const onAddCategory = (e) => {
  e.preventDefault();
  setValueSelect(e.target.value)

  if (e.target.value === '0') {
    setSelected([])
    //setDisabledBtn(false)
  } else {
    const cat_name = categories[e.target.value].name
    console.log("cat_name1: ", cat_name)
    const cat_label = categories[e.target.value].label
    console.log("select1: ", cat_label)
    setArrSelect([])
    arrCategory.pop()
    arrCategory.push(cat_name)
    arrTemp.pop()
    arrTemp.push(cat_label)

    setCategoryAll2(arrCategory)
    setCategoryAll(arrTemp)

    const result = [...arrCategory]
    const result2 = [...arrTemp]
    console.log("result: ", arrCategory)
    console.log("categoryAll: ", arrTemp)
    console.log("arr: ", arrSelect)
    
    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log("selected: ", arr)
  }
  
}

//Изменить категорию (2-й селект)
const onAddCategory2 = (e) => {
  e.preventDefault();
  setValueSelect2(e.target.value)

  if (e.target.value === 0) {
    setSelected([])
  } else {
    const cat_name = categories[e.target.value].name
    const cat_label = categories[e.target.value].label
    console.log("cat_name2: ", cat_name)
    console.log("select2: ", cat_label)
    console.log("categoryAll2: ", categoryAll2)
    console.log("categoryAll: ", categoryAll)

    setArrSelect([])

    arrCategory2.pop()
    arrCategory2.push(cat_name)

    arrTemp2.pop()
    arrTemp2.push(cat_label)
    
    setCategoryAll2([...categoryAll2, ...arrCategory2])
    setCategoryAll([...categoryAll, ...arrTemp2])

    const result = [...categoryAll2, ...arrCategory2]
    const result2 = [...categoryAll, ...arrTemp2]
    console.log("result: ", result)
    console.log("categoryAll: ", result2)

    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log(arr)
  }
}

//Изменить категорию (3-й селект)
const onAddCategory3 = (e) => {
  e.preventDefault();
  setValueSelect3(e.target.value)

  if (e.target.value === 0) {
    setSelected([])
  } else {
    const cat_name = categories[e.target.value].name
    const cat_label = categories[e.target.value].label
    console.log("cat_name3: ", cat_name)
    console.log("select3: ", cat_label)

    setArrSelect([])
    arrCategory3.pop()
    arrCategory3.push(cat_name)
    arrTemp3.pop()
    arrTemp3.push(cat_label)

    //console.log("arrCategory3: ", arrCategory3)
    setCategoryAll2([...categoryAll2, ...arrCategory3])
    setCategoryAll([...categoryAll, ...arrTemp3])
    
    const result = [...categoryAll2, ...arrCategory3]
    const result2 = [...categoryAll, ...arrTemp3]
    console.log("result: ", result)
    console.log("categoryAll: ", result2)

    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log(arr)
  }
}

//Изменить категорию (4-й селект)
const onAddCategory4 = (e) => {
  e.preventDefault();
  setValueSelect4(e.target.value)

  if (e.target.value === 0) {
    setSelected([])
  } else {
    const cat_name = categories[e.target.value].name
    const cat_label = categories[e.target.value].label
    console.log("cat_name4: ", cat_name)

    setArrSelect([])
    arrCategory4.pop()
    arrCategory4.push(cat_name)
    arrTemp4.pop()
    arrTemp4.push(cat_label)

    setCategoryAll2([...categoryAll2, ...arrCategory4])
    setCategoryAll([...categoryAll, ...arrTemp4])
    
    const result = [...categoryAll2, ...arrCategory4]
    const result2 = [...categoryAll, ...arrTemp4]
    console.log("result: ", result)
    console.log("categoryAll: ", result2)

    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log(arr)
  }
}

//Изменить категорию (5-й селект)
const onAddCategory5 = (e) => {
  e.preventDefault();
  setValueSelect5(e.target.value)

  if (e.target.value === 0) {
    setSelected([])
  } else {
    const cat_name = categories[e.target.value].name
    const cat_label = categories[e.target.value].label
    console.log("cat_name5: ", cat_name)

    setArrSelect([])
    arrCategory5.pop()
    arrCategory5.push(cat_name)
    arrTemp5.pop()
    arrTemp5.push(cat_label)

    setCategoryAll2([...categoryAll2, ...arrCategory5])
    setCategoryAll([...categoryAll, ...arrTemp5])
    
    const result = [...categoryAll2, ...arrCategory5]
    const result2 = [...categoryAll, ...arrTemp5]
    console.log("result: ", result)
    console.log("categoryAll: ", result2)

    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log(arr)
  }
}

//Изменить категорию (6-й селект)
const onAddCategory6 = (e) => {
  e.preventDefault();
  setValueSelect6(e.target.value)

  if (e.target.value === 0) {
    setSelected([])
  } else {
    const cat_name = categories[e.target.value].name
    const cat_label = categories[e.target.value].label
    console.log("cat_name6: ", cat_name)

    setArrSelect([])
    arrCategory6.pop()
    arrCategory6.push(cat_name)
    arrTemp6.pop()
    arrTemp6.push(cat_label)

    setCategoryAll2([...categoryAll2, ...arrCategory6])
    setCategoryAll([...categoryAll, ...arrTemp6])
    
    const result = [...categoryAll2, ...arrCategory6]
    const result2 = [...categoryAll, ...arrTemp6]
    console.log("result: ", result)
    console.log("categoryAll: ", result2)

    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log(arr)
  }
}

//Изменить категорию (7-й селект)
const onAddCategory7 = (e) => {
  e.preventDefault();
  setValueSelect7(e.target.value)

  if (e.target.value === 0) {
    setSelected([])
  } else {
    const cat_name = categories[e.target.value].name
    const cat_label = categories[e.target.value].label
    console.log("cat_name7: ", cat_name)

    setArrSelect([])
    arrCategory7.pop()
    arrCategory7.push(cat_name)
    arrTemp7.pop()
    arrTemp7.push(cat_label)

    setCategoryAll2([...categoryAll2, ...arrCategory7])
    setCategoryAll([...categoryAll, ...arrTemp7])

    const result = [...categoryAll2, ...arrCategory7]
    const result2 = [...categoryAll, ...arrTemp7]
    console.log("result: ", result)
    console.log("categoryAll: ", result2)

    workersAll.map((worker)=> {
      JSON.parse(worker.worklist).map((work) => {
        result.map((cat)=> {
          if (work.cat === cat) {
            arrSelect.push(worker.chatId)
          } 
        })
      })
    })
    
    //выбрать уникальных специалистов
    const arr = [...arrSelect].filter((el, ind) => ind === arrSelect.indexOf(el));
    
    setSelected(arr)
    console.log(arr)
  }
}

//----------------------------------------

{/* Удаление категорий */}
const delCategory2 = (category) => {
  setShowCategories2(false)
  setValueSelect2(0)
  // console.log("Удаление категории 2: ", arrCategory2)
  // arrCategory2.pop()
  setCount(count - 1)

  categoryAll.pop()

  if (valueSelect2 !== 0) {
    setCategoryAll(categoryAll) //.filter((item) => item !== categories[category].name))
    console.log("categoryAll: ", categoryAll) //.filter((item) => item !== categories[category].name))
  }
}

const delCategory3 = (category) => {
  setShowCategories3(false)
  setValueSelect3(0)
  // console.log("Удаление категории 3: ", arrCategory3)
  // arrCategory3.pop()
  setCount(count - 1)

  categoryAll.pop()

  if (valueSelect3 !== 0) {
    setCategoryAll(categoryAll) //.filter((item) => item !== categories[category].name))
    console.log("categoryAll: ", categoryAll) //.filter((item) => item !== categories[category].name))
  }
}

const delCategory4 = (category) => {
  setShowCategories4(false)
  setValueSelect4(0)
  //console.log("Удаление категории 4: ", arrCategory4)
  //arrCategory4.pop()
  setCount(count - 1)

  categoryAll.pop()

  if (valueSelect4 !== 0) {
    setCategoryAll(categoryAll) //.filter((item) => item !== categories[category].name))
    console.log("categoryAll: ", categoryAll) //.filter((item) => item !== categories[category].name))
  }
}

const delCategory5 = (category) => {
  setShowCategories5(false)
  setValueSelect5(0)
  // console.log("Удаление категории 5: ", arrCategory5)
  // arrCategory5.pop()
  setCount(count - 1)

  categoryAll.pop()

  if (valueSelect5 !== 0) {
    setCategoryAll(categoryAll) //.filter((item) => item !== categories[category].name))
    console.log("categoryAll: ", categoryAll) //.filter((item) => item !== categories[category].name))
  }
}

const delCategory6 = (category) => {
  setShowCategories6(false)
  setValueSelect6(0)
  // console.log("Удаление категории 6: ", arrCategory6)
  // arrCategory6.pop()
  setCount(count - 1)

  categoryAll.pop()

  if (valueSelect6 !== 0) {
    setCategoryAll(categoryAll) //.filter((item) => item !== categories[category].name))
    console.log("categoryAll: ", categoryAll) //.filter((item) => item !== categories[category].name))
  }
}

const delCategory7 = (category) => {
  setShowCategories7(false)
  setValueSelect7(0)
  // console.log("Удаление категории 7: ", arrCategory7)
  // arrCategory7.pop()
  setCount(count - 1)

  categoryAll.pop()

  if (valueSelect7 !== 0) {
    setCategoryAll(categoryAll) //.filter((item) => item !== categories[category].name))
    console.log("categoryAll: ", categoryAll) //.filter((item) => item !== categories[category].name))
  }
}


//=======================================================

  const onChangeText = (e) => {
    setText(e.target.value)
    setCountChar(e.target.value.length)
    if (e.target.value.length > 0) {
      setPlanShow(true)
    } else {
      setPlanShow(false)
    }
  }


  useEffect(() => {
    const getImage = async () => {
        if (file) {
          setShowUpload(true)
          console.log("file:", file)
          const data = new FormData();
          data.append("name", file.name);
          data.append("photo", file);
          
          let response = await uploadFile(data);
          console.log("response: ", response.data.path)

          setImage(response.data.path.split('.team')[1]);
          //сообщение с ссылкой на файл
          console.log("Путь к файлу: ", host + response.data.path.split('.team')[1])
          //setValue(host + response.data.path)
          setPoster(host + response.data.path.split('.team')[1])
          setPlanShow(true)
          setShowUpload(false)
        }
    }
    getImage();
  }, [file])


  {/* Добавление файла */}
  const onFileChange = (e) => {
    //console.log("file change: ", e.target.files[0])
    setFile(e.target.files[0]);
    setFilePreview(URL.createObjectURL(e.target.files[0]));
    //console.log("file URL change: ", URL.createObjectURL(e.target.files[0]))
  }


  {/* Показать Добавление текста кнопки */}
  const clickShowEditButton = (e) => {
    e.preventDefault();
    showEditButtonAdd ? setShowEditButtonAdd (false) : setShowEditButtonAdd (true)
  }

  const onChangeTextButton = (e) => {
    setTextButton(e.target.value)
    //setShowCheckTarget(true)
  }

  const onChangeCheckTarget = (e) => {
    setShowCheckTarget(!showCheckTarget)
  }

  const onChangeTextUrl = (e) => {
    setTarget(e.target.value)
  }

  //===================================================================
  {/* Запланировать рассылку */}
  const onPlanerShow = async(label, proj, text, id, cats, count, date, poster, uuidDistrib) => {
    setVisibleModal(!visibleModal)

    if (selected.length !== 0 && proj || selected.length !== 0 && text) {
      navigate('/distributionw_planer', {
        state: {
          labelProj: label,
          project: proj,
          text: text,
          id: id,
          category: cats,
          count: count,
          date: date,
          image: poster,
          selected: selected, 
          uuid: uuidDistrib,
          textbutton: textButton,
          showbuttons: showEditButtonAdd,
          stavka: onButtonStavka,
          target: target,
        }
      });
    } 
  }


//==============================================================================================
  {/* Отправка рассылки */}
//==============================================================================================
  const onSendText = async() => {
    console.log("категории: ", categoryAll)
    console.log("текст: ", text)
    console.log("постер: ", image)
    console.log("получатели: ", selected)

    setShowSend(true)

    let countSuccess = 0

    if (selected.length !== 0 && file || selected.length !== 0 || image) {
      audio.play();

      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth()+1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      let arrUsers = []

      //новая рассылка
      const message = {
        text: text, 
        image: image ? (image.startsWith('https://') ? `${image}` : `https://proj.uley.team${image}`) : '', 
        project: labelName.label, 
        projectId: valueProject,
        receivers: categoryAll.toString(), 
        datestart: new Date(), 
        delivered: 'true',   
        count: selected.length, 
        date: `${day}.${month}.${year}`, 
        button: textButton,
        users: selected.toString(),
        uuid: uuidDistrib,  
        editButton: showEditButtonAdd,
        stavka: onButtonStavka,  
        target: target,
      }
      console.log("message send button: ", message);

      //сохранение рассылки в базе данных
      const distrNew = await newDistributionR(message)
      console.log("distrNew: ", distrNew.id)

      // selected.map(async (user, index) => { 
      //   const url_send_msg = `https://api.telegram.org/bot${token}/getChat?chat_id=${user}`
      //   const sendTextToTelegram = await $host.get(url_send_msg);
      //   console.log("res: ", sendTextToTelegram)
      // })

      const res = await $host.get(hostServer + 'api/distributionsw/send/' + distrNew.id);

      setShowSend(false)

      //обновить список рассылок
      addNewDistrib(true)

      setSelected([])
      setText('')
      setShowEditButtonAdd(false)
      setTextButton('')
      setVisible(true) //показать сообщение об отправке
      setValue('')

      setValueSelect(0)

      setTimeout(() => navigate('/distributionw'), 1000);

    }
    else {
      setVisibleModal(!visibleModal)
    }
  
  }

  const onChangeCheckButton = (e) => {
    setStavka2(!stavka2)
    setOnButtonStavka(e.target.checked)
  }

  //------------------------------------------------------------
  //-------------Удаление сообщений в рассылке-------------------
  //------------------------------------------------------------
  const onDeleteMessages = (id) => {
    const distrib = distributionsWork.filter(p => p.id === id)
    console.log("distrib: ", distrib)
    const arrUsers = JSON.parse(distrib[0].report)
    
    arrUsers.map(async(item)=> {
      console.log(item.mess ? 'mess: ' + item.mess : '...')
      
      //удалить сообщение через сокет
      //delWMessageContext(item.mess, message.date, message.chatId)

      //удалить сообщение в базе данных
      if (item.mess) {
        await delWMessage(item.mess)
      } 

      // const url_del_msg = `https://api.telegram.org/bot${token}/deleteMessage?chat_id=${item.user}&message_id=${item.mess}`
      // const delToTelegram = await $host.get(url_del_msg);
      const delToTelegram = await delMessageToTelegram({user: item.user, messageId: item.mess})


      //Выводим сообщение об успешном удалении
      if (delToTelegram) {
        console.log('Ваше сообщение удалено из телеграм! ', delToTelegram);	
        setVisibleDelMess(true) //показать сообщение об отправке
      }           
      else {
        //А здесь сообщение об ошибке при отправке
        console.log('Что-то пошло не так. Попробуйте ещё раз.');
      }
    })
  }

  //==============================================================================================
  {/* Сохранение рассылки */}
//==============================================================================================
const onSaveText = async() => {
    //setShowSend(true)

    let countSuccess = 0

    if (selected.length !== 0 && file || selected.length !== 0 || image) {
      audio.play();

      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth()+1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");

      let arrUsers = []

      //новая рассылка
      const message = {
        text: text, 
        category: categoryAll.toString(),
        image: image ? (image.startsWith('http') ? image : `${host}${image}`) : '', 
        project: labelName.label, 
        projectId: valueProject,
        receivers: categoryAll.toString(), 
        datestart: datestart, 
        // delivered: 'true',   
        count: selected.length, 
        // date: `${day}.${month}.${year}`, 
        button: textButton,
        users: selected.toString(),
        uuid: uuidDistrib,  
        editButton: showEditButtonAdd,
        stavka: onButtonStavka,  
        target: target,
      }
      console.log("message send button: ", message);

      //сохранение рассылки в базе данных
      await editDistributionWAll(message, distribId)

      //setShowSend(false)

      //обновить список рассылок
      addNewDistrib(true)

      setSelected([])
      setText('')
      setShowEditButtonAdd(false)
      setTextButton('')
      setVisible(true) //показать сообщение об отправке
      setValue('')

      setValueSelect(0)

      setTimeout(() => navigate('/distributionw'), 1000);
    }
    else {
      setVisibleModal(!visibleModal)
    }
}

  return (
    <div className='dark-theme'>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-uley">
        <AppHeader />
        <div className="body flex-grow-1 px-3">

            <CContainer lg>
                <Suspense fallback={<CSpinner color="primary" />}>
                  <>
                    <CAlert color="success" dismissible visible={visible} onClose={() => setVisible(false)}>
                      Сообщение успешно отправлено!
                    </CAlert>
                    <CAlert color="success" dismissible visible={visibleDelMess} onClose={() => setVisibleDelMess(false)}>
                      Сообщения рассылки успешно удалены!
                    </CAlert>
                    <h2>Редактирование рассылки</h2>
                    {loaderStart ? <div className='text-center' style={{marginTop: '25%'}}><CSpinner/></div>
                  : <>                 
                      <CRow>
                          <CCol xs>
                            <CCard className="mb-4" style={{height: '650px'}}>
                              {/* <CCardHeader>Рассылки</CCardHeader> */}
                              <CCardBody>
                              
                                <CForm>
                                  <div style={{color: '#f3f3f3'}}>
                                    <CRow className="mb-3">
                                      <CCol sm={3} >  

                                        <p style={{color: '#f3f3f3'}}>Проект:</p>

                                        <CRow className="mb-3"> 
                                          <CCol sm={6}> 
                                            <CFormCheck 
                                              type="radio"
                                              id="flexRadioDefault2" 
                                              name="flexRadioDefault"
                                              label="Номер"
                                              checked={!showNameProject}
                                              onChange={onChangeProjectNumber}
                                            />
                                          </CCol>
                                          <CCol sm={6} style={{display: 'flex', justifyContent: 'flex-end'}}> 
                                            <CFormCheck 
                                              type="radio"
                                              id="flexRadioDefault1" 
                                              name="flexRadioDefault"
                                              label="Название"
                                              checked={showNameProject}
                                              onChange={onChangeProjectName}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Список проектов по имени */}
                                        <CFormSelect 
                                          aria-label="Default select example"
                                          style={{display: showNameProject ? "block" : "none" }}
                                          onChange={onChangeSelectProject}
                                          options={contacts}
                                          value={valueProject}
                                        />
                                        

                                        {/* Список проектов по id */}
                                        <CFormSelect 
                                          aria-label="Default select example"
                                          style={{display: !showNameProject ? "block" : "none" }}
                                          onChange={onChangeSelectProject}
                                          options={contacts2}
                                          value={valueProject}
                                        />

                                        {/* <br/> */}
                                        

                                        {loader ? 
                                        <>
                                          <br/>
                                          <div style={{position: 'relative'}}>
                                            <div style={{position: 'absolute', top: '-10px', left: '45%'}}>
                                              <CSpinner/>
                                            </div>
                                          </div> 
                                        </>
                                        : <br/>
                                        }
                                        
                                        {/* Категория 1 */}
                                        <CRow>
                                          <CCol sm={12} > 
                                            <CFormLabel htmlFor="exampleFormControlInput1">Категория:</CFormLabel>
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory}
                                              options={categories}
                                              value={valueSelect}
                                            /> 
                                          </CCol> 
                                        </CRow>
                                        
                                        {/* Категория 2 */}
                                        <CRow>
                                          <CCol sm={12} style={{display: 'flex'}}>  
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory2}
                                              value={valueSelect2}
                                              options={categories}
                                              style={{marginTop: '15px', display: showCategories2 ? "block" : "none"}}
                                            />
                                            <CIcon 
                                              icon={cilX} 
                                              size="xl" 
                                              style={{marginTop: '20px', marginLeft: '15px', marginRight: '12px', display: showCategories2 ? "block" : "none"}} 
                                              onClick={()=>delCategory2(valueSelect2)}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Категория 3 */}
                                        <CRow>
                                          <CCol sm={12} style={{display: 'flex'}}>  
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory3}
                                              value={valueSelect3}
                                              options={categories}
                                              style={{marginTop: '15px', display: showCategories3 ? "block" : "none"}}
                                            />
                                            <CIcon 
                                              icon={cilX} 
                                              size="xl" 
                                              style={{marginTop: '20px', marginLeft: '15px', marginRight: '12px', display: showCategories3 ? "block" : "none"}} 
                                              onClick={()=>delCategory3(valueSelect3)}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Категория 4 */}
                                        <CRow>
                                          <CCol sm={12} style={{display: 'flex'}}>
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory4}
                                              value={valueSelect4}
                                              options={categories}
                                              style={{marginTop: '15px', display: showCategories4 ? "block" : "none"}}
                                            />
                                            <CIcon 
                                              icon={cilX} 
                                              size="xl" 
                                              style={{marginTop: '20px', marginLeft: '15px', marginRight: '12px', display: showCategories4 ? "block" : "none"}} 
                                              onClick={()=>delCategory4(valueSelect4)}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Категория 5 */}
                                        <CRow>
                                          <CCol sm={12} style={{display: 'flex'}}>
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory5}
                                              value={valueSelect5}
                                              options={categories}
                                              style={{marginTop: '15px', display: showCategories5 ? "block" : "none"}}
                                            />
                                            <CIcon 
                                              icon={cilX} 
                                              size="xl" 
                                              style={{marginTop: '20px', marginLeft: '15px', marginRight: '12px', display: showCategories5 ? "block" : "none"}} 
                                              onClick={()=>delCategory5(valueSelect5)}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Категория 6 */}
                                        <CRow>
                                          <CCol sm={12} style={{display: 'flex'}}>
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory6}
                                              value={valueSelect6}
                                              options={categories}
                                              style={{marginTop: '15px', display: showCategories6 ? "block" : "none"}}
                                            />
                                            <CIcon 
                                              icon={cilX} 
                                              size="xl" 
                                              style={{marginTop: '20px', marginLeft: '15px', marginRight: '12px', display: showCategories6 ? "block" : "none"}} 
                                              onClick={()=>delCategory6(valueSelect6)}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Категория 7 */}
                                        <CRow>
                                          <CCol sm={12} style={{display: 'flex'}}>
                                            <CFormSelect 
                                              aria-label="Default select example"
                                              onChange={onAddCategory7}
                                              value={valueSelect7}
                                              options={categories}
                                              style={{marginTop: '15px', display: showCategories7 ? "block" : "none"}}
                                            />
                                            <CIcon 
                                              icon={cilX} 
                                              size="xl" 
                                              style={{marginTop: '20px', marginLeft: '15px', marginRight: '12px', display: showCategories7 ? "block" : "none"}} 
                                              onClick={()=>delCategory7(valueSelect7)}
                                            />
                                          </CCol>
                                        </CRow>

                                        {/* Добавить */}
                                        <CRow>
                                          <CCol sm={12} style={{textAlign: 'end', marginTop: '15px', paddingRight: '23px'}}> 
                                            <img 
                                              src={treug} 
                                              alt='' 
                                              width='20px' 
                                              onClick={onAddCategory0}
                                            />
                                          </CCol>
                                        </CRow>
                                        
                                        <p style={{color: '#767676', marginTop: '-20px'}}>Получателей: <span>{selected.length}</span></p>  
                                        
                                      </CCol>

                                      {/* <CCol sm={1}></CCol> */}

                                      {/* Правый блок */}
                                      <CCol sm={6} style={{paddingLeft: '30px', paddingRight: '30px'}}>
                                          <CFormLabel htmlFor="exampleFormControlInput1">Текст рассылки:</CFormLabel>
                                          <CFormTextarea 
                                            id="exampleFormControlTextarea1" 
                                            rows={4} 
                                            placeholder='Введите текст сообщения'
                                            onChange={onChangeText}
                                            value={text}
                                            // helperText = {`${countChar}/500`}
                                          >  
                                            <CSpinner style={{width: '20px', height: '20px'}}/>         
                                          </CFormTextarea>

                                          <br/>

                                        <CRow className="mb-6">
                                            <CCol sm={3} > 
                                              <CFormSelect 
                                                aria-label="Default select example"
                                                style={{marginTop: '10px'}}
                                                options={[
                                                  {
                                                    label: 'Постер',
                                                    value: '1',
                                                  },
                                                  {
                                                    label: 'Файл',
                                                    value: '2',
                                                  },
                                                  {
                                                    label: 'Аудио',
                                                    value: '3',
                                                  },
                                                  {
                                                    label: 'Видео',
                                                    value: '4',
                                                  },
          
                                                ]}
                                              />
                                            </CCol>

                                            <CCol sm={9} > 
                                              {/* Добавление картинки */}
                                              <div style={{color: '#8f8888', marginTop: '10px'}}>
                                                <CFormInput 
                                                  type="file" 
                                                  id="formFile" 
                                                  accept="image/*,image/jpeg"
                                                  // label="Добавить картинку" 
                                                  name="photo"
                                                  onChange={(e) => onFileChange(e)}
                                                  //value={value}
                                                />

                                                {/* <form>
                                                  <label htmlFor="formFile" className="custom-file-upload">
                                                    Выберите файл
                                                  </label> 
                                                  <input 
                                                    type="file"
                                                    id="formFile" 
                                                    accept="image/*,image/jpeg" 
                                                    name="photo"
                                                    onChange={(e) => onFileChange(e)}
                                                    value={value}
                                                  /> 
                                                  <span className="input-file-text" type="text">{value}</span>
                                                </form> */}
                                              </div>
                                            </CCol>

                                          </CRow>

                                          <div className="mb-3"></div>

                                          {/* Ряд кнопок */}
                                          <CRow className="mb-6">
                                            <CCol sm={4} style={{fontSize: '13px'}}> 
                                              <CFormCheck 
                                                type="radio"
                                                id="addButtonRadio" 
                                                name="groupRadioButton"
                                                label="Добавить кнопку"
                                                checked={showEditButtonAdd}
                                                onChange={onChangeAddButton}
                                              />
                                              {/* <div className="mb-3 text-left">
                                                <p style={{color: '#fff', cursor: 'pointer'}} onClick={clickShowEditButton} > {showEditButtonAdd ? '- Убрать кнопку' : '+ Добавить кнопку'}</p>
                                              </div> */}

                                            </CCol>

                                          <CCol sm={4} style={{display: 'flex', justifyContent: 'flex-start', fontSize: '13px'}}> 
                                            <CFormCheck 
                                              type="radio"
                                              id="appleButtonRadio" 
                                              name="groupRadioButton"
                                              label="Принять / Отклонить"
                                              checked={!showEditButtonAdd}
                                              onChange={onChangeAddButton2}
                                              //defaultChecked
                                            /> 
  
                                          </CCol>

                                          <CCol sm={4} style={{display: 'flex', justifyContent: 'flex-end', fontSize: '13px'}}>
                                            <CFormCheck 
                                              id="flexCheckDefault" 
                                              label="Альтернативная ставка"
                                              onChange={onChangeCheckButton}
                                              checked={stavka2}
                                            />
                                          </CCol>
                                        </CRow>

                                        <br/>
                                        <div style={{color: '#8f8888', visibility: showEditButtonAdd ? "visible" : "hidden" }}>
                                        <CRow className="mb-6" >
                                          
                                          {/* Раскрывающийся ряд */}
                                          {/* Добавление кнопки */}
                                          <CCol sm={6} > 
                                            {/* <CForm className="row g-3" style={{color: '#8f8888', display: showEditButtonAdd ? "block" : "none" }}>                                              */}
                                              <CFormInput 
                                                type="text" 
                                                id="inputTextButton" 
                                                label="Название кнопки" 
                                                placeholder="Введите текст"
                                                onChange={onChangeTextButton}
                                                value={textButton}
                                              />
                                            {/* </CForm> */}
                                          </CCol>
                                        </CRow>

                                          <CRow>
                                            <br/>
                                          </CRow>

                                          <CRow className="mb-6">
                                            <CCol sm={6} >         
                                              {/* Цепь */}
                                              <CFormCheck 
                                                type="radio"
                                                id="addTargetRadio" 
                                                name="groupRadioTarget"
                                                label="Цепь №"              
                                                checked={!showCheckTarget}
                                                onChange={onChangeCheckTarget}
                                              />
                                              
                                              <CFormSelect 
                                                aria-label="Default select example"
                                                style={{marginTop: '10px'}}
                                                options={[]}
                                              />
                                            </CCol>

                                            <CCol sm={6} > 
                                              {/* Ссылка */}
                                              <CFormCheck 
                                                type="radio"
                                                id="addURLRadio" 
                                                name="groupRadioTarget"
                                                label="Ссылка"  
                                                checked={showCheckTarget}
                                                onChange={onChangeCheckTarget}
                                              />

                                              <CFormInput 
                                                type="text" 
                                                id="inputTextButton" 
                                                placeholder="https://"
                                                style={{marginTop: '10px'}}
                                                onChange={onChangeTextUrl}
                                                value={target}
                                              />
                                            </CCol>
                                            
                                          </CRow>
                                        </div>
                                      </CCol>

                                      {/* <CCol sm={1}></CCol> */}

                                      {/* Телефон */}
                                      <CCol sm={3}>   
                                        <div style={{position: 'relative'}}>
                                          <div style={{position: 'absolute', top: '10px', left: 0}}>
                                            <img src={phone_image} width='280px' height='615px' alt='phone' />
                                            <div style={{position: 'absolute', top: '60px', left: '22px'}}>
                                            {
                                              filePreview
                                              ? <img src={filePreview} width='240px' alt='poster' style={{borderRadius: '7px'}}/>
                                              : <img src={noimage2} width='240px' alt='poster' style={{borderRadius: '7px'}}/>
                                            }
                                            </div>
                                            {
                                            !showEditButtonAdd ?
                                            
                                            <><div style={{position: 'absolute', top: '225px', left: '22px', display: 'flex', width: '85%'}}>
                                              <div style={{
                                                backgroundColor: '#8a93a2', 
                                                borderRadius: '5px',
                                                textAlign: 'center',
                                                fontSize: '12px',
                                                padding: '5px',
                                                marginRight: '4px',
                                                width: '100%'}}>
                                                  Принять
                                              </div>
                                              <div style={{
                                                backgroundColor: '#8a93a2', 
                                                borderRadius: '5px',
                                                textAlign: 'center',
                                                fontSize: '12px',
                                                padding: '5px',
                                                width: '100%'}}>
                                                  Отклонить
                                              </div>
                                            </div> 
                                            {onButtonStavka && <div style={{position: 'absolute', top: '258px', left: '22px', display: 'flex', width: '85%'}}>
                                              <div style={{
                                                backgroundColor: '#8a93a2', 
                                                borderRadius: '5px',
                                                textAlign: 'center',
                                                fontSize: '12px',
                                                padding: '5px',
                                                width: '100%'}}>
                                                  Альтернативная ставка
                                              </div>
                                            </div> }
                                            </>                                      
                                            :<div style={{position: 'absolute', top: '225px', left: '22px', display: 'flex', width: '85%'}}>
                                              <div style={{
                                                backgroundColor: '#8a93a2', 
                                                borderRadius: '5px',
                                                textAlign: 'center',
                                                fontSize: '12px',
                                                padding: '5px',
                                                width: '100%'}}>
                                                  {textButton}
                                              </div>
                                            </div>
                                          } 
                                                                                  
                                          </div>                                                                             
                                        </div>
                                        
                                      </CCol>
          
                                    </CRow>

                                  </div>

                                  <br/>

                                  <CRow>
                                    <CCol sm={9} style={{position: 'absolute', top: '600px'}}>
                                      <div className="mb-3" style={{
                                        display: 'flex', 
                                        width: '100%', 
                                        justifyContent: 'space-between'
                                      }}>
                                        <div>
                                          {planShow ? 
                                            <CButton color="success" onClick={()=>onPlanerShow(labelName.label, proj, text, distribId, categoryAll, selected.length, datestart, poster, uuidDistrib)}>
                                              Запланировать
                                            </CButton>
                                            :<Link to={''} state={{ project: `${proj}`, }}>
                                              <CButton color="secondary">
                                                {showUpload ? <CSpinner style={{width: '20px', height: '20px'}}/> : 'Запланировать'}
                                                </CButton>
                                            </Link>
                                          }             
                                        </div>
                                        <div>
                                          {(editDistrib && delivered) ? 
                                            <CButton color="danger" onClick={()=>onDeleteMessages(distribId)}>
                                              Удалить
                                            </CButton>
                                          :<></>
                                          }             
                                        </div>
                                        <div>
                                          {delivered ? <CButton color="primary" onClick={onSendText}>Разослать сейчас</CButton>
                                          :<CButton color="primary" onClick={onSaveText}>Сохранить</CButton>}
                                          
                                          {/* <CButton onClick={() => setVisible(!visible)}>Vertically centered modal</CButton> */}
                                          
                                          <CModal alignment="center" visible={visibleModal} onClose={() => setVisibleModal(false)}>
                                            <CModalHeader>
                                              <CModalTitle>Предупреждение</CModalTitle>
                                            </CModalHeader>
                                            <CModalBody>
                                              Чтобы создать рассылку необходимо выбрать проект и добавить категории получателей!
                                            </CModalBody>
                                            <CModalFooter>
                                              <CButton color="primary" onClick={() => setVisibleModal(false)}>ОК</CButton>
                                            </CModalFooter>
                                          </CModal>
                                        </div>
                                      </div>
                                    </CCol>
                                    <CCol sm={3}></CCol>
                                  </CRow>
                                  

                                </CForm>

                              </CCardBody>
                            </CCard>
                          </CCol>
                      </CRow>
                    </>}
                  </>
                </Suspense>
            </CContainer>

        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DistributionEditR