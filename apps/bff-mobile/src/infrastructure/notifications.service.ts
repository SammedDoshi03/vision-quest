import { Injectable, Logger } from '@nestjs/common';

export interface PushNotificationPayload {
  devicePushToken: string;
  title: string;
  titleMr?: string;
  body: string;
  bodyMr?: string;
  data: Record<string, string>;
  priority: 'high' | 'normal';
  channelId: string;
  sound: string;
}

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  async dispatchExactMedicationAlarm(
    pushToken: string,
    medicineName: string,
    scheduledTime: string,
    language: 'en' | 'mr' = 'mr'
  ): Promise<{ success: boolean; messageId: string }> {
    const isMarathi = language === 'mr';
    const payload: PushNotificationPayload = {
      devicePushToken: pushToken,
      title: isMarathi ? 'औषध घेण्याची वेळ झाली आहे' : 'Medication Time',
      body: isMarathi
        ? `${scheduledTime} वाजता ${medicineName} घेण्याची वेळ झाली आहे.`
        : `It is time to take ${medicineName} scheduled for ${scheduledTime}.`,
      data: {
        type: 'MEDICATION_REMINDER',
        channel: 'EXACT_ALARM_CHANNEL',
        actionTaken: 'TAKEN',
        actionSnooze: 'SNOOZE',
      },
      priority: 'high',
      channelId: 'medication_alarms_max_importance',
      sound: 'medication_chime.wav',
    };

    // In production with FCM, admin.messaging().send(payload)
    this.logger.log(
      `[PushNotification] Dispatched High-Priority Alarm to ${pushToken}: "${payload.title}" - "${payload.body}"`
    );

    return {
      success: true,
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    };
  }

  async dispatchCaregiverMissedDoseAlert(
    caregiverToken: string,
    patientName: string,
    medicineName: string
  ): Promise<{ success: boolean; messageId: string }> {
    this.logger.warn(
      `[PushNotification] CRITICAL ALERT sent to Caregiver: ${patientName} missed ${medicineName}!`
    );
    return {
      success: true,
      messageId: `alert_${Date.now()}`,
    };
  }
}
