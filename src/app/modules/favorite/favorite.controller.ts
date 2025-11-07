import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { favoriteJobService } from "./favorite.service";

const addOrRemoveFavoriteJob = handleAsyncRequest(
  async (req: TRequest, res) => {
    const { message, result } = await favoriteJobService.addOrRemoveFavoriteJob(
      req.user!.id,
      req.params.jobId as string
    );
    sendResponse(res, {
      message,
      data: result,
    });
  }
);

const myFavoriteList = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await favoriteJobService.myFavoriteList(req.user!.id);
  sendResponse(res, {
    message: "Favorite jobs retrieved successfully!",
    data: result,
  });
});

export const favoriteJobController = {
  addOrRemoveFavoriteJob,
  myFavoriteList,
};
