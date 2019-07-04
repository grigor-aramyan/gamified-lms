import mongoose from 'mongoose';

// Schemas
import MainContent from './MainContentSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const lessonSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    imageUris: {
        type: Array,
        of: String
    },
    videoUris: {
        type: Array,
        of: String
    }
}, options);

export default MainContent.discriminator('Lesson', lessonSchema);