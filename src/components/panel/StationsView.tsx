import React, { useState, useEffect } from 'react';
import { Search, Heart, HeartFilled, Play, Loader, Globe, Languages, Music, ChevronDown, ChevronRight } from '../icons';
import { useStationStore } from '../../stores/stationStore';
import { usePlayerStore } from '../../stores/playerStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { CHANNELS } from '../../domain/constants/channels';
import { getChannelIcon } from '../station/ChannelList';
import { cleanAndPrioritizeTags, GENRE_KEYWORDS } from '../../utils/tagUtils';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { CustomSelect } from '../ui/CustomSelect';

export const StationsView = () => {
  const searchQuery = useStationStore((state) => state.searchQuery);
  const setSearchQuery = useStationStore((state) => state.setSearchQuery);
  const selectedGenre = useStationStore((state) => state.selectedGenre);
  const selectedCountry = useStationStore((state) => state.selectedCountry);
  const selectedLanguage = useStationStore((state) => state.selectedLanguage);

  const searchResults = useStationStore((state) => state.searchResults);
  const isLoadingSearch = useStationStore((state) => state.isLoadingSearch);
  const searchError = useStationStore((state) => state.searchError);

  const availableCountries = useStationStore((state) => state.availableCountries);
  const availableLanguages = useStationStore((state) => state.availableLanguages);

  const setFilter = useStationStore((state) => state.setFilter);
  const clearFilters = useStationStore((state) => state.clearFilters);
  const executeSearch = useStationStore((state) => state.executeSearch);
  const fetchFilters = useStationStore((state) => state.fetchFilters);

  const setStation = usePlayerStore((state) => state.setStation);
  const setChannel = usePlayerStore((state) => state.setChannel);
  const currentStation = usePlayerStore((state) => state.currentStation);
  const currentChannel = usePlayerStore((state) => state.currentChannel);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const play = usePlayerStore((state) => state.play);
  const pause = usePlayerStore((state) => state.pause);

  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const favorites = useFavoritesStore((state) => state.favorites);

  const browseTab = useStationStore((state) => state.browseTab);
  const setBrowseTab = useStationStore((state) => state.setBrowseTab);

  // Collapsible accordion state for channels (only one expanded at a time)
  const [expandedChannelId, setExpandedChannelId] = useState<string | null>(null);

  // Auto-expand playing station/channel folder
  useEffect(() => {
    if (currentChannel) {
      setExpandedChannelId(currentChannel.id);
    } else if (currentStation) {
      const ownerChannel = CHANNELS.find(c => c.stations.some(s => s.id === currentStation.id));
      if (ownerChannel) {
        setExpandedChannelId(ownerChannel.id);
      }
    }
  }, [currentStation, currentChannel]);

  // Load filters and execute initial search
  useEffect(() => {
    fetchFilters();
    if (searchResults.length === 0) {
      executeSearch();
    }
  }, [fetchFilters, executeSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleGenreClick = (genre: string) => {
    setFilter('genre', genre);
    setTimeout(() => executeSearch(), 0);
  };

  // Curated study-oriented genres for focus
  const displayGenres = ['All', 'Lo-Fi', 'Ambient', 'Jazz', 'Classical', 'Synthwave', 'Indie', 'Pop', 'Chill'];

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


  const renderStationItem = (station: any, isCurated: boolean) => {
    const isPlayingStation = currentStation?.id === station.id;
    const isFav = favorites.some((f) => f.id === station.id);

    const handlePlayClick = () => {
      if (isCurated) {
        const ownerChannel = CHANNELS.find(c => c.stations.some(s => s.id === station.id));
        if (ownerChannel) {
          setChannel(ownerChannel);
        } else {
          setChannel(null);
        }
      } else {
        setChannel(null);
      }
      setStation(station);

      if (isPlayingStation) {
        if (isPlaying) pause(); else play();
      }
    };

    return (
      <Card
        key={station.id}
        isActive={isPlayingStation}
        isCompact={isCurated}
        onClick={handlePlayClick}
        image={
          station.faviconUrl ? (
            <img
              src={station.faviconUrl}
              alt=""
              style={{ width: isCurated ? '16px' : '20px', height: isCurated ? '16px' : '20px', borderRadius: '4px', objectFit: 'cover', imageRendering: 'pixelated' }}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <Music size={isCurated ? 12 : 14} color="var(--color-text-muted)" />
          )
        }
        title={station.name}
        subtitle={
          !isCurated ? (cleanAndPrioritizeTags(station.tags, 3, selectedGenre).join(' • ') || 'Live Stream') : undefined
        }
        actionButton={
          <div className="flex-center" style={{ gap: '4px', marginLeft: '6px' }}>
            <button
              onClick={(e) => { e.stopPropagation(); isFav ? removeFavorite(station.id) : addFavorite(station); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: isFav ? '#ff4b4b' : 'var(--color-text-muted)',
                cursor: 'pointer',
                padding: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => { if (!isFav) e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={(e) => { if (!isFav) e.currentTarget.style.color = 'var(--color-text-muted)'; }}
            >
              {isFav ? <HeartFilled size={isCurated ? 12 : 14} color="#ff4b4b" /> : <Heart size={isCurated ? 12 : 14} color="var(--color-text-muted)" />}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handlePlayClick(); }}
              style={{
                background: isPlayingStation ? 'var(--color-text)' : 'rgba(255,255,255,0.06)',
                border: 'none',
                borderRadius: '50%',
                width: isCurated ? '24px' : '26px',
                height: isCurated ? '24px' : '26px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isPlayingStation ? 'var(--color-bg)' : 'var(--color-text)',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isPlayingStation && isPlaying ? (
                <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                  <span style={{ width: '2px', height: isCurated ? '6px' : '8px', background: 'currentColor', borderRadius: '1px' }} />
                  <span style={{ width: '2px', height: isCurated ? '6px' : '8px', background: 'currentColor', borderRadius: '1px' }} />
                </div>
              ) : (
                <Play size={isCurated ? 8 : 10} fill="currentColor" style={{ marginLeft: isPlayingStation ? '0' : '1px' }} />
              )}
            </button>
          </div>
        }
      />
    );
  };

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto', }}>
          {CHANNELS.map(channel => {
            const isExpanded = expandedChannelId === channel.id;
            const isChannelPlaying = currentChannel?.id === channel.id;

            return (
              <div
                key={channel.id}
                style={{
                  borderRadius: '16px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: isChannelPlaying ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(255,255,255,0.03)',
                  overflow: 'hidden',
                  transition: 'border-color 0.2s',
                  flexShrink: 0
                }}
              >
                <button
                  onClick={() => {
                    setExpandedChannelId(prevId => prevId === channel.id ? null : channel.id);
                  }}
                  type="button"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--color-text)',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: isChannelPlaying ? 'var(--color-text)' : 'rgba(255,255,255,0.05)',
                      color: isChannelPlaying ? 'var(--color-bg)' : 'var(--color-text)',
                      flexShrink: 0
                    }}>
                      {getChannelIcon(channel.icon, 16)}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {channel.name}
                        {isChannelPlaying && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--color-text)' }} />}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {channel.description}
                      </div>
                    </div>
                  </div>
                  <div style={{ color: 'var(--color-text-muted)', marginLeft: '8px', flexShrink: 0 }}>
                    {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </div>
                </button>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateRows: isExpanded ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    background: 'rgba(0,0,0,0.15)',
                    borderTop: isExpanded ? '1px solid rgba(255, 255, 255, 0.04)' : '1px solid transparent',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ minHeight: 0 }}>
                    <div style={{
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}>
                      {channel.stations.map(station => renderStationItem(station, true))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Public Search View with Pinned Filters and Independent Scroll results list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          {/* Pinned Filter Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flexShrink: 0 }}>
            {/* Search Input Form */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stations..."
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 38px',
                    borderRadius: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    color: 'var(--color-text)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.2)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.05)'}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '0 1rem',
                  borderRadius: '12px',
                  background: 'var(--color-text)',
                  color: 'var(--color-bg)',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </form>

            {/* Advanced Select Dropdowns */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {/* Country Selector */}
              <div style={{ flex: 1 }}>
                <CustomSelect
                  options={[
                    { value: 'All', label: 'All Countries' },
                    ...availableCountries.map(c => ({ value: c.name, label: c.name }))
                  ]}
                  value={selectedCountry}
                  onChange={(value) => {
                    setFilter('country', value);
                    setTimeout(() => executeSearch(), 0);
                  }}
                  icon={<Globe size={12} color="var(--color-text-muted)" />}
                  searchable
                />
              </div>

              {/* Language Selector */}
              <div style={{ flex: 1 }}>
                <CustomSelect
                  options={[
                    { value: 'All', label: 'All Languages' },
                    ...availableLanguages.map(l => ({ value: l, label: l.charAt(0).toUpperCase() + l.slice(1) }))
                  ]}
                  value={selectedLanguage}
                  onChange={(value) => {
                    setFilter('language', value);
                    setTimeout(() => executeSearch(), 0);
                  }}
                  icon={<Languages size={12} color="var(--color-text-muted)" />}
                  searchable
                />
              </div>
            </div>

            {/* Genre Filter Tags */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {displayGenres.map((g) => {
                const isSelected = selectedGenre === g;
                return (
                  <Badge
                    key={g}
                    isActive={isSelected}
                    interactive={true}
                    onClick={() => handleGenreClick(g)}
                  >
                    {g}
                  </Badge>
                );
              })}
            </div>
          </div>

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
                  style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline' }}
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
                {filteredPublicStations.map((station) => renderStationItem(station, false))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
