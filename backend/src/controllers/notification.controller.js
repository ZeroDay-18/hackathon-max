import db from '../models/index.js';

const Notification = db.notifications;

export async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50,
    });

    return res.json({ success: true, notifications });
  } catch (error) {
    return next(error);
  }
}

export async function markNotificationRead(req, res, next) {
  try {
    const notification = await Notification.findOne({
      where: { id: req.params.id, userId: req.user.id },
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    if (!notification.readAt) {
      await notification.update({ readAt: new Date() });
    }

    return res.json({ success: true, notification });
  } catch (error) {
    return next(error);
  }
}
