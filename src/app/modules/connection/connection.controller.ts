import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import pick from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import { connectionServices } from "./connection.service";

const sendConnectionRequest = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await connectionServices.sendConnectionRequest(
    req.user!.id,
    req.body
  );
  sendResponse(res, {
    message: "Connection request sent successfully!",
    data: result,
    status: 201,
  });
});

const getMyConnections = handleAsyncRequest(async (req: TRequest, res) => {
  const options = pick(req.query, ["page", "limit", "sortBy", "orderBy"]);
  const result = await connectionServices.getMyConnections(
    req.user!.id,
    req.query,
    options
  );
  sendResponse(res, {
    message: "Connections retrieved successfully!",
    data: result,
  });
});

const acceptOrRejectConnection = handleAsyncRequest(
  async (req: TRequest, res) => {
    const { result, message } =
      await connectionServices.acceptOrRejectConnection(
        req.params.id as string,
        req.body.status,
        req.user!.id
      );
    sendResponse(res, {
      message,
      data: result,
    });
  }
);

const deleteConnection = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await connectionServices.deleteConnection(
    req.params.id as string,
    req.user!.id
  );
  sendResponse(res, {
    message: "Connection removed successfully!",
    data: result,
  });
});

export const connectionController = {
  sendConnectionRequest,
  getMyConnections,
  acceptOrRejectConnection,
  deleteConnection,
};
