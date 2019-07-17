import {
    COURSE_ONGOING_CREATED_SUCCESS,
    COURSE_ONGOING_CREATED_FAIL,
    COURSE_ONGOINGS_GET_SUCCESS,
    COURSE_ONGOINGS_GET_FAIL,
    COURSE_ONGOING_UPDATE_SUCCESS,
    COURSE_ONGOING_UPDATE_FAIL,
    COURSE_ONGOING_DELETE_SUCCESS,
    COURSE_ONGOING_DELETE_FAIL
} from '../actions/types';

const initialState = {
    currentCourseOngoing: null,
    allCourseOngoings: []
};

export default function(state = initialState, action) {
    switch(action.type) {
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
            return {
                ...state,
                allCourseOngoings: state.allCourseOngoings.unshift(action.payload.course_ongoing)
            };
        default:
            return state;
    }
}