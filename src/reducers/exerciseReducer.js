import {
    CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES,
    GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID
} from '../actions/types';

const initialState = {
    allSATExercisesForCurrentLesson: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES:
            return{
                ...state
            };
        case GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID:
            return{
                ...state,
                allSATExercisesForCurrentLesson: action.payload
            };
        default:
            return{
                ...state
            };
    }
}