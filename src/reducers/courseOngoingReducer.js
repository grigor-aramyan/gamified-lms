import {
    COURSE_ONGOING_CREATED_SUCCESS,
    COURSE_ONGOING_CREATED_FAIL,
    COURSE_ONGOINGS_GET_SUCCESS,
    COURSE_ONGOINGS_GET_FAIL,
    COURSE_ONGOING_UPDATE_SUCCESS,
    COURSE_ONGOING_UPDATE_FAIL,
    COURSE_ONGOING_DELETE_SUCCESS,
    COURSE_ONGOING_DELETE_FAIL,
    COURSE_ONGOING_GET_COURSE_BY_CO_ID,
    COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID,
    COURSE_ONGOING_UPDATE_COMPLETION_POINTS_OF_EXTENDED_COURSE_BY_CO_ID
} from '../actions/types';

const initialState = {
    currentCourseOngoing: null,
    allCourseOngoings: [],
    courseForSelectedOngoing: null,
    extendedCourseForSelectedOngoing: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case COURSE_ONGOING_UPDATE_COMPLETION_POINTS_OF_EXTENDED_COURSE_BY_CO_ID:
        case COURSE_ONGOING_GET_EXTENDED_COURSE_BY_CO_ID:
            return {
                ...state,
                extendedCourseForSelectedOngoing: action.payload
            };
        case COURSE_ONGOING_GET_COURSE_BY_CO_ID:
            return {
                ...state,
                courseForSelectedOngoing: action.payload
            };
        case COURSE_ONGOING_UPDATE_SUCCESS:
            return {
                ...state
            };
        case COURSE_ONGOING_DELETE_SUCCESS:
            const deletedCourseOngoingId = action.payload.id;
            const filteredCourseOngoings = state.allCourseOngoings.filter(l => {
                if (l.id.toString() !== deletedCourseOngoingId.toString()) {
                    return true;
                } else {
                    return false;
                }
            });
            return {
                ...state,
                allCourseOngoings: filteredCourseOngoings
            };
        case COURSE_ONGOINGS_GET_SUCCESS:
            return {
                ...state,
                allCourseOngoings: action.payload.course_ongoings
            };
        case COURSE_ONGOING_UPDATE_FAIL:
        case COURSE_ONGOING_DELETE_FAIL:
        case COURSE_ONGOINGS_GET_FAIL:
        case COURSE_ONGOING_CREATED_FAIL:
            return state;
        case COURSE_ONGOING_CREATED_SUCCESS:
            const data = [...state.allCourseOngoings];
            data.unshift(action.payload.course_ongoing);

            return {
                ...state,
                allCourseOngoings: data
            };
        default:
            return state;
    }
}