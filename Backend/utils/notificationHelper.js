const Notification = require('../models/Notification');

const sendNotificationToAllUsers = async (message) => {
    await Notification.insertMany([{ message, userRole: 'user' }]);
};

module.exports = { sendNotificationToAllUsers };
