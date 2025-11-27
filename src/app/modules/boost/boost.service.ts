import Stripe from "stripe";
import config from "../../config";
import prisma from "../../utils/prisma";
import { TCreatePaymentSession } from "./boost.validation";
import ApiError from "../../middlewares/classes/ApiError";
import { generateTransactionId } from "../../utils/generateTransactionId";
import { BoostStatus } from "@prisma/client";

const stripe = new Stripe(config.payment.secret_key as string, {
  apiVersion: "2025-11-17.clover",
});

const createPaymentSession = async (
  userId: string,
  payload: TCreatePaymentSession
) => {
  const auth = await prisma.auth.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      email: true,
    },
  });

  const existing = await prisma.boost.findFirst({
    where: {
      postId: payload.postId,
      status: BoostStatus.ACTIVE,
    },
  });

  if (existing) throw new ApiError(400, "This post is already boosted!");

  const boostPackage = await prisma.boostPackage.findUniqueOrThrow({
    where: {
      id: payload.packageId,
      status: "ACTIVE",
    },
    select: {
      id: true,
      name: true,
      price: true,
    },
  });

  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (post.authorId !== userId) throw new ApiError(401, "Unauthorized!");

  const boostPayload = {
    postId: post.id,
    packageId: boostPackage.id,
    targetIndustry: payload.targetIndustry,
  };

  const transactionId = generateTransactionId("tnx");
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: auth.email,
    success_url: `${config.payment.callback_endpoint}?sessionId={CHECKOUT_SESSION_ID}&authId=${auth.id}&transactionId=${transactionId}&boostPayload=${JSON.stringify(boostPayload)}`,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: boostPackage.name,
          },
          unit_amount: Number((Number(boostPackage.price) * 100).toFixed(0)),
        },
        quantity: 1,
      },
    ],
  });

  return { url: session.url };
};

const paymentCallback = async (query: Record<string, any>) => {
  const { sessionId, authId, transactionId, boostPayload } = query;
  const paymentSession = await stripe.checkout.sessions.retrieve(sessionId);

  if (paymentSession?.payment_status === "paid") {
    const alreadyPaid = await prisma.payment.findFirst({
      where: {
        transactionId,
        authId,
      },
    });

    if (alreadyPaid) {
      return;
    }

    const paymentPayload = {
      authId: authId,
      amount: (paymentSession.amount_total as number) / 100,
      transactionId,
    };

    const parsedBoostPayload = JSON.parse(boostPayload);

    await prisma.$transaction(async tn => {
      await tn.payment.create({ data: paymentPayload });
      await tn.boost.create({ data: parsedBoostPayload });
    });
  } else {
    throw new ApiError(400, "Payment failed!");
  }
};

export const boostServices = {
  createPaymentSession,
  paymentCallback,
};
