export interface Station {
  id: string;
  name: string;
  description?: string;
  streamUrl: string;
  faviconUrl?: string;
  tags?: string[];
  isLive?: boolean;
}
