import type { AirportFacility } from './database.types';

export type CategoryType = 'sleep-pods' | 'private-rooms' | 'transit-hotels' | 'lounge-sleep';

export interface CategoryInfo {
  id: CategoryType;
  name: string;
  title: string;
  description: string;
  filterFn: (facility: AirportFacility) => boolean;
}

export const categories: Record<CategoryType, CategoryInfo> = {
  'sleep-pods': {
    id: 'sleep-pods',
    name: 'Sleep Pods',
    title: 'Sleep Pods in Airports',
    description: 'Discover compact sleep pods and capsules at airports worldwide. Perfect for quick rest during layovers with privacy and comfort in a space-efficient design.',
    filterFn: (facility) => {
      const type = facility.type.toLowerCase();
      const name = facility.facility.toLowerCase();
      return type === 'pod' || type === 'capsule' ||
             name.includes('pod') || name.includes('capsule') ||
             name.includes('napcabs') || name.includes('gosleep');
    }
  },
  'private-rooms': {
    id: 'private-rooms',
    name: 'Private Rooms',
    title: 'Private Rooms in Airports',
    description: 'Find private rooms and suites at airports for ultimate comfort and privacy. Ideal for longer layovers with amenities like beds, workspaces, and private bathrooms.',
    filterFn: (facility) => {
      const type = facility.type.toLowerCase();
      const name = facility.facility.toLowerCase();
      return type === 'suite' ||
             name.includes('minute suites') ||
             name.includes('suite') ||
             (name.includes('day room') && !name.includes('lounge'));
    }
  },
  'transit-hotels': {
    id: 'transit-hotels',
    name: 'Transit Hotels',
    title: 'Transit Hotels in Airports',
    description: 'Explore transit hotels and airport hotels located inside terminals. Convenient accommodation without leaving the airport, perfect for international layovers.',
    filterFn: (facility) => {
      const type = facility.type.toLowerCase();
      const name = facility.facility.toLowerCase();
      return type === 'hotel' ||
             name.includes('hotel') ||
             name.includes('transit') ||
             name.includes('aerotel');
    }
  },
  'lounge-sleep': {
    id: 'lounge-sleep',
    name: 'Lounge Sleep',
    title: 'Lounge Sleep Options in Airports',
    description: 'Access airport lounges with sleep facilities, rest areas, and comfortable seating. Many accept Priority Pass, LoungeKey, and premium credit cards.',
    filterFn: (facility) => {
      const type = facility.type.toLowerCase();
      const name = facility.facility.toLowerCase();
      return type === 'lounge' ||
             name.includes('lounge') ||
             name.includes('plaza premium') ||
             (facility.cards && facility.cards.length > 0);
    }
  }
};

export function getCategoryFacilities(categoryId: CategoryType, facilities: AirportFacility[]): AirportFacility[] {
  const category = categories[categoryId];
  if (!category) return [];
  return facilities.filter(category.filterFn);
}

export function getCategoryStats(categoryId: CategoryType, facilities: AirportFacility[]) {
  const categoryFacilities = getCategoryFacilities(categoryId, facilities);
  const airports = new Set(categoryFacilities.map(f => f.airport_code));

  return {
    facilityCount: categoryFacilities.length,
    airportCount: airports.size,
    facilities: categoryFacilities
  };
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getAirportSlug(airportName: string, airportCode: string): string {
  const cleanName = airportName.replace(/\s*\([A-Z]{3}\)\s*$/, '');
  return `${generateSlug(cleanName)}-${airportCode.toLowerCase()}`;
}

export function getBrandSlug(brandName: string): string {
  return generateSlug(brandName);
}
