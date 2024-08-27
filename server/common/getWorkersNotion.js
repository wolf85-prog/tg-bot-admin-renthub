//notion api
require("dotenv").config();
const { Client } = require("@notionhq/client");
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseWorkerId = process.env.NOTION_DATABASE_WORKERS_ID
const databaseManagerId = process.env.NOTION_DATABASE_MANAGER_ID

//получить id блока заданной страницы по id
module.exports = async function getWorkersNotion() {
    try {

        let results = []

        let data = await notion.databases.query({
            database_id: databaseManagerId
        });

        results = [...data.results]

        while(data.has_more) {
            data = await notion.databases.query({
                database_id: databaseManagerId,
                start_cursor: data.next_cursor,
            }); 

            results = [...results, ...data.results];
        }

        const managers = results.map((manager) => {
            return {
               id: manager.id,
               fio: manager.properties["ФИО"].title[0]?.plain_text,
               tgID: manager.properties.ID.rich_text[0]?.plain_text,
               phone: manager.properties["Телефон"].phone_number,
               comment: manager.properties["Комментарий"].rich_text[0]?.plain_text,  
               profile: worker.properties["Профиль"]?.files[0],                                   
            };
        });

        return managers;
    } catch (error) {
        console.error(error.message)
    }
}