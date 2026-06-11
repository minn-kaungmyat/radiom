import type { Station } from './Station';

export interface Channel {
  id: string;
  name: string;
  icon: string; // Lucide icon name (e.g. "CloudRain")
  description: string;
  tags: string[];
  stations: Station[];
}
