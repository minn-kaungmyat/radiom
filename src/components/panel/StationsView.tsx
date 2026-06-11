import React, { useEffect } from 'react';
import { Search, Loader, Music } from '../icons';
import { useStationStore } from '../../stores/stationStore';
import { CHANNELS } from '../../domain/constants/channels';
import { GENRE_KEYWORDS } from '../../utils/tagUtils';
import { CuratedChannelList } from '../station/CuratedChannelList';
import { StationSearchFilters } from '../station/StationSearchFilters';
import { StationItem } from '../station/StationItem';

export const StationsView = () => {
  const searchQuery = useStationStore((state) => state.searchQuery);
  const setSearchQuery = useStationStore((state) => state.setSearchQuery);
  const selectedGenre = useStationStore((state) => state.selectedGenre);
  const selectedCountry = useStationStore((state) => state.selectedCountry);
  const selectedLanguage = useStationStore((state) => state.selectedLanguage);

  const searchResults = useStationStore((state) => state.searchResults);
  const isLoadingSearch = useStationStore((state) => state.isLoadingSearch);
  const searchError = useStationStore((state) => state.searchError);

  const clearFilters = useStationStore((state) => state.clearFilters);
  const executeSearch = useStationStore((state) => state.executeSearch);
  const fetchFilters = useStationStore((state) => state.fetchFilters);

  const browseTab = useStationStore((state) => state.browseTab);
  const setBrowseTab = useStationStore((state) => state.setBrowseTab);

  // Load filters and execute initial search
  useEffect(() => {
    fetchFilters();
    if (searchResults.length === 0) {
      executeSearch();
    }
  }, [fetchFilters, executeSearch]);

  // Deduplicate search results (filter out any public stations that match a curated station's streamUrl)
  // and filter by selected genre to ensure high relevance
  const filteredPublicStations = searchResults.filter((station) => {
    // 1. Deduplicate curated
    const isCurated = CHANNELS.some((channel) =>
      channel.stations.some((curated) => curated.streamUrl === station.streamUrl)
    );
    if (isCurated) return false;

    // 2. Filter by genre keywords if a specific genre filter is active
    if (selectedGenre && selectedGenre !== 'All') {
      const key = selectedGenre.toLowerCase();
      const keywords = GENRE_KEYWORDS[key] || [key];
      const hasMatchingTag = station.tags?.some((tag: string) => {
        const t = tag.toLowerCase();
        return keywords.some(keyword => t.includes(keyword));
      });
      if (!hasMatchingTag) return false;
    }

    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden', marginTop: "-0.7rem" }}>
      {/* Sub Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255, 255, 255, 0.05)', marginBottom: '1rem', paddingBottom: '2px' }}>
        <button
          onClick={() => setBrowseTab('curated')}
          type="button"
          style={{
            flex: 1,
            padding: '8px 0',
            minHeight: '44px',
            background: 'transparent',
            border: 'none',
            borderBottom: browseTab === 'curated' ? '2px solid var(--color-text)' : '2px solid transparent',
            color: browseTab === 'curated' ? 'var(--color-text)' : 'var(--color-text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Music size={14} /> Curated
        </button>
        <button
          onClick={() => setBrowseTab('public')}
          type="button"
          style={{
            flex: 1,
            padding: '8px 0',
            minHeight: '44px',
            background: 'transparent',
            border: 'none',
            borderBottom: browseTab === 'public' ? '2px solid var(--color-text)' : '2px solid transparent',
            color: browseTab === 'public' ? 'var(--color-text)' : 'var(--color-text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <Search size={14} /> Search
        </button>
      </div>

      {browseTab === 'curated' ? (
        /* Curated accordion view */
        <CuratedChannelList />
      ) : (
        /* Public Search View with Pinned Filters and Independent Scroll results list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Pinned Filter Section */}
          <StationSearchFilters />

          {/* Independent Scroll Results Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 2px 0', flexShrink: 0 }}>
              <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Search size={13} /> Public Stations
              </h4>
              {(selectedGenre !== 'All' || selectedCountry !== 'All' || selectedLanguage !== 'All' || searchQuery !== '') && (
                <button
                  onClick={() => {
                    clearFilters();
                    setSearchQuery('');
                    setTimeout(() => executeSearch(), 0);
                  }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline', minHeight: '44px', padding: '0 8px' }}
                >
                  Clear filters
                </button>
              )}
            </div>

            {isLoadingSearch ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '3rem 0', flex: 1 }}>
                <Loader className="animate-spin" size={24} style={{ animation: 'spin 1s linear infinite', color: 'var(--color-text-muted)' }} />
              </div>
            ) : searchError ? (
              <div style={{ color: '#ff6b6b', fontSize: '0.8rem', padding: '1rem', textAlign: 'center' }}>
                {searchError}
              </div>
            ) : filteredPublicStations.length === 0 ? (
              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', padding: '2rem 1rem', textAlign: 'center' }}>
                No public stations found. Adjust search query or filters.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {filteredPublicStations.map((station) => (
                  <StationItem key={station.id} station={station} isCurated={false} selectedGenre={selectedGenre} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
