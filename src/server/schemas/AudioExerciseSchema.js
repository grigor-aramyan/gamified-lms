import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const audioExerciseSchema = new Schema({
    answerImages: {
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
    audioQuestion: {
        type: String,
        required: true
    }
});

export default mongoose.model('AudioExercise', audioExerciseSchema);