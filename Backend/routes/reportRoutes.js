const express = require('express');
const router = express.Router();
const {
    createReport,
    getReports,
    getReportById,
    replyReport
} = require('../controllers/reportController');

const { protect, isUser, isAdmin } = require('../middleware/authMiddleware');

// ---------------- Create a report ----------------
// Any logged-in user can create a report
router.post('/', protect, isUser, createReport);

// ---------------- Admin routes ----------------
// Admin can view all reports
router.get('/', protect, isAdmin, getReports);

// Admin or report owner can get a single report
router.get('/:id', protect, isUser, getReportById); // inside controller, check if user is owner or admin

// Admin can reply to a report
router.put('/reply/:id', protect, isAdmin, replyReport);

module.exports = router;
