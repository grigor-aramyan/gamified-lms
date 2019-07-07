import mongoose from 'mongoose';

// Schemas
import OngoingSchema from './OngoingSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const courseOngoingSchema = new Schema({
    courseId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    completionPoints: {
        type: Map,
        of: Number
    }
}, options);

export default OngoingSchema.discriminator('CourseOngoing', courseOngoingSchema);