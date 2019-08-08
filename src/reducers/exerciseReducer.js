import {
    CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES,
    GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID,
    GET_SAT_EXERCISES_INITIATE
} from '../actions/types';

const initialState = {
    allSATExercisesForCurrentLesson: [],
    gettingSATExercises: false
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_SAT_EXERCISES_INITIATE:
            return{
                ...state,
                gettingSATExercises: true
            };
        case CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES:
            return{
                ...state
            };
        case GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID:
            return{
                ...state,
                allSATExercisesForCurrentLesson: action.payload,
                gettingSATExercises: false
            };
        default:
            return state;
    }
}