const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    type: { type: String, required: true },
    data: { type: Object },
    generatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Report', ReportSchema);
