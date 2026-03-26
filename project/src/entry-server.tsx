import { renderToString } from 'react-dom/server';
import { HelmetProvider, HelmetServerState } from 'react-helmet-async';
import App from './App';
import type { SSRBrandData } from './App';

export interface RenderResult {
  html: string;
  helmet: HelmetServerState;
}

export function render(url: string, ssrBrandData?: SSRBrandData): RenderResult {
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <App ssrUrl={url} ssrBrandData={ssrBrandData} />
    </HelmetProvider>
  );

  return {
    html,
    helmet: helmetContext.helmet as HelmetServerState,
  };
}
