import { useState, useCallback } from 'react';
import type { Channel } from '../../domain/models/Channel';
import type { Station } from '../../domain/models/Station';
import { radioBrowserService } from './radio-browser.service';

export const useChannelStations = (channel: Channel | null) => {
  const [prevChannelId, setPrevChannelId] = useState<string | null>(null);
  const [stations, setStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasFetchedApi, setHasFetchedApi] = useState(false);

  // Synchronously reset stations when channel changes
  const channelId = channel?.id || null;
  if (channelId !== prevChannelId) {
    setPrevChannelId(channelId);
    setStations(channel ? channel.stations : []);
    setHasFetchedApi(false);
  }

  // Dynamically fetch from Radio Browser if user exhausts curated list
  const fetchMore = useCallback(async (): Promise<Station[]> => {
    if (!channel || hasFetchedApi) return stations;
    
    setIsLoading(true);
    try {
      const apiStations = await radioBrowserService.getStationsByTags(channel.tags);
      
      // Filter out any API stations that are already in our curated list
      const newStations = apiStations.filter(apiS => 
        !channel.stations.some(curatedS => curatedS.streamUrl === apiS.streamUrl)
      );
      
      const updatedList = [...channel.stations, ...newStations];
      setStations(updatedList);
      setHasFetchedApi(true);
      return updatedList;
    } catch (e) {
      console.error("Failed to fetch more stations", e);
      return stations;
    } finally {
      setIsLoading(false);
    }
  }, [channel, hasFetchedApi, stations]);

  return { stations, fetchMore, isFetchingMore: isLoading };
};
