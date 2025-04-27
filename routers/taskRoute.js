import express from "express";
import {
    getTasks,
    createdTask,
    deletedTask,
    deletedAllTask
} from "../controllers/taskController.js"

const router = express.Router()

router.route('/api/v1/').get(getTasks)

router.route('/api/v1/add-task').post(createdTask)

// router.route('/api/v1/update-task').put(updatedTask)

router.route('/api/v1/delete/:id').delete(deletedTask)

router.route('/api/v1/delete-all').delete(deletedAllTask)

export default router