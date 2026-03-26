import { ArrowLeft } from 'lucide-react';
import { navigateTo, getPreviousPath } from '../lib/navigation';

interface BackNavigationProps {
  fallbackUrl?: string;
  fallbackLabel?: string;
  label?: string;
  className?: string;
}

export default function BackNavigation({
  fallbackUrl = '/',
  fallbackLabel,
  label,
  className = 'inline-flex items-center text-slate-700 hover:text-slate-900 transition-colors',
}: BackNavigationProps) {
  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    const prev = getPreviousPath();
    navigateTo(prev ?? fallbackUrl);
  };

  const displayLabel = label ?? (fallbackLabel ? `Back to ${fallbackLabel}` : 'Back');

  return (
    <a
      href={fallbackUrl}
      onClick={handleBack}
      className={className}
    >
      <ArrowLeft className="w-5 h-5 mr-2 flex-shrink-0" />
      {displayLabel}
    </a>
  );
}
