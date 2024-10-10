import { NextRequest } from 'next/server';
import { ProcessWebhook } from '@/utils/paddle/process-webhook';
import { getPaddleInstance } from '@/utils/paddle/get-paddle-instance';

const webhookProcessor = new ProcessWebhook();

export async function POST(request: NextRequest) {
  console.log('Webhook received');
  const signature = request.headers.get('paddle-signature') || '';
  console.log('Signature:', signature);
  const rawRequestBody = await request.text();
  console.log('Raw body:', rawRequestBody);
  const privateKey = process.env['PADDLE_NOTIFICATION_WEBHOOK_SECRET'] || '';

  let status, eventName;
  try {
    if (signature && rawRequestBody) {
      const paddle = getPaddleInstance();
      const eventData = paddle.webhooks.unmarshal(rawRequestBody, privateKey, signature);
      status = 200;
      eventName = eventData?.eventType ?? 'Unknown event';
      if (eventData) {
        await webhookProcessor.processEvent(eventData);
      }
    } else {
      status = 400;
      console.log('Missing signature from header');
    }
  } catch (e) {
    console.error('Error processing webhook:', e);
    status = 500;
    eventName = 'Error processing event';
  }
  return Response.json({ status, eventName });
}

export async function GET() {
  return new Response('OK', { status: 200 });
}
