import {
    COURSE_CREATED_SUCCESS,
    COURSE_CREATED_FAIL,
    COURSES_GET_SUCCESS,
    COURSES_GET_FAIL,
    COURSE_UPDATE_SUCCESS,
    COURSE_UPDATE_FAIL,
    COURSE_DELETE_SUCCESS,
    COURSE_DELETE_FAIL,
    COURSES_GET_BY_IDS,
    COURSES_GET_BY_IDS_INITIATED,
    COURSE_GET_BY_ID
} from '../actions/types';

const initialState = {
    currentCourse: null,
    allCourses: [],
    extendedCoursesByIds: null,
    fetchingExtendedCourses: false,
    currentCourseForTeacher: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case COURSE_GET_BY_ID:
            return {
                ...state,
                currentCourseForTeacher: action.payload
            }
        case COURSES_GET_BY_IDS:
            return {
                ...state,
                extendedCoursesByIds: action.payload,
                fetchingExtendedCourses: false
            }
        case COURSES_GET_BY_IDS_INITIATED:
            return {
                ...state,
                fetchingExtendedCourses: true
            }
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
            const data = [...state.allCourses];
            data.unshift(action.payload)
            return {
                ...state,
                allCourses: data
            };
        default:
            return state;
    }
}