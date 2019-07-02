import mongoose, { ObjectId } from 'mongoose';

const Schema = mongoose.Schema;

const courseSchema = new Schema({
    lessons: {
        type: Array,
        of: ObjectId,
        required: true
        // TODO: check for inability to create course with empty lessons array
    }
});

export default mongoose.model('Course', courseSchema);