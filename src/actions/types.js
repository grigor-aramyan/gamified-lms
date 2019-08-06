// Error types
export const GET_ERRORS = 'GET_ERRORS';
export const CLEAR_ERRORS = 'CLEAR_ERRORS';

// Auth types
export const USER_LOADING = 'USER_LOADING';
export const USER_LOADED = 'USER_LOADED';
export const AUTH_ERROR = 'AUTH_ERROR';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOAD_LOCAL_TOKEN = 'LOAD_LOCAL_TOKEN';
export const SWITCH_TO_TEACHER_LOGIN = 'SWITCH_TO_TEACHER_LOGIN';
export const SWITCH_TO_LEARNER_LOGIN = 'SWITCH_TO_LEARNER_LOGIN';

// Learner types
export const LEARNER_CREATED_SUCCESS = 'LEARNER_CREATED_SUCCESS';
export const LEARNER_CREATED_FAIL = 'LEARNER_CREATED_FAIL';
export const LEARNER_UPDATE_SUCCESS = 'LEARNER_UPDATE_SUCCESS';
export const LEARNER_UPDATE_FAIL = 'LEARNER_UPDATE_FAIL';
export const LEARNER_DELETE_SUCCESS = 'LEARNER_DELETE_SUCCESS';
export const LEARNER_DELETE_FAIL = 'LEARNER_DELETE_FAIL';
export const LEARNERS_GET_SUCCESS = 'LEARNERS_GET_SUCCESS';
export const LEARNERS_GET_FAIL = 'LEARNERS_GET_FAIL';

// Teacher types
export const TEACHER_CREATED_SUCCESS = 'TEACHER_CREATED_SUCCESS';
export const TEACHER_CREATED_FAIL = 'TEACHER_CREATED_FAIL';
export const TEACHER_UPDATE_SUCCESS = 'TEACHER_UPDATE_SUCCESS';
export const TEACHER_UPDATE_FAIL = 'TEACHER_UPDATE_FAIL';
export const TEACHERS_GET_SUCCESS = 'TEACHERS_GET_SUCCESS';
export const TEACHERS_GET_FAIL = 'TEACHERS_GET_FAIL';
export const TEACHER_DELETE_SUCCESS = 'TEACHERs_DELETE_SUCCESS';
export const TEACHER_DELETE_FAIL = 'TEACHER_DELETE_FAIL';

// Lesson types
export const LESSON_CREATED_SUCCESS = 'LESSON_CREATED_SUCCESS';
export const LESSON_CREATED_FAIL = 'LESSON_CREATED_FAIL';
export const LESSONS_GET_SUCCESS = 'LESSONS_GET_SUCCESS';
export const LESSONS_GET_FAIL = 'LESSONS_GET_FAIL';
export const LESSON_UPDATE_SUCCESS = 'LESSON_UPDATE_SUCCESS';
export const LESSON_UPDATE_FAIL = 'LESSON_UPDATE_FAIL';
export const LESSON_DELETE_SUCCESS = 'LESSON_DELETE_SUCCESS';
export const LESSON_DELETE_FAIL = 'LESSON_DELETE_FAIL';
export const LESSONS_GET_BY_IDS = 'LESSONS_GET_BY_IDS';
export const LESSONS_GET_BY_IDS_INITIATED = 'LESSONS_GET_BY_IDS_INITIATED';

// Course types
export const COURSE_CREATED_SUCCESS = 'COURSE_CREATED_SUCCESS';
export const COURSE_CREATED_FAIL = 'COURSE_CREATED_FAIL';
export const COURSES_GET_SUCCESS = 'COURSES_GET_SUCCESS';
export const COURSES_GET_FAIL = 'COURSES_GET_FAIL';
export const COURSE_UPDATE_SUCCESS = 'COURSE_UPDATE_SUCCESS';
export const COURSE_UPDATE_FAIL = 'COURSE_UPDATE_FAIL';
export const COURSE_DELETE_SUCCESS = 'COURSE_DELETE_SUCCESS';
export const COURSE_DELETE_FAIL = 'COURSE_DELETE_FAIL';

// LessonOngoing types
export const LESSON_ONGOING_CREATED_SUCCESS = 'LESSON_ONGOING_CREATED_SUCCESS';
export const LESSON_ONGOING_CREATED_FAIL = 'LESSON_ONGOING_CREATED_FAIL';
export const LESSON_ONGOINGS_GET_SUCCESS = 'LESSON_ONGOINGS_GET_SUCCESS';
export const LESSON_ONGOINGS_GET_FAIL = 'LESSON_ONGOINGS_GET_FAIL';
export const LESSON_ONGOING_UPDATE_SUCCESS = 'LESSON_ONGOING_UPDATE_SUCCESS';
export const LESSON_ONGOING_UPDATE_FAIL = 'LESSON_ONGOING_UPDATE_FAIL';
export const LESSON_ONGOING_DELETE_SUCCESS = 'LESSON_ONGOING_DELETE_SUCCESS';
export const LESSON_ONGOING_DELETE_FAIL = 'LESSON_ONGOING_DELETE_FAIL';
export const LESSON_ONGOING_GET_LESSON_BY_LO_ID = 'LESSON_ONGOING_GET_LESSON_BY_LO_ID'

// CourseOngoing types
export const COURSE_ONGOING_CREATED_SUCCESS = 'COURSE_ONGOING_CREATED_SUCCESS';
export const COURSE_ONGOING_CREATED_FAIL = 'COURSE_ONGOING_CREATED_FAIL';
export const COURSE_ONGOINGS_GET_SUCCESS = 'COURSE_ONGOINGS_GET_SUCCESS';
export const COURSE_ONGOINGS_GET_FAIL = 'COURSE_ONGOINGS_GET_FAIL';
export const COURSE_ONGOING_UPDATE_SUCCESS = 'COURSE_ONGOING_UPDATE_SUCCESS';
export const COURSE_ONGOING_UPDATE_FAIL = 'COURSE_ONGOING_UPDATE_FAIL';
export const COURSE_ONGOING_DELETE_SUCCESS = 'COURSE_ONGOING_DELETE_SUCCESS';
export const COURSE_ONGOING_DELETE_FAIL = 'COURSE_ONGOING_DELETE_FAIL';

// Exercise types
export const GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID = 'GET_SINGLE_ANSWER_TEST_EXERCISES_BY_LESSON_ID';
export const CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES = 'CREATE_MANY_SINGLE_ANSWER_TEST_EXERCISES';