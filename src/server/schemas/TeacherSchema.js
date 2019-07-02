import mongoose from 'mongoose';

// Schemas
import UserSchema from './UserSchema';

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' };

const TeacherSchema = new Schema({
    subject: {
        type: String,
        required: true
    }
}, options);

export default UserSchema.discriminator('Teacher', TeacherSchema);