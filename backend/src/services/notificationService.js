import webPush from 'web-push';
import cron from 'node-cron';
import User from '../models/User.js';
import Medication from '../models/Medication.js';
import DoseRecord from '../models/DoseRecord.js';
import config from '../config/env.js';

/**
 * Initialize Web Push with VAPID keys
 */
function initializeWebPush() {
    if (config.vapid.publicKey && config.vapid.privateKey) {
        webPush.setVapidDetails(
            config.vapid.email,
            config.vapid.publicKey,
            config.vapid.privateKey
        );
        console.log('✅ Web Push initialized');
        return true;
    }
    console.warn('⚠️  VAPID keys not configured — push notifications disabled');
    return false;
}

/**
 * Send push notification to a user
 */
async function sendPushNotification(userId, payload) {
    try {
        const user = await User.findById(userId);

        if (!user || !user.pushSubscription || !user.notificationsEnabled) {
            return false;
        }

        await webPush.sendNotification(
            user.pushSubscription,
            JSON.stringify(payload)
        );
        return true;
    } catch (error) {
        console.error(`Push notification failed for user ${userId}:`, error.message);

        // Remove invalid subscription
        if (error.statusCode === 410 || error.statusCode === 404) {
            await User.findByIdAndUpdate(userId, { pushSubscription: null });
        }
        return false;
    }
}

/**
 * Schedule medication reminders
 * Runs every minute to check for upcoming doses
 */
function startReminderScheduler() {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const today = now.toISOString().split('T')[0];

            // Find all active medications with this timing
            const medications = await Medication.find({
                active: true,
                timings: currentTime,
            });

            for (const med of medications) {
                // Check if dose already recorded
                const existing = await DoseRecord.findOne({
                    medicationId: med._id,
                    date: today,
                    scheduledTime: currentTime,
                    status: 'taken',
                });

                if (!existing) {
                    // Send notification
                    await sendPushNotification(med.userId, {
                        title: '💊 Medicine Reminder',
                        body: `Time to take ${med.name} (${med.dosage})`,
                        data: {
                            type: 'medication_reminder',
                            medicationId: med._id.toString(),
                            time: currentTime,
                        },
                    });
                }
            }
        } catch (error) {
            console.error('Reminder scheduler error:', error.message);
        }
    });

    // Mark missed doses — runs every hour
    cron.schedule('0 * * * *', async () => {
        try {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
            const today = now.toISOString().split('T')[0];

            // Mark past upcoming doses as missed
            await DoseRecord.updateMany(
                {
                    date: today,
                    status: 'upcoming',
                    scheduledTime: { $lt: currentTime },
                },
                { status: 'missed' }
            );
        } catch (error) {
            console.error('Missed dose checker error:', error.message);
        }
    });

    console.log('✅ Medication reminder scheduler started');
}

const notificationService = {
    initializeWebPush,
    sendPushNotification,
    startReminderScheduler,
};

export default notificationService;
