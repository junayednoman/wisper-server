import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { notificationService } from "./notification.service";

const createNotification = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await notificationService.createNotification(req.user!.id);
  sendResponse(res, {
    message: "Notification created!",
    data: result,
  });
});

const getNotifications = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await notificationService.getNotifications(
    req.user!.id,
    options
  );
  sendResponse(res, {
    message: "Notifications retrieved successfully!",
    data: result,
  });
});

const getUnseenNotificationCount = handleAsyncRequest(
  async (req: TRequest, res) => {
    const result = await notificationService.getUnseenNotificationCount(
      req.user!.id
    );
    sendResponse(res, {
      message: "Notification count retrieved successfully!",
      data: result,
    });
  }
);

const seenNotifications = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await notificationService.seenNotifications(
    req.user!.id,
    req.body.ids
  );
  sendResponse(res, {
    message: "Notifications marked as seen successfully!",
    data: result,
  });
});

const deleteNotifications = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await notificationService.deleteNotifications(
    req.user!.id,
    req.body.ids
  );
  sendResponse(res, {
    message: "Notifications deleted successfully!",
    data: result,
  });
});

export const notificationController = {
  createNotification,
  getUnseenNotificationCount,
  getNotifications,
  seenNotifications,
  deleteNotifications,
};
