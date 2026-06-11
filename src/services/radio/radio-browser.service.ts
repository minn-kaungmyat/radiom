import type { Station } from '../../domain/models/Station';

class RadioBrowserService {
  private baseUrl: string | null = null;
  private mirrorList: string[] = [];
  
  // Discover working mirror
  async getHealthyMirror(): Promise<string> {
    if (this.baseUrl) return this.baseUrl;

    if (this.mirrorList.length === 0) {
      try {
        const response = await fetch('https://all.api.radio-browser.info/json/servers');
        const servers = await response.json();
        this.mirrorList = servers.map((s: any) => `https://${s.name}`);
        // Shuffle the list to load balance
        this.mirrorList.sort(() => 0.5 - Math.random());
      } catch (error) {
        console.error("Failed to fetch mirror list", error);
        // Fallback hardcoded mirrors if DNS fails
        this.mirrorList = [
          'https://de1.api.radio-browser.info',
          'https://nl1.api.radio-browser.info',
          'https://at1.api.radio-browser.info'
        ];
      }
    }

    // Try mirrors until one works
    for (const mirror of this.mirrorList) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        // Ping stats to verify health
        const res = await fetch(`${mirror}/json/stats`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (res.ok) {
          this.baseUrl = mirror;
          return this.baseUrl;
        }
      } catch (e) {
        console.warn(`Mirror ${mirror} failed, trying next...`);
      }
    }

    throw new Error('No healthy Radio Browser mirrors found');
  }

  // Fetch stations matching any of the tags (OR search)
  async getStationsByTags(tags: string[]): Promise<Station[]> {
    const mirror = await this.getHealthyMirror();
    
    // Fetch top stations for each tag in parallel
    const fetchPromises = tags.map(async (tag) => {
      try {
        const response = await fetch(`${mirror}/json/stations/search?tagExact=true&tag=${encodeURIComponent(tag)}&limit=15&order=clickcount&reverse=true&hidebroken=true`);
        if (!response.ok) return [];
        return await response.json();
      } catch (e) {
        console.error(`Failed to fetch for tag: ${tag}`, e);
        return [];
      }
    });
    
    const results = await Promise.all(fetchPromises);
    
    // Flatten and deduplicate by station UUID
    const allStations = results.flat();
    const uniqueStationsMap = new Map();
    
    for (const item of allStations) {
      if (!uniqueStationsMap.has(item.stationuuid)) {
        uniqueStationsMap.set(item.stationuuid, item);
      }
    }
    
    const uniqueStations = Array.from(uniqueStationsMap.values());
    
    // Shuffle the combined list so we get a good mix of the tags
    uniqueStations.sort(() => 0.5 - Math.random());
    
    // Map raw data to our Station model
    return uniqueStations.map((item: any) => ({
      id: item.stationuuid,
      name: item.name.trim() || 'Unknown Station',
      streamUrl: item.url_resolved,
      faviconUrl: item.favicon,
      tags: item.tags ? item.tags.split(',') : [],
      isLive: true // Radio Browser stations are streams
    }));
  }

  // Search stations with filters
  async searchStations(params: { name?: string; tag?: string; country?: string; language?: string; limit?: number }): Promise<Station[]> {
    const mirror = await this.getHealthyMirror();
    
    let url = `${mirror}/json/stations/search?order=clickcount&reverse=true&limit=${params.limit || 40}&hidebroken=true`;
    
    if (params.name && params.name.trim()) {
      url += `&name=${encodeURIComponent(params.name.trim())}`;
    }
    if (params.tag && params.tag !== 'All') {
      url += `&tag=${encodeURIComponent(params.tag)}`;
    }
    if (params.country && params.country !== 'All') {
      url += `&country=${encodeURIComponent(params.country)}`;
    }
    if (params.language && params.language !== 'All') {
      url += `&language=${encodeURIComponent(params.language)}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) return [];
      const stations = await response.json();
      
      return stations.map((item: any) => ({
        id: item.stationuuid,
        name: item.name.trim() || 'Unknown Station',
        streamUrl: item.url_resolved,
        faviconUrl: item.favicon,
        tags: item.tags ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
        isLive: true
      }));
    } catch (e) {
      console.error("Failed to search stations", e);
      return [];
    }
  }

  // Fetch popular genre tags
  async getTopTags(limit = 40): Promise<string[]> {
    try {
      const mirror = await this.getHealthyMirror();
      const response = await fetch(`${mirror}/json/tags?order=stationcount&reverse=true&limit=${limit}`);
      if (!response.ok) return [];
      const tags = await response.json();
      return tags.map((t: any) => t.name).filter((name: string) => name && name.trim().length > 1);
    } catch (e) {
      console.error("Failed to fetch top tags", e);
      return [];
    }
  }

  // Fetch top countries
  async getTopCountries(limit = 30): Promise<{ name: string; code?: string }[]> {
    try {
      const mirror = await this.getHealthyMirror();
      const response = await fetch(`${mirror}/json/countries?order=stationcount&reverse=true&limit=${limit}`);
      if (!response.ok) return [];
      const countries = await response.json();
      return countries.map((c: any) => ({
        name: c.name,
        code: c.iso_3166_1 || c.code || ''
      })).filter((c: any) => c.name && c.name.trim());
    } catch (e) {
      console.error("Failed to fetch top countries", e);
      return [];
    }
  }

  // Fetch top languages
  async getTopLanguages(limit = 20): Promise<string[]> {
    try {
      const mirror = await this.getHealthyMirror();
      const response = await fetch(`${mirror}/json/languages?order=stationcount&reverse=true&limit=${limit}`);
      if (!response.ok) return [];
      const languages = await response.json();
      return languages.map((l: any) => l.name).filter((name: string) => name && name.trim());
    } catch (e) {
      console.error("Failed to fetch top languages", e);
      return [];
    }
  }
}

export const radioBrowserService = new RadioBrowserService();
