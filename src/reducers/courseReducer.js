import {
    COURSE_CREATED_SUCCESS,
    COURSE_CREATED_FAIL,
    COURSES_GET_SUCCESS,
    COURSES_GET_FAIL,
    COURSE_UPDATE_SUCCESS,
    COURSE_UPDATE_FAIL,
    COURSE_DELETE_SUCCESS,
    COURSE_DELETE_FAIL
} from './types';

const initialState = {
    currentCourse: null,
    allCourses: []
};

export default function(state = initialState, action) {
    switch(action.type) {
        case COURSE_UPDATE_SUCCESS:
            return {
                ...state
            };
        case COURSE_DELETE_SUCCESS:
            const deletedCourseId = action.payload.id;
            const filteredCourses = state.allCourses.filter(l => {
                if (l.id.toString() !== deletedCourseId.toString()) {
                    return true;
                } else {
                    return false;
                }
            });
            return {
                ...state,
                allCourses: filteredCourses
            };
        case COURSES_GET_SUCCESS:
            return {
                ...state,
                allCourses: action.payload.courses
            };
        case COURSE_UPDATE_FAIL:
        case COURSE_DELETE_FAIL:
        case COURSES_GET_FAIL:
        case COURSE_CREATED_FAIL:
            return state;
        case COURSE_CREATED_SUCCESS:
            return {
                ...state,
                allCourses: state.allCourses.unshift(action.payload)
            };
        default:
            return state;
    }
}