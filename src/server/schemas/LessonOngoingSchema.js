import mongoose from 'mongoose';

// Schemas
import OngoingSchema from './OngoingSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const lessonOngoingSchema = new Schema({
    lessonId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    completionPoint: {
        type: Number,
        default: 0
    }
}, options);

export default OngoingSchema.discriminator('LessonOngoing', lessonOngoingSchema);