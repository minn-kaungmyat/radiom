import React from 'react';
import { Search, Globe, Languages } from '../icons';
import { useStationStore } from '../../stores/stationStore';
import { CustomSelect } from '../ui/CustomSelect';
import { Badge } from '../ui/Badge';

export const StationSearchFilters = () => {
  const searchQuery = useStationStore((state) => state.searchQuery);
  const setSearchQuery = useStationStore((state) => state.setSearchQuery);
  const selectedGenre = useStationStore((state) => state.selectedGenre);
  const selectedCountry = useStationStore((state) => state.selectedCountry);
  const selectedLanguage = useStationStore((state) => state.selectedLanguage);

  const availableCountries = useStationStore((state) => state.availableCountries);
  const availableLanguages = useStationStore((state) => state.availableLanguages);

  const setFilter = useStationStore((state) => state.setFilter);
  const executeSearch = useStationStore((state) => state.executeSearch);

  // Curated study-oriented genres for focus
  const displayGenres = ['All', 'Lo-Fi', 'Ambient', 'Jazz', 'Classical', 'Synthwave', 'Indie', 'Pop', 'Chill'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  const handleGenreClick = (genre: string) => {
    setFilter('genre', genre);
    setTimeout(() => executeSearch(), 0);
  };

  return (
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
              transition: 'border-color 0.2s',
              minHeight: '44px',
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
            cursor: 'pointer',
            minHeight: '44px',
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
  );
};
