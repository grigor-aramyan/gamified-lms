import express from 'express';
import mongoose from 'mongoose';
import auth from '../../../middleware/auth';

// Schemas
import CourseOngoing from '../schemas/CourseOngoingSchema';
import Learner from '../schemas/LearnerSchema';
import Teacher from '../schemas/TeacherSchema';
import Course from '../schemas/CourseSchema';
import Lesson from '../schemas/LessonSchema';

const router = express.Router();

// @route UPDATE api/course_ongoings/:id
// @desc Update course ongoing of learner by logged in teacher
// @access Private
router.put('/:id', auth, function(req, res) {
    const teacherId = mongoose.Types.ObjectId(req.user.id);

    const dataObject = req.body;

    let courseOngoingId = null;
    try {
        courseOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No data found to update!' });
    }

    Teacher.findById(teacherId, (err, teacher) => {
        if (err || (teacher == null)) return res.status(400).json({ msg: 'No teacher found with provided credentials' });

        CourseOngoing.findById(courseOngoingId, (err, co) => {
            if (err || (co == null)) return res.status(400).json({ msg: 'No data found to update!' });

            Course.findById(co.courseId, (err, course) => {
                if (err || (course == null)) return res.status(500).json({ msg: 'Internal error! Try later or contact with us, please!' });

                const lessonIdsArray = course.lessons;
                if (lessonIdsArray.length <= 0) {
                    return res.status(500).json({ msg: 'Internal error! Contact with us or try later, please!' });
                } else {
                    const lessonId = lessonIdsArray[0];
                    Lesson.findById(lessonId, (err, lesson) => {
                        if (err || (lesson == null)) return res.status(500).json({ msg: 'Internal error!' });

                        if (teacher._id.toString() === lesson.author.toString()) {
                            if (dataObject.completionPoints) {
                                const cp = dataObject.completionPoints;

                                let dynamicMap = {};
                                for (let [k, v] of Object.entries(cp)) {
                                    
                                    const filteredLesson = course.lessons.filter(l => {
                                        if ( (l.toString() === k) &&
                                            ( (co.completionPoints == undefined) ||
                                                (co.completionPoints.get(l.toString()) == undefined) ) ) return true;

                                        return false;
                                    });

                                    if (filteredLesson.length > 0) {
                                        dynamicMap[k] = v;
                                    }
                                }

                                if (Object.keys(dynamicMap).length > 0) {
                                    dataObject.completionPoints = dynamicMap;
                                } else {
                                    delete dataObject.completionPoints;
                                }

                                CourseOngoing.updateOne({ _id: co._id }, dataObject, (err, affected, resp) => {
                                    if (err) return res.status(500).json({ msg: 'Internal error!' });

                                    res.status(200).json({ msg: 'success' });
                                });
                                
                            } else {
                                CourseOngoing.updateOne({ _id: co._id }, dataObject, (err, affected, resp) => {
                                    if (err) return res.status(500).json({ msg: 'Internal error! Contact with us, please.' });

                                    res.status(200).json({ msg: 'success' });
                                });
                            }
                        } else {
                            return res.status(400).json({ msg: 'Only author of this course can modify it!' });
                        }
                    });
                }
            });
        });
    });
});

// @route DELETE api/course_ongoings/:id
// @desc Delete course ongoing of logged in learner
// @access Private
router.delete('/:id', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let courseOngoingId = null;
    try {
        courseOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No data found to delete!' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        CourseOngoing.findOneAndDelete({ _id: courseOngoingId, learnerId: learner._id }, (err, co) => {
            if (err || (co == null)) return res.status(400).json({ msg: 'No data found to delete!' });

            res.status(200).json({ msg: 'deleted', id: co._id });
        });
    });
});

// @route POST api/course_ongoings
// @desc Create course ongoing for logged in learner
// @access Private
router.post('/', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let courseId = null;
    try {
        courseId = mongoose.Types.ObjectId(req.body.courseId);
    } catch(e) {
        return res.status(400).json({ msg: 'No course found with provided credentials!' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        Course.findById(courseId, (err, course) => {
            if (err || (course == null)) return res.status(400).json({ msg: 'No course found with provided credentials!' });

            const courseOngoing = new CourseOngoing({
                learnerId: learner._id,
                courseId: course._id,
                completionPoints: {}
            });

            courseOngoing.save()
                .then(co => {
                    res.status(201).json({
                        course_ongoing: {
                            id: co._id,
                            completed: co.completed,
                            courseId: co.courseId,
                            learnerId: co.learnerId        
                        }
                    });
                });
        });
    });
});

// @route GET api/course_ongoings/course/:id
// @desc Get course by course ongoing id
// @access Private
router.get('/course/:id', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let courseOngoingId = null;
    try {
        courseOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No course found with provided credentials' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        CourseOngoing.findOne({ _id: courseOngoingId, learnerId: learner._id }, (err, courseOngoing) => {
            if (err || (courseOngoing == null)) return res.status(400).json({ msg: 'No data found with provided credentials' });

            Course.findById(courseOngoing.courseId, (err, c) => {
                if (err || (c == null)) return res.status(400).json({ msg: 'No course found with provided credentials!' });
            
                res.status(200).json({
                    id: c._id,
                    title: c.title,
                    description: c.description,
                    authorId: c.author,
                    lessonsId: c.lessons,
                    price: c.price
                });
            });
        });
    });
});

// @route GET api/course_ongoings/course_extended/:id
// @desc Get extended course by course ongoing id
// @access Private
router.get('/course_extended/:id', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    let courseOngoingId = null;
    try {
        courseOngoingId = mongoose.Types.ObjectId(req.params.id);
    } catch(e) {
        return res.status(400).json({ msg: 'No course found with provided credentials' });
    }

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        CourseOngoing.findOne({ _id: courseOngoingId, learnerId: learner._id }, (err, courseOngoing) => {
            if (err || (courseOngoing == null)) return res.status(400).json({ msg: 'No data found with provided credentials' });

            Course.findById(courseOngoing.courseId, (err, c) => {
                if (err || (c == null)) return res.status(400).json({ msg: 'No course found with provided credentials!' });
            
                Lesson.find({}, (err, lessons) => {
                    if (err || (lessons == null)) return res.status(500).json({ msg: 'Internal server error!' });

                    const courseLessonsIdsStr = c.lessons.map(i => {
                        return(i.toString());
                    });

                    const courseLessons = lessons.filter(l => {
                        return(courseLessonsIdsStr.includes(l._id.toString()));
                    });

                    const lessondsOfCurrentCourseMapped = courseLessons.map(l => {
                        return({
                            id: l._id.toString(),
                            title: l.title
                        });
                    });

                    res.status(200).json({
                        id: c._id,
                        title: c.title,
                        description: c.description,
                        authorId: c.author,
                        lessons: lessondsOfCurrentCourseMapped,
                        price: c.price,
                        completionPoints: courseOngoing.completionPoints
                    });
                });
            });
        });
    });
});

// @route GET api/course_ongoings
// @desc Get course ongoings of logged in learner
// @access Private
router.get('/', auth, function(req, res) {
    const learnerId = mongoose.Types.ObjectId(req.user.id);

    Learner.findById(learnerId, (err, learner) => {
        if (err || (learner == null)) return res.status(400).json({ msg: 'No learner found with provided credentials' });

        CourseOngoing.find({ learnerId: learner._id }, (err, courseOngoings) => {
            if (err) return res.status(400).json({ msg: 'Bad request!' });

            const courseOngoingsFiltered = courseOngoings.map(c => {
                return {
                    id: c._id,
                    completed: c.completed,
                    courseId: c.courseId,
                    completionPoints: c.completionPoints
                };
            });

            res.status(200).json({ course_ongoings: courseOngoingsFiltered });
        });
    });
});

export default router;