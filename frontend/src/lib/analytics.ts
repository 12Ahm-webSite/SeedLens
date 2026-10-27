import fs from 'fs';
import path from 'path';

export interface AnalyticsEvent {
  id: string;
  timestamp: string;
  type: 'visit' | 'analyze' | 'find';
  details: string;
  version?: string;
  edition?: string;
  latency_ms?: number;
}

export interface AnalyticsData {
  total_visits: number;
  unique_visitors: number;
  visitor_hashes: Record<string, string>; // hash -> first_seen
  seeds_analyzed: number;
  seeds_found: number;
  editions: {
    java: number;
    bedrock: number;
  };
  versions: Record<string, number>;
  daily_activity: Record<string, { visits: number; analyses: number; finds: number }>;
  recent_events: AnalyticsEvent[];
  last_updated: string;
}

function getStoragePath(): string {
  if (process.env.ANALYTICS_DIR) {
    const customDir = process.env.ANALYTICS_DIR;
    if (!fs.existsSync(/*turbopackIgnore: true*/ customDir)) {
      try {
        fs.mkdirSync(customDir, { recursive: true });
      } catch {
        // Fall back to default if custom directory cannot be created
      }
    }
    return path.join(customDir, 'analytics.json');
  }

  const possiblePaths = [
    path.join(process.cwd(), 'data/analytics.json'),
    path.join(process.cwd(), 'frontend/data/analytics.json'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(/*turbopackIgnore: true*/ p)) return p;
  }

  // Fallback to first path and ensure directory exists
  const target = possiblePaths[0];
  const dir = path.dirname(target);
  if (!fs.existsSync(/*turbopackIgnore: true*/ dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return target;
}

function getInitialData(): AnalyticsData {
  return {
    total_visits: 0,
    unique_visitors: 0,
    visitor_hashes: {},
    seeds_analyzed: 0,
    seeds_found: 0,
    editions: {
      java: 0,
      bedrock: 0,
    },
    versions: {},
    daily_activity: {},
    recent_events: [],
    last_updated: new Date().toISOString(),
  };
}

export function resetAnalytics(): AnalyticsData {
  const fresh = getInitialData();
  saveAnalytics(fresh);
  return fresh;
}

export function getAnalytics(): AnalyticsData {
  const filePath = getStoragePath();
  try {
    if (fs.existsSync(/*turbopackIgnore: true*/ filePath)) {
      const content = fs.readFileSync(/*turbopackIgnore: true*/ filePath, 'utf-8');
      const parsed = JSON.parse(content) as AnalyticsData;
      return parsed;
    }
  } catch (err) {
    console.error('Failed to read analytics:', err);
  }

  const initial = getInitialData();
  saveAnalytics(initial);
  return initial;
}

export function saveAnalytics(data: AnalyticsData): void {
  const filePath = getStoragePath();
  try {
    data.last_updated = new Date().toISOString();
    const tempPath = `${filePath}.tmp`;
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempPath, filePath);
  } catch (err) {
    console.error('Failed to save analytics:', err);
  }
}

export function recordVisit(visitorHash?: string, metadata?: { edition?: string }): void {
  const data = getAnalytics();
  const today = new Date().toISOString().split('T')[0];

  data.total_visits = (data.total_visits || 0) + 1;

  if (visitorHash) {
    if (!data.visitor_hashes) data.visitor_hashes = {};
    if (!data.visitor_hashes[visitorHash]) {
      data.visitor_hashes[visitorHash] = new Date().toISOString();
      data.unique_visitors = (data.unique_visitors || 0) + 1;
    }
  } else {
    data.unique_visitors = (data.unique_visitors || 0) + 1;
  }

  if (metadata?.edition === 'bedrock') {
    data.editions.bedrock = (data.editions.bedrock || 0) + 1;
  } else {
    data.editions.java = (data.editions.java || 0) + 1;
  }

  if (!data.daily_activity) data.daily_activity = {};
  if (!data.daily_activity[today]) {
    data.daily_activity[today] = { visits: 0, analyses: 0, finds: 0 };
  }
  data.daily_activity[today].visits += 1;

  // Add event
  const event: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    type: 'visit',
    details: 'User loaded SeedLens main app',
    edition: metadata?.edition || 'java',
    latency_ms: 1,
  };

  if (!data.recent_events) data.recent_events = [];
  data.recent_events.unshift(event);
  if (data.recent_events.length > 30) data.recent_events.pop();

  saveAnalytics(data);
}

export function recordAnalyze(
  seed: string,
  version: string = '1.20.6',
  edition: string = 'java',
  latencyMs: number = 12
): void {
  const data = getAnalytics();
  const today = new Date().toISOString().split('T')[0];

  data.seeds_analyzed = (data.seeds_analyzed || 0) + 1;

  if (edition === 'bedrock') {
    data.editions.bedrock = (data.editions.bedrock || 0) + 1;
  } else {
    data.editions.java = (data.editions.java || 0) + 1;
  }

  if (!data.versions) data.versions = {};
  data.versions[version] = (data.versions[version] || 0) + 1;

  if (!data.daily_activity) data.daily_activity = {};
  if (!data.daily_activity[today]) {
    data.daily_activity[today] = { visits: 0, analyses: 0, finds: 0 };
  }
  data.daily_activity[today].analyses += 1;

  const event: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    type: 'analyze',
    details: `Analyzed seed ${seed.length > 16 ? seed.substring(0, 16) + '...' : seed}`,
    version,
    edition,
    latency_ms: latencyMs,
  };

  if (!data.recent_events) data.recent_events = [];
  data.recent_events.unshift(event);
  if (data.recent_events.length > 30) data.recent_events.pop();

  saveAnalytics(data);
}

export function recordFind(
  preset: string,
  version: string = '1.21.4',
  matchedSeed: string = '',
  latencyMs: number = 35
): void {
  const data = getAnalytics();
  const today = new Date().toISOString().split('T')[0];

  data.seeds_found = (data.seeds_found || 0) + 1;

  if (!data.versions) data.versions = {};
  data.versions[version] = (data.versions[version] || 0) + 1;

  if (!data.daily_activity) data.daily_activity = {};
  if (!data.daily_activity[today]) {
    data.daily_activity[today] = { visits: 0, analyses: 0, finds: 0 };
  }
  data.daily_activity[today].finds += 1;

  const event: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: new Date().toISOString(),
    type: 'find',
    details: `Reverse search [${preset}] -> Seed ${matchedSeed}`,
    version,
    edition: 'java',
    latency_ms: latencyMs,
  };

  if (!data.recent_events) data.recent_events = [];
  data.recent_events.unshift(event);
  if (data.recent_events.length > 30) data.recent_events.pop();

  saveAnalytics(data);
}
