import React from 'react';
import { Check } from 'lucide-react';
import type { SubscriptionPlan } from '../types';

interface SubscriptionPlansProps {
  plans: SubscriptionPlan[];
  currentPlan?: string;
  onSelectPlan: (plan: SubscriptionPlan) => void;
}

export default function SubscriptionPlans({
  plans,
  currentPlan,
  onSelectPlan
}: SubscriptionPlansProps) {
  return (
    <div className="grid md:grid-cols-3 gap-6 p-4">
      {plans.map((plan) => (
        <div
          key={plan.id}
          className={`p-6 rounded-lg border ${
            currentPlan === plan.id
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700'
          }`}
        >
          <h3 className="text-lg font-semibold mb-2 dark:text-white">{plan.name}</h3>
          <p className="text-2xl font-bold mb-4 dark:text-white">
            ${plan.price}<span className="text-sm font-normal">/month</span>
          </p>
          <ul className="space-y-2 mb-6">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2">
                <Check className="text-green-500" size={16} />
                <span className="text-sm dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={() => onSelectPlan(plan)}
            className={`w-full py-2 rounded-lg ${
              currentPlan === plan.id
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
            }`}
          >
            {currentPlan === plan.id ? 'Current Plan' : 'Select Plan'}
          </button>
        </div>
      ))}
    </div>
  );
}