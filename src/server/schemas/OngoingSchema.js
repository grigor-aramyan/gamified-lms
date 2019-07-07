import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const options = { discriminatorKey: 'kind' };

const ongoingSchema = new Schema({
    learnerId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
}, options);

export default mongoose.model('Ongoing', ongoingSchema);