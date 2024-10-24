import { loadStripe } from '@stripe/stripe-js';
import type { SubscriptionPlan } from '../types';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Up to 3 lists',
      'Basic task management',
      'Dark mode'
    ],
    stripePriceId: ''
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    features: [
      'Unlimited lists',
      'Advanced task management',
      'Subtasks',
      'File attachments',
      'Priority support'
    ],
    stripePriceId: 'price_pro'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 19.99,
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom themes',
      'API access',
      'Advanced analytics'
    ],
    stripePriceId: 'price_premium'
  }
];

export async function createCheckoutSession(priceId: string, userId: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to initialize');

  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      priceId,
      userId,
    }),
  });

  const session = await response.json();
  const result = await stripe.redirectToCheckout({
    sessionId: session.id,
  });

  if (result.error) {
    throw new Error(result.error.message);
  }
}

export async function createPortalSession(userId: string) {
  const response = await fetch('/api/create-portal-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });

  const session = await response.json();
  window.location.href = session.url;
}