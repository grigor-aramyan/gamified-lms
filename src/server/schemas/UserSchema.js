import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' };

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registration_date: {
        type: Date,
        required: true,
        default: Date.now
    }
}, options);

export default mongoose.model('User', userSchema);