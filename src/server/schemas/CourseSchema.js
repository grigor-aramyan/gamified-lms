import mongoose, { ObjectId } from 'mongoose';

// Schema
import LessonSchema from './LessonSchema';

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    lessons: {
        type: Array,
        of: LessonSchema,
        default: undefined
    }
});

export default mongoose.model('Course', courseSchema);