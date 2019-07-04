import mongoose from 'mongoose';

// Schemas
import UserSchema from './UserSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const teacherSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    lessons: {
        type: Array,
        of: mongoose.Types.ObjectId
    },
    courses: {
        type: Array,
        of: mongoose.Types.ObjectId
    }
}, options);

export default UserSchema.discriminator('Teacher', teacherSchema);