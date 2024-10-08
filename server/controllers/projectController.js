const ApiError = require('../error/ApiError')
const {ProjectNew, Project} = require('../models/models');

class ProjectController {

    async getProjects(req, res) {
        try {
            const projects = await Project.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getProjectsId(req, res) {
        const {id} = req.params
        try {
            const projects = await Project.findAll({where: {projectId: id}})
            return res.status(200).json(projects);
        } catch (err) {
            return res.status(500).json(err);
        }
    }

    async getProjectNew(req, res) {
        try {
            const projects = await ProjectNew.findAll({
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getProjectNewId(req, res) {
        const {id} = req.params
        try {
            const projects = await ProjectNew.findOne({
                where: {id},
                order: [
                    ['id', 'DESC'],
                ],
            })
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }



    async getProjectNewCreate(req, res) {
        const {id, name, datestart, crmID} = req.body
        try {
            const projects = await ProjectNew.create({ 
                id: id, 
                name: name, 
                datestart: datestart, 
                crmID: crmID, 
            })
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getProjectNewUpdate(req, res) {
        const {id, name} = req.body
        try {
            const projects = await ProjectNew.update(
                {
                    name: name
                },
                {
                    where: {id: id}
                }
            )
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }

    async getProjectNewDel(req, res) {
        const {id} = req.body
        try {
            const projects = await ProjectNew.destroy({
                where: {
                    id: id,
                }
            })
            return res.status(200).json(projects);
        } catch (error) {
            return res.status(500).json(error.message);
        }
    }
}

module.exports = new ProjectController()