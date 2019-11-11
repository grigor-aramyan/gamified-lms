import {
    CREATE_MANY_AUDIO_EXERCISES,
    GET_AUDIO_EXERCISES_BY_LESSON_ID,
    GET_AUDIO_EXERCISES_INITIATE,
    LESSON_FOR_TEACHER_UPDATE_AQ_BASE
} from '../actions/types';

const initialState = {
    allAQExercisesForCurrentLesson: [],
    gettingAQExercises: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LESSON_FOR_TEACHER_UPDATE_AQ_BASE:
            return{
                ...state,
                allAQExercisesForCurrentLesson: action.payload
            };
        case GET_AUDIO_EXERCISES_INITIATE:
            return{
                ...state,
                gettingAQExercises: true
            };
        case CREATE_MANY_AUDIO_EXERCISES:
            return{
                ...state
            };
        case GET_AUDIO_EXERCISES_BY_LESSON_ID:
            return{
                ...state,
                allAQExercisesForCurrentLesson: action.payload,
                gettingAQExercises: false
            };
        default:
            return state;
    }
}