'use server';

import { getCustomerId } from '@/utils/paddle/get-customer-id';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';
import { SubscriptionResponse } from '@/lib/api.types';
import { getErrorMessage } from '@/utils/paddle/data-helpers';

export async function getSubscriptions(): Promise<SubscriptionResponse> {
  try {
    const paddleCustomerId = await getCustomerId();

    if (!paddleCustomerId) {
      console.error('No Paddle customer ID found');
      return { data: [], hasMore: false, totalRecords: 0 };
    }

    const paddle = getPaddleInstance();
    const subscriptionCollection = paddle.subscriptions.list({ 
      customerId: [paddleCustomerId], 
      perPage: 20 
    });

    const subscriptions = await subscriptionCollection.next();

    return {
      data: subscriptions,
      hasMore: subscriptionCollection.hasMore,
      totalRecords: subscriptionCollection.estimatedTotal,
    };
  } catch (e) {
    console.error('Error retrieving subscriptions:', e);
    return getErrorMessage();
  }
}
