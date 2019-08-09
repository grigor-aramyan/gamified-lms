import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const singleAnswerTestExerciseSchema = new Schema({
    answers: {
        type: Array,
        of: String,
        default: undefined
    },
    rightAnswerIndex: {
        type: Number,
        required: true
    },
    lessonId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    question: {
        type: String,
        required: true
    }
});

export default mongoose.model('SingleAnswerTestExercise', singleAnswerTestExerciseSchema);