import admin from "firebase-admin";
import ApiError from "../middlewares/classes/ApiError";
import prisma from "./prisma";
import serviceAccount from "../private/firebase-service.json";

type TNotificationPayload = {
  receiverId: string;
  title: string;
  body: string;
};

const normalizeDataPayload = (data?: Record<string, any>) => {
  if (!data) return undefined;
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === undefined || value === null ? "" : String(value),
    ])
  );
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as any),
  });
}

export const sendNotification = async (
  fcmToken: string[],
  payload: TNotificationPayload,
  extraData?: Record<string, any>
): Promise<any> => {
  try {
    if (!fcmToken?.length) return null;

    const dataPayload = normalizeDataPayload(extraData);

    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: dataPayload,
      apns: {
        headers: {
          "apns-push-type": "alert",
        },
        payload: {
          aps: {
            badge: 1,
            sound: "default",
          },
        },
      },
    });
    if (response.successCount) {
      await prisma.notification.create({ data: payload });
    }

    return response;
  } catch (error: any) {
    if (error?.code === "messaging/third-party-auth-error") {
      return null;
    } else {
      throw new ApiError(500, error.message || "Failed to send notification");
    }
  }
};

export const sendDataMessageToToken = async (
  fcmToken: string,
  data: Record<string, any>
) => {
  if (!fcmToken) return null;
  const payload = normalizeDataPayload(data);
  return admin.messaging().send({
    token: fcmToken,
    data: payload,
    android: {
      priority: "high",
    },
  });
};

export const sendNotificationToUser = async (
  receiverId: string,
  title: string,
  body: string,
  extraData?: Record<string, any>
): Promise<any> => {
  const auth = await prisma.auth.findUnique({
    where: {
      id: receiverId,
    },
    select: {
      fcmToken: true,
      allowNotifications: true,
    },
  });

  if (!auth?.fcmToken || auth.allowNotifications === false) return null;

  return sendNotification(
    [auth.fcmToken],
    {
      receiverId,
      title,
      body,
    },
    extraData
  );
};

export const firebaseAdmin = admin;
