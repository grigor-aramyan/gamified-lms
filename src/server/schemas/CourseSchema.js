import mongoose from 'mongoose';

// Schema
import MainContentSchema from './MainContentSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const courseSchema = new Schema({
    lessons: {
        type: Array,
        of: mongoose.Types.ObjectId,
        default: undefined
    }
}, options);

export default MainContentSchema.discriminator('Course', courseSchema);