import { useSubscription } from '@/contexts/SubscriptionContext';
import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';

/**
 * Component that displays the user's current subscription status
 * Shows a badge with the current plan and the number of remaining requests
 */
export function SubscriptionBadge() {
  const { user, getRemainingRequests } = useSubscription();

  // Get the plan name for display (capitalize first letter)
  const getPlanName = () => {
    switch (user.plan) {
      case 'free':
        return 'Gratuito';
      case 'starter':
        return 'Iniciante';
      case 'pro':
        return 'Pro';
      default:
        return user.plan.charAt(0).toUpperCase() + user.plan.slice(1);
    }
  };

  // Determine the badge style based on the plan
  const getBadgeStyle = () => {
    switch (user.plan) {
      case 'free':
        return 'bg-gray-700 hover:bg-gray-600 text-white';
      case 'starter':
        return 'bg-blue-600 hover:bg-blue-500 text-white';
      case 'pro':
        return 'bg-amber-500 hover:bg-amber-400 text-white';
      default:
        return 'bg-gray-700 hover:bg-gray-600 text-white';
    }
  };

  return (
    <Link href="/plans">
      <Badge className={`cursor-pointer flex items-center gap-1 py-1 px-3 ${getBadgeStyle()}`}>
        <Info className="h-3.5 w-3.5" />
        <span>Plano {getPlanName()}</span>
        {user.plan === 'free' && (
          <span className="ml-1 text-xs bg-gray-800 py-0.5 px-1.5 rounded-full">
            {getRemainingRequests()}/{user.requestLimit}
          </span>
        )}
      </Badge>
    </Link>
  );
}