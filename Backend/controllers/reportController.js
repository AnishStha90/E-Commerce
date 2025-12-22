const asyncHandler = require('express-async-handler');
const Report = require('../models/Report');

// Create Report (any logged-in user)
exports.createReport = asyncHandler(async (req, res) => {
    const { type, data } = req.body;
    if (!type) return res.status(400).json({ message: 'Report type is required' });

    const report = await Report.create({ type, data, createdBy: req.user._id });
    res.status(201).json(report);
});

// Get Reports (admin only)
exports.getReports = asyncHandler(async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const filter = {};
    if (req.query.type) filter.type = req.query.type;

    const reports = await Report.find(filter)
        .sort({ generatedAt: -1 })
        .populate('createdBy', 'name email role');
    res.json({ count: reports.length, reports });
});

// Get single report (admin or the report owner)
exports.getReportById = asyncHandler(async (req, res) => {
    const report = await Report.findById(req.params.id).populate('createdBy', 'name email role');
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (req.user.role !== 'admin' && report.createdBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
    }

    res.json(report);
});

// Reply to a report (admin only)
exports.replyReport = asyncHandler(async (req, res) => {
    const { reply } = req.body;
    if (!reply) return res.status(400).json({ message: 'Reply message is required' });

    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    report.reply = reply;
    report.repliedAt = new Date();
    await report.save();

    res.json({ message: 'Reply sent', report });
});
