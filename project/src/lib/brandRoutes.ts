import type { BrandType } from './brandNormalization';

export function slugifyBrandName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/&/g, 'and')
    .replace(/[\s_]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/^-+|-+$/g, '');
}

export function getBrandUrl(name: string): string {
  return `/brand/${slugifyBrandName(name)}`;
}

export function getBrandCompareUrl(nameA: string, nameB: string): string {
  return `/compare/${slugifyBrandName(nameA)}-vs-${slugifyBrandName(nameB)}`;
}

export function getBrandCompareUrlFromSlugs(slugA: string, slugB: string): string {
  return `/compare/${slugA}-vs-${slugB}`;
}

export function getBrandCategoryUrl(category: BrandType | string): string {
  if (category === 'Sleep Pods') return '/sleep-pods';
  if (category === 'Transit Hotel') return '/transit-hotels';
  if (category === 'Lounge Network') return '/lounge-sleep';
  return '/brands';
}
