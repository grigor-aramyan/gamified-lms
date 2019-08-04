import {
    LESSON_ONGOING_CREATED_SUCCESS,
    LESSON_ONGOING_CREATED_FAIL,
    LESSON_ONGOINGS_GET_SUCCESS,
    LESSON_ONGOINGS_GET_FAIL,
    LESSON_ONGOING_UPDATE_SUCCESS,
    LESSON_ONGOING_UPDATE_FAIL,
    LESSON_ONGOING_DELETE_SUCCESS,
    LESSON_ONGOING_DELETE_FAIL,
    LESSON_ONGOING_GET_LESSON_BY_LO_ID
} from '../actions/types';

const initialState = {
    currentLessonOngoing: null,
    allLessonOngoings: [],
    lessonForSelectedOngoing: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LESSON_ONGOING_GET_LESSON_BY_LO_ID:
            return {
                ...state,
                lessonForSelectedOngoing: action.payload
            };
        case LESSON_ONGOING_UPDATE_SUCCESS:
            return {
                ...state
            };
        case LESSON_ONGOING_DELETE_SUCCESS:
            const deletedLessonOngoingId = action.payload.id;
            const filteredLessonOngoings = state.allLessonOngoings.filter(l => {
                if (l.id.toString() !== deletedLessonOngoingId.toString()) {
                    return true;
                } else {
                    return false;
                }
            });
            return {
                ...state,
                allLessonOngoings: filteredLessonOngoings
            };
        case LESSON_ONGOINGS_GET_SUCCESS:
            return {
                ...state,
                allLessonOngoings: action.payload.lesson_ongoings
            };
        case LESSON_ONGOING_UPDATE_FAIL:
        case LESSON_ONGOING_DELETE_FAIL:
        case LESSON_ONGOINGS_GET_FAIL:
        case LESSON_ONGOING_CREATED_FAIL:
            return state;
        case LESSON_ONGOING_CREATED_SUCCESS:
            const data = [...state.allLessonOngoings];
            data.unshift(action.payload.lesson_ongoing);

            return {
                ...state,
                allLessonOngoings: data
            };
        default:
            return state;
    }
}