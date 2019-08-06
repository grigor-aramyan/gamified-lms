import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' };

const exerciseSchema = new Schema({
    lessonId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    question: {
        type: String,
        required: true
    }
}, options);

export default mongoose.model('Exercise', exerciseSchema);