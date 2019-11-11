import { combineReducers } from 'redux';

import authReducer from './authReducer';
import errorReducer from './errorReducer';
import lessonReducer from './lessonReducer';
import courseReducer from './courseReducer';
import lessonOngoingReducer from './lessonOngoingReducer';
import courseOngoingReducer from './courseOngoingReducer';
import learnerReducer from './learnerReducer';
import teacherReducer from './teacherReducer';
import exerciseReducer from './exerciseReducer';
import audioExerciseReducer from './audioExerciseReducer';

export default combineReducers({
    auth: authReducer,
    error: errorReducer,
    lesson: lessonReducer,
    course: courseReducer,
    lessonOngoing: lessonOngoingReducer,
    courseOngoing: courseOngoingReducer,
    learner: learnerReducer,
    teacher: teacherReducer,
    exercise: exerciseReducer,
    audioExercise: audioExerciseReducer
});