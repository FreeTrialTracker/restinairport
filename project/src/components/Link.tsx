interface LinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function Link({ to, children, className = '' }: LinkProps) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', to);
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
