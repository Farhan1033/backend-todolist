import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
    {
        _id: {  // Definisikan _id secara eksplisit
            type: String
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true
        },
        completed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true  // Perbaiki typo - huruf kecil semua
    }
)

// Pre-save hook untuk membuat ID kustom
taskSchema.pre('save', async function (next){
    if (this.isNew && !this._id){
        const count = await mongoose.model('Task').countDocuments();
        this._id = `T0${count + 1}`;  // Gunakan _id, bukan id
    }
    next()
})

const Task = mongoose.model('Task', taskSchema)
export default Task