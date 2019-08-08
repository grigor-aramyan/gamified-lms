import mongoose from 'mongoose';

// Schemas
import ExerciseSchema from './ExerciseSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const singleAnswerTestExerciseSchema = new Schema({
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

export default ExerciseSchema.discriminator('SingleAnswerTestExercise', singleAnswerTestExerciseSchema);