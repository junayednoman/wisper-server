import { TRequest } from "../../interface/global.interface";
import handleAsyncRequest from "../../utils/handleAsyncRequest";
import { sendResponse } from "../../utils/sendResponse";
import { recommendationService } from "./recommendation.service";

const giveRecommendation = handleAsyncRequest(async (req: TRequest, res) => {
  const result = await recommendationService.giveRecommendation(
    req.body,
    req.user!.id
  );
  sendResponse(res, {
    message: "Recommendation given successfully!",
    data: result,
    status: 201,
  });
});

const getRecommendationsByPersonId = handleAsyncRequest(
  async (req: TRequest, res) => {
    const result = await recommendationService.getRecommendationsByPersonId(
      req.params.personId!
    );
    sendResponse(res, {
      message: "Recommendations retrieved successfully!",
      data: result,
    });
  }
);

const getClassRecommendations = handleAsyncRequest(
  async (req: TRequest, res) => {
    const result = await recommendationService.getClassRecommendations(
      req.params.classId!
    );
    sendResponse(res, {
      message: "Recommendations retrieved successfully!",
      data: result,
    });
  }
);

export const recommendationController = {
  giveRecommendation,
  getRecommendationsByPersonId,
  getClassRecommendations,
};
