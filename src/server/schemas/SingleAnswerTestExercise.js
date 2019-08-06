import mongoose from 'mongoose';

// Schemas
import ExerciseSchema from './ExerciseSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const singleAnswerTestExercise = new Schema({
    answers: {
        type: Array,
        of: String,
        default: undefined
    },
    rightAnswerIndex: {
        type: Number,
        required: true
    }
}, options);

export default ExerciseSchema.discriminator('SingleAnswerTestExercise', singleAnswerTestExercise);