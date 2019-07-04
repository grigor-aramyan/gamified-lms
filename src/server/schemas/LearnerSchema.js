import mongoose from 'mongoose';

// Schemas
import UserSchema from './UserSchema';

const Schema = mongoose.Schema;
const options = { discriminatorKey: 'kind' };

const learnerSchema = new Schema({
    points: {
        type: Number,
        default: 0
    }
}, options);

export default UserSchema.discriminator('Learner', learnerSchema);