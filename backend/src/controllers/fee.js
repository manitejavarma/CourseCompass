// Developed by Milan Ganesh Acharya
var feeController = {};

// Method to get terms that have courses added in them
feeController.courseTerm = function (req, res) {
    try {
        if ((req.params.userId || req.query.userId)) {
            const userId = req.params.userId ? req.params.userId : req.query.userId;
            let sql = `select distinct(term.termId),term from term, user_course, term_course where user_course.userId=${userId} and user_course.courseId=term_course.courseId and term_course.termId=term.termId`;

            db.query(sql, function (err, term) {
                if (err)
                    throw err;
                if (term.length) {
                    res.status(200).json({
                        success: true,
                        courseInfo: term
                    });
                }
                else {
                    res.status(404).json({
                        message: "Courses not found",
                        success: false
                    });
                }
            })
        }
        else {
            res.status(400).json({
                message: "Bad request",
                success: false
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Method to get the courses in a specific term
feeController.termFee = function (req, res) {
    try {
        if ((req.params.termId || req.query.termId) && (req.params.userId || req.query.userId)) {
            const termId = req.params.termId ? req.params.termId : req.query.termId;
            const userId = req.params.userId ? req.params.userId : req.query.userId;
            let sql = `SELECT title, fee FROM course, user_course, term_course WHERE user_course.userId=${userId} AND user_course.courseId=course.courseId 
            AND user_course.courseId=term_course.courseId AND term_course.termId=${termId}`;

            db.query(sql, function (err, course) {
                if (err)
                    throw err;
                if (course.length) {
                    res.status(200).json({
                        success: true,
                        courseInfo: course
                    });
                }
                else {
                    res.status(404).json({
                        message: "Courses not found",
                        success: false
                    });
                }
            })
        }
        else {
            res.status(400).json({
                message: "Bad request",
                success: false
            });
        }
    }
    catch (ex) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

module.exports = feeController;