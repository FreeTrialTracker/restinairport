let previousPath: string | null = null;
let currentPath: string = typeof window !== 'undefined' ? window.location.pathname : '/';

export function getPreviousPath(): string | null {
  return previousPath;
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') return;
  previousPath = currentPath;
  currentPath = path;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}
