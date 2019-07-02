import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const lessonSchema = new Schema({
    title: {
        type: String,
        required: true
    }
});

export default mongoose.model('Lesson', lessonSchema);