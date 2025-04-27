import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
    try {
        const task = await Task.find({})
        res.json(task)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const createdTask = async (req, res) => {
    try {
        const { title, completed } = req.body

        if (!title) {
            return res.status(400).json({ message: "Title is required" })
        }

        const newTask = await Task.create({
            title,
            completed: completed || false
        })

        res.status(201).json(newTask)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deletedTask = async (req, res) => {
    try {
        const taskId = Task.findById(req.params.id)

        if(!taskId) {
            return res.status(404).json({ message: "Task not found" })
        }

        await taskId.deleteOne();
        res.status(200).json({ message: "Task deleted successfully" })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const deletedAllTask = async (req, res) => {
    try {
        await Task.deleteMany({})
        res.status(200).json({ message: "All tasks deleted successfully" }) 
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}