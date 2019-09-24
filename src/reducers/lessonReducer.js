import {
    LESSON_CREATED_SUCCESS,
    LESSON_CREATED_FAIL,
    LESSONS_GET_SUCCESS,
    LESSONS_GET_FAIL,
    LESSON_UPDATE_SUCCESS,
    LESSON_UPDATE_FAIL,
    LESSON_DELETE_SUCCESS,
    LESSON_DELETE_FAIL,
    LESSONS_GET_BY_IDS,
    LESSONS_GET_BY_IDS_INITIATED,
    LESSON_GET_BY_ID,
    LESSON_GET_BY_ID_INITIATED,
    LESSON_FOR_TEACHER_GET_BY_ID
} from '../actions/types';

const initialState = {
    currentLesson: null,
    allLessons: null,
    extendedLessonsByIds: null,
    fetchingExtendedLessons: false,
    extendedLessonById: null,
    currentLessonForTeacher: null
};

export default function(state = initialState, action) {
    switch(action.type) {
        case LESSON_FOR_TEACHER_GET_BY_ID:
            return {
                ...state,
                currentLessonForTeacher: action.payload
            };
        case LESSON_GET_BY_ID:
            return {
                ...state,
                extendedLessonById: action.payload,
                fetchingExtendedLessons: false
            };
        case LESSON_GET_BY_ID_INITIATED:
        case LESSONS_GET_BY_IDS_INITIATED:
            return {
                ...state,
                fetchingExtendedLessons: true
            };
        case LESSONS_GET_BY_IDS:
            return {
                ...state,
                extendedLessonsByIds: action.payload,
                fetchingExtendedLessons: false
            };
        case LESSON_UPDATE_SUCCESS:
            return {
                ...state,
                currentLessonForTeacher: action.payload
            };
        case LESSON_DELETE_SUCCESS:
            const deletedLessonId = action.payload.id;
            const filteredLessons = state.allLessons.filter(l => {
                if (l.id.toString() !== deletedLessonId.toString()) {
                    return true;
                } else {
                    return false;
                }
            });
            return {
                ...state,
                allLessons: filteredLessons
            };
        case LESSONS_GET_SUCCESS:
            return {
                ...state,
                allLessons: action.payload.lessons
            };
        case LESSON_UPDATE_FAIL:
        case LESSON_DELETE_FAIL:
        case LESSONS_GET_FAIL:
        case LESSON_CREATED_FAIL:
            return state;
        case LESSON_CREATED_SUCCESS:
            const lessons = [...state.allLessons];
            lessons.unshift(action.payload);
            return {
                ...state,
                allLessons: lessons
            };
        default:
            return state;
    }
}