import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import ApiError from "../middlewares/classes/ApiError";
import prisma from "./prisma";

type TNotificationPayload = {
  receiverId: string;
  title: string;
  body: string;
};

const getFirebaseCredential = () => {
  const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
  if (filePath) {
    const absolutePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(process.cwd(), filePath);
    const raw = fs.readFileSync(absolutePath, "utf8");
    return admin.credential.cert(JSON.parse(raw));
  }

  throw new ApiError(500, "Firebase service account is not configured.");
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: getFirebaseCredential(),
  });
}

export const sendNotification = async (
  fcmToken: string[],
  payload: TNotificationPayload,
  extraData?: Record<string, any>
): Promise<any> => {
  try {
    if (!fcmToken?.length) return null;

    const dataPayload: Record<string, string> | undefined = extraData
      ? Object.fromEntries(
          Object.entries(extraData).map(([key, value]) => [
            key,
            value === undefined || value === null ? "" : String(value),
          ])
        )
      : undefined;

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
