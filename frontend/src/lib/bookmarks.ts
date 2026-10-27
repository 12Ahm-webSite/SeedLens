export interface SavedBookmark {
  id: string;
  seed: string;
  version: string;
  edition: 'java' | 'bedrock';
  savedAt: string;
  notes?: string;
  highlight?: string;
  scenicScore?: number;
  buildingScore?: number;
  clusterCount?: number;
}

const STORAGE_KEY = 'seedlens_saved_bookmarks';

export function getBookmarks(): SavedBookmark[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to load bookmarks:', err);
    return [];
  }
}

export function saveBookmark(item: {
  seed: string;
  version: string;
  edition: 'java' | 'bedrock';
  notes?: string;
  highlight?: string;
  scenicScore?: number;
  buildingScore?: number;
  clusterCount?: number;
}): SavedBookmark {
  const current = getBookmarks();
  // Check if seed already exists
  const existingIdx = current.findIndex((b) => b.seed.trim() === item.seed.trim());
  const entry: SavedBookmark = {
    id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    seed: item.seed.trim(),
    version: item.version,
    edition: item.edition,
    savedAt: new Date().toISOString(),
    notes: item.notes,
    highlight: item.highlight,
    scenicScore: item.scenicScore,
    buildingScore: item.buildingScore,
    clusterCount: item.clusterCount,
  };

  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...entry, id: current[existingIdx].id };
  } else {
    current.unshift(entry);
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (err) {
    console.error('Failed to save bookmarks:', err);
  }
  return entry;
}

export function removeBookmark(seedOrId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const current = getBookmarks();
    const filtered = current.filter(
      (b) => b.id !== seedOrId && b.seed.trim() !== seedOrId.trim()
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (err) {
    console.error('Failed to remove bookmark:', err);
    return false;
  }
}

export function isBookmarked(seed: string): boolean {
  if (!seed || typeof window === 'undefined') return false;
  const current = getBookmarks();
  return current.some((b) => b.seed.trim() === seed.trim());
}

export function exportBookmarksJson(): void {
  const data = getBookmarks();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const anchor = document.createElement('a');
  anchor.setAttribute('href', dataStr);
  anchor.setAttribute('download', `seedlens-bookmarks-${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function importBookmarksJson(jsonStr: string): number {
  try {
    const parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) return 0;
    const current = getBookmarks();
    let importedCount = 0;

    for (const item of parsed) {
      if (item && item.seed) {
        const seedStr = String(item.seed).trim();
        if (!current.some((b) => b.seed === seedStr)) {
          current.unshift({
            id: item.id || `bm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            seed: seedStr,
            version: item.version || '1.20.6',
            edition: item.edition === 'bedrock' ? 'bedrock' : 'java',
            savedAt: item.savedAt || new Date().toISOString(),
            notes: item.notes,
            highlight: item.highlight,
            scenicScore: item.scenicScore,
            buildingScore: item.buildingScore,
            clusterCount: item.clusterCount,
          });
          importedCount++;
        }
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
    return importedCount;
  } catch (err) {
    console.error('Failed to parse bookmarks import:', err);
    return 0;
  }
}
