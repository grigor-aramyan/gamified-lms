import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' };

const mainContentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    price: {
        type: Number,
        default: 0
    }
}, options);

export default mongoose.model('MainContent', mainContentSchema);