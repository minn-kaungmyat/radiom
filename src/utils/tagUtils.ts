export const GENRE_KEYWORDS: Record<string, string[]> = {
  'lo-fi': ['lo-fi', 'lofi', 'chillhop', 'lo fi', 'lo_fi'],
  'ambient': ['ambient', 'drone', 'meditation', 'space', 'atmosphere', 'soundscape', 'relaxing'],
  'jazz': ['jazz', 'bossa', 'swing', 'bebop'],
  'classical': ['classical', 'piano', 'violin', 'orchestra', 'symphony', 'baroque', 'mozart', 'bach', 'beethoven'],
  'synthwave': ['synthwave', 'retrowave', 'outrun', 'cyberpunk', 'vaporwave', 'synth'],
  'indie': ['indie', 'alternative', 'folk'],
  'pop': ['pop', 'hits', 'top40', 'top 40', 'chart'],
  'chill': ['chill', 'chillout', 'downtempo', 'lounge', 'relax', 'ambient']
};

export const cleanAndPrioritizeTags = (
  tags: string[] | undefined,
  limit = 3,
  activeGenre?: string,
  activeChannelTags?: string[]
): string[] => {
  if (!tags || tags.length === 0) return [];

  // 1. Clean and normalize tags (trim, lowercase, non-empty)
  let cleaned = tags.map(t => t.trim().toLowerCase()).filter(Boolean);

  // Deduplicate case-insensitively
  cleaned = Array.from(new Set(cleaned));

  // If both "lo-fi" and "lofi" exist, remove "lofi" to avoid redundancy
  if (cleaned.includes('lo-fi') && cleaned.includes('lofi')) {
    cleaned = cleaned.filter(t => t !== 'lofi');
  }
  if (cleaned.includes('lo fi') && cleaned.includes('lo-fi')) {
    cleaned = cleaned.filter(t => t !== 'lo fi');
  }

  // 2. Identify match priority
  const priorityKeywords = new Set<string>();

  // Add active genre keywords if provided
  if (activeGenre && activeGenre !== 'All') {
    const key = activeGenre.toLowerCase();
    const keywords = GENRE_KEYWORDS[key] || [key];
    keywords.forEach(k => priorityKeywords.add(k));
  }

  // Add active channel tags if provided
  if (activeChannelTags && activeChannelTags.length > 0) {
    activeChannelTags.forEach(t => priorityKeywords.add(t.toLowerCase()));
  }

  // Fallback: If no priorities, add general genre keywords to the priority set
  // so that core genres always bubble to the top
  if (priorityKeywords.size === 0) {
    const coreGenres = ['lo-fi', 'lofi', 'ambient', 'jazz', 'classical', 'synthwave', 'indie', 'pop', 'chill'];
    coreGenres.forEach(g => priorityKeywords.add(g));
  }

  // Sort: tags containing priority keywords go first
  const priorityList = cleaned.filter(t => 
    Array.from(priorityKeywords).some(k => t.includes(k))
  );
  const regularList = cleaned.filter(t => 
    !Array.from(priorityKeywords).some(k => t.includes(k))
  );

  const combined = [...priorityList, ...regularList];
  
  return combined
    .map(t => {
      // Capitalize first letter of each word or keep standard format
      if (t === 'lo-fi') return 'Lo-Fi';
      if (t === 'lofi') return 'Lo-Fi';
      return t.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    })
    .slice(0, limit);
};
