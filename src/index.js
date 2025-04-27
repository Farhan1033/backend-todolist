import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import fs from 'fs/promises'

const app = express()
app.use(bodyParser.json())
app.use(cors())

const PORT = process.env.PORT || 3000
const DATA_FILE = 'src/task.json'

// Helper functions
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(data)
    } catch (err) {
        return []
    }
}

async function saveData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2))
}

async function deleteData() {
    try {
        await fs.unlink(DATA_FILE)
        return true
    }
    catch (err) {
        console.error('Error deleting file:', err)
        return false
    }
}

// Routes
app.get('/tasks', async (req, res) => {
    const tasks = await readData()
    res.json(tasks)
})

app.post('/tasks', async (req, res) => {
    const tasks = await readData()

    let maxId = 0
    tasks.forEach(tasks => {
        const num = parseInt(tasks.id.replace('T0', ''))
        if (num > maxId) {
            maxId = num
        }
    });

    const newId = `T0${maxId + 1}`

    const newTask = {
        id: newId,
        title: req.body.title,
        completed: req.body.completed || false,
        createdAt: new Date().toISOString()
    };


    tasks.push(newTask)
    await saveData(tasks)
    res.status(201).json(newTask)
})

app.put('/tasks/:id', async (req, res) => {
    try {
        const tasks = await readData()
        const taskIndex = tasks.findIndex(t => t.id.toString() === req.params.id.toString())
        if (taskIndex === -1) {
            return res.status(404).send('Task not found')
        }

        const updateTask = {
            ...tasks[taskIndex],
            ...req.body,
            id: tasks[taskIndex].id
        }

        tasks[taskIndex] = updateTask
        await saveData(tasks)
        res.json(updateTask)
    } catch (error) {
        res.status(500).send('Error updating task')
    }
})

app.delete('/tasks/delete/:id', async (req, res) => {
    try {
        const tasks = await readData()
        const intialLength = tasks.length

        const updateTask = tasks.filter(t => t.id.toString() !== req.params.id.toString())

        if (updateTask.length === intialLength) {
            return res.status(404).send('Task not found')
        }

        await saveData(updateTask)
        res.status(200).send('Task deleted successfully')
    }
    catch {
        res.status(500).send('Error deleting task')
    }
})

app.delete('/tasks/delete-all', async (req, res) => {
    try {
        const successfully = await deleteData()
        if (successfully) {
            res.status(204).send('All tasks deleted successfully')
        }
        else {
            res.status(500).send('Error deleting tasks')
        }
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})