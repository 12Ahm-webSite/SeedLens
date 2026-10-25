'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type {
  Cluster,
  SearchBounds,
  WorldSpawn,
  DiscoverySummary,
  LandmarksSummary,
  LandmarkSpot,
} from '@/types/seedlens';
import { getStructureMetadata } from '@/components/StructureBadge';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MinecraftTerrainEngine, TerrainPoint } from '@/lib/minecraftTerrain';
import { getHoverCardBanner } from '@/lib/hoverCardBanners';

interface SeedMapInnerProps {
  seed?: string | number;
  version?: string;
  edition?: 'java' | 'bedrock';
  clusters: Cluster[];
  searchBounds?: SearchBounds;
  worldSpawn?: WorldSpawn;
  discovery?: DiscoverySummary;
  landmarks?: LandmarksSummary;
  selectedClusterId?: number | null;
  onSelectCluster?: (clusterId: number) => void;
  selectedLandmarkId?: number | null;
  onSelectLandmark?: (landmarkId: number) => void;
  className?: string;
}

// Convert Minecraft (x, z) to Leaflet CRS.Simple (lat, lng)
function mcToLatLng(x: number, z: number): L.LatLngTuple {
  return [-z, x];
}

function latLngToMc(lat: number, lng: number): { x: number; z: number } {
  return {
    x: Math.round(lng),
    z: Math.round(-lat),
  };
}

function getLandmarkIconHtml(category: string): string {
  let bg = '#10B981';
  let border = '#34D399';
  let symbol = '🏔️';

  if (category === 'cherry_caldera' || category === 'cherry_grove') {
    bg = '#BE185D';
    border = '#F472B6';
    symbol = '🌸';
  } else if (category === 'epic_clifftop') {
    bg = '#6B21A8';
    border = '#C084FC';
    symbol = '📷';
  } else if (category === 'prime_building_basin') {
    bg = '#B45309';
    border = '#FBBF24';
    symbol = '🏰';
  } else if (category === 'isolated_island') {
    bg = '#0369A1';
    border = '#38BDF8';
    symbol = '🏝️';
  } else if (category === 'pale_garden') {
    bg = '#334155';
    border = '#94A3B8';
    symbol = '🌲';
  }

  return `
    <div style="
      width:24px; height:24px;
      background:${bg}; border:2px solid ${border};
      border-radius:4px;
      box-shadow:0 0 6px ${border}, 1px 1px 0 #000;
      display:flex; align-items:center; justify-content:center;
      cursor:pointer; font-size:12px;
    ">
      <span>${symbol}</span>
    </div>
  `;
}

function getStructureIconHtml(type: string): string {
  const norm = type.toLowerCase();
  if (norm.includes('village')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#C69176; border:1.5px solid #4A2F1B;
        box-shadow:1px 1px 0 #000;
        display:flex; flex-direction:column; align-items:center;
        overflow:hidden; cursor:pointer;
      ">
        <div style="width:100%; height:4px; background:#4A2F1B;"></div>
        <div style="display:flex; justify-content:space-between; width:14px; margin-top:2px;">
          <div style="width:3px; height:3px; background:#2D6928;"></div>
          <div style="width:3px; height:3px; background:#2D6928;"></div>
        </div>
        <div style="width:5px; height:6px; background:#A36C53; margin-top:1px; border:0.5px solid #4A2F1B;"></div>
      </div>
    `;
  }
  if (norm.includes('ancient') || norm.includes('city')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#07141B; border:1.5px solid #00F0FF;
        box-shadow:0 0 6px rgba(0,240,255,0.7);
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#00F0FF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="11" r="1.5" fill="#00F0FF"/>
          <circle cx="15" cy="11" r="1.5" fill="#00F0FF"/>
          <path d="M12 2a9 9 0 0 0-9 9c0 3.6 2 6.7 5 8.2V22h8v-2.8c3-1.5 5-4.6 5-8.2a9 9 0 0 0-9-9z"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('shipwreck') || norm.includes('ocean')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#0A1F33; border:1.5px solid #38BDF8;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="5" r="3"/>
          <line x1="12" y1="22" x2="12" y2="8"/>
          <path d="M5 12H2a10 10 0 0 0 20 0h-3"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('pyramid') || norm.includes('desert')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#261B05; border:1.5px solid #FBBF24;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M2.5 19.5 12 4l9.5 15.5H2.5Z"/>
          <path d="m12 4-3.5 15.5"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('outpost')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#450A0A; border:1.5px solid #EF4444;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('monument')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#082F49; border:1.5px solid #0EA5E9;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0EA5E9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('mansion')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#271206; border:1.5px solid #F59E0B;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2"/>
          <path d="M3 9h18"/>
          <path d="M9 21V9"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('trail') || norm.includes('ruin')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#3B1705; border:1.5px solid #F97316;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="22" x2="21" y2="22"/>
          <line x1="6" y1="18" x2="6" y2="11"/>
          <line x1="10" y1="18" x2="10" y2="11"/>
          <line x1="14" y1="18" x2="14" y2="11"/>
          <line x1="18" y1="18" x2="18" y2="11"/>
          <polygon points="12 2 20 7 4 7"/>
        </svg>
      </div>
    `;
  }
  if (norm.includes('trial') || norm.includes('chamber')) {
    return `
      <div style="
        width:22px; height:22px;
        background:#431407; border:1.5px solid #EA580C;
        box-shadow:1px 1px 0 #000;
        display:flex; align-items:center; justify-content:center;
        cursor:pointer;
      ">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EA580C" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/>
          <line x1="13" y1="19" x2="19" y2="13"/>
          <line x1="16" y1="16" x2="20" y2="20"/>
          <line x1="19" y1="21" x2="21" y2="19"/>
        </svg>
      </div>
    `;
  }
  const meta = getStructureMetadata(type);
  return `
    <div style="
      width:20px; height:20px;
      background:${meta.color}; border:2px solid #000000;
      box-shadow:1px 1px 0 #000; cursor:pointer;
      display:flex; align-items:center; justify-content:center;
    ">
      <div style="width:4px; height:4px; background:#FFFFFF;"></div>
    </div>
  `;
}

export default function SeedMapInner({
  seed,
  version = '1.20.6',
  edition = 'java',
  clusters,
  searchBounds = { min_x: -5000, max_x: 5000, min_z: -5000, max_z: 5000 },
  worldSpawn,
  discovery,
  landmarks,
  selectedClusterId,
  onSelectCluster,
  selectedLandmarkId,
  onSelectLandmark,
  className = '',
}: SeedMapInnerProps) {
  const { t, locale, translateCategory, translateStructure } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const biomeLayerRef = useRef<L.GridLayer | null>(null);
  const clusterLayersRef = useRef<Map<number, L.LayerGroup>>(new Map());
  const clusterGroupLayersRef = useRef<L.LayerGroup | null>(null);
  const structureLayersRef = useRef<L.LayerGroup | null>(null);
  const landmarksLayersRef = useRef<L.LayerGroup | null>(null);

  const [showBiomes, setShowBiomes] = useState(true);
  const [showStructures, setShowStructures] = useState(true);
  const [showLandmarks, setShowLandmarks] = useState(true);
  const [showClusters, setShowClusters] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [cursorCoords, setCursorCoords] = useState<{ x: number; z: number } | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<TerrainPoint | null>(null);

  // Initialize Minecraft procedural terrain engine with seed
  const terrainEngine = useMemo(() => {
    return new MinecraftTerrainEngine(seed ?? 0);
  }, [seed]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Create Leaflet map with CRS.Simple
    const map = L.map(mapContainerRef.current, {
      crs: L.CRS.Simple,
      minZoom: -4,
      maxZoom: 2,
      zoomControl: false,
      attributionControl: false,
    });

    mapRef.current = map;

    const bounds: L.LatLngBoundsExpression = [
      [-searchBounds.max_z, searchBounds.min_x],
      [-searchBounds.min_z, searchBounds.max_x],
    ];

    // Procedural Minecraft Terrain & Biome GridLayer
    const BiomeTileLayer = L.GridLayer.extend({
      createTile: function (
        coords: L.Coords,
        done: (error: Error | null, tile: HTMLElement) => void
      ) {
        const tile = document.createElement('canvas');
        const size = this.getTileSize();
        tile.width = size.x;
        tile.height = size.y;
        terrainEngine.renderTile(tile, coords.x, coords.y, coords.z);
        done(null, tile);
        return tile;
      },
    });

    const biomeLayer = new (BiomeTileLayer as unknown as {
      new (options: L.GridLayerOptions): L.GridLayer;
    })({
      bounds: [
        [-searchBounds.max_z, searchBounds.min_x],
        [-searchBounds.min_z, searchBounds.max_x],
      ],
      tileSize: 256,
      maxNativeZoom: 0,
      minNativeZoom: -4,
      zIndex: 1,
    });

    biomeLayerRef.current = biomeLayer;
    biomeLayer.addTo(map);

    // Coordinate grid lines (every 1000 blocks with parchment tones)
    for (let x = -4000; x <= 4000; x += 1000) {
      L.polyline(
        [
          [-searchBounds.max_z, x],
          [-searchBounds.min_z, x],
        ],
        {
          color: x === 0 ? 'rgba(91, 135, 49, 0.7)' : 'rgba(138, 118, 80, 0.35)',
          weight: x === 0 ? 2 : 1,
          dashArray: x === 0 ? undefined : '4, 6',
          interactive: false,
        }
      ).addTo(map);

      // Label at bottom
      if (x !== 0 && x % 2000 === 0) {
        const xIcon = L.divIcon({
          className: 'grid-coord-label',
          html: `<div style="font-family:monospace; font-size:10px; font-weight:bold; color:#222; background:#C6C6C6; padding:1px 4px; border:1px solid #555; box-shadow:1px 1px 0 #000; white-space:nowrap;" dir="ltr">X: ${x}</div>`,
          iconAnchor: [24, -4],
        });
        L.marker([-searchBounds.max_z + 180, x], { icon: xIcon, interactive: false }).addTo(map);
      }
    }

    for (let z = -4000; z <= 4000; z += 1000) {
      L.polyline(
        [
          [-z, searchBounds.min_x],
          [-z, searchBounds.max_x],
        ],
        {
          color: z === 0 ? 'rgba(91, 135, 49, 0.7)' : 'rgba(138, 118, 80, 0.35)',
          weight: z === 0 ? 2 : 1,
          dashArray: z === 0 ? undefined : '4, 6',
          interactive: false,
        }
      ).addTo(map);

      // Label at left
      if (z !== 0 && z % 2000 === 0) {
        const zIcon = L.divIcon({
          className: 'grid-coord-label',
          html: `<div style="font-family:monospace; font-size:10px; font-weight:bold; color:#222; background:#C6C6C6; padding:1px 4px; border:1px solid #555; box-shadow:1px 1px 0 #000; white-space:nowrap;" dir="ltr">Z: ${z}</div>`,
          iconAnchor: [-4, 8],
        });
        L.marker([-z, searchBounds.min_x + 180], { icon: zIcon, interactive: false }).addTo(map);
      }
    }

    // Search boundary rectangle
    L.rectangle(bounds, {
      color: '#5B8731',
      weight: 2,
      dashArray: '6, 6',
      fill: false,
      interactive: false,
    }).addTo(map);

    // World Origin Marker at (0, 0)
    const originIcon = L.divIcon({
      className: 'custom-origin-marker',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
          <div style="width:20px; height:20px; background:#4B5563; border:2px solid #9CA3AF; box-shadow:1px 1px 0 #000; display:flex; align-items:center; justify-content:center;">
            <div style="width:4px; height:4px; background:#FFFFFF;"></div>
          </div>
          <div style="margin-top:2px; padding:1px 4px; background:#111827; color:#E5E7EB; font-family:monospace; font-size:8px; font-weight:bold; border:1px solid #000; white-space:nowrap; box-shadow:1px 1px 0 rgba(0,0,0,0.5);">
            ORIGIN [0, 0]
          </div>
        </div>
      `,
      iconSize: [60, 36],
      iconAnchor: [30, 10],
    });

    const originMarker = L.marker([0, 0], { icon: originIcon, zIndexOffset: 950 }).addTo(map);
    originMarker.bindPopup(`
      <div style="background:#C6C6C6; color:#1E1E1E; padding:8px 10px; font-family:monospace; font-size:11px; min-width:160px; border-top:2px solid #FFF; border-left:2px solid #FFF; border-right:2px solid #555; border-bottom:2px solid #555; box-shadow:1px 1px 0 #000;">
        <div style="font-weight:bold; font-size:12px; margin-bottom:4px; color:#374151;">
          ⦿ ${t.mapOriginMarker}
        </div>
        <div style="background:#8B8B8B; color:#FFF; padding:2px 6px; border-top:1px solid #373737; border-left:1px solid #373737; border-right:1px solid #FFF; border-bottom:1px solid #FFF; font-weight:bold;" dir="ltr">
          X: 0 &nbsp;|&nbsp; Z: 0
        </div>
      </div>
    `);

    // World Spawn Marker
    const spX = worldSpawn?.x ?? 0;
    const spZ = worldSpawn?.z ?? 0;
    const spawnLat = -spZ;
    const spawnLng = spX;

    const spawnIcon = L.divIcon({
      className: 'custom-spawn-marker',
      html: `
        <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
          <div style="width:24px; height:24px; background:#C6C6C6; border:2px solid #5B8731; box-shadow:1px 1px 0 #000; display:flex; align-items:center; justify-content:center;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5B8731" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 19 21 12 17 5 21 12 2"/>
            </svg>
          </div>
          <div style="margin-top:2px; padding:1px 4px; background:#1E1E1E; color:#FADB44; font-family:monospace; font-size:9px; font-weight:bold; border:1px solid #000; white-space:nowrap; box-shadow:1px 1px 0 rgba(0,0,0,0.5);">
            SPAWN [${spX}, ${spZ}]
          </div>
        </div>
      `,
      iconSize: [68, 40],
      iconAnchor: [34, 12],
    });

    const spawnMarker = L.marker([spawnLat, spawnLng], { icon: spawnIcon, zIndexOffset: 1000 }).addTo(map);
    spawnMarker.bindPopup(`
      <div style="background:#C6C6C6; color:#1E1E1E; padding:8px 10px; font-family:monospace; font-size:11px; min-width:160px; border-top:2px solid #FFF; border-left:2px solid #FFF; border-right:2px solid #555; border-bottom:2px solid #555; box-shadow:1px 1px 0 #000;">
        <div style="font-weight:bold; font-size:12px; margin-bottom:4px; color:#5B8731;">
          ★ ${t.mapSpawnMarker}
        </div>
        <div style="background:#8B8B8B; color:#FFF; padding:2px 6px; border-top:1px solid #373737; border-left:1px solid #373737; border-right:1px solid #FFF; border-bottom:1px solid #FFF; font-weight:bold;" dir="ltr">
          X: ${spX} &nbsp;|&nbsp; Z: ${spZ}
        </div>
      </div>
    `);

    // Track mouse coordinates & sample live biome
    map.on('mousemove', (e: L.LeafletMouseEvent) => {
      const mc = latLngToMc(e.latlng.lat, e.latlng.lng);
      setCursorCoords(mc);
      const point = terrainEngine.sampleTerrain(mc.x, mc.z);
      setHoveredPoint(point);
    });

    map.on('mouseout', () => {
      setCursorCoords(null);
      setHoveredPoint(null);
    });

    // Initialize Layer Groups
    clusterGroupLayersRef.current = L.layerGroup().addTo(map);
    structureLayersRef.current = L.layerGroup().addTo(map);
    landmarksLayersRef.current = L.layerGroup().addTo(map);

    // Fit view to bounds
    map.fitBounds(bounds, { padding: [20, 20] });

    return () => {
      map.remove();
      mapRef.current = null;
      biomeLayerRef.current = null;
      clusterGroupLayersRef.current = null;
      structureLayersRef.current = null;
      landmarksLayersRef.current = null;
    };
  }, [searchBounds, terrainEngine, t.mapSpawnMarker, t.mapOriginMarker, worldSpawn]);

  // Handle Biome Layer Toggle
  useEffect(() => {
    const map = mapRef.current;
    const biomeLayer = biomeLayerRef.current;
    if (!map || !biomeLayer) return;

    if (showBiomes) {
      if (!map.hasLayer(biomeLayer)) {
        biomeLayer.addTo(map);
      }
    } else {
      if (map.hasLayer(biomeLayer)) {
        map.removeLayer(biomeLayer);
      }
    }
  }, [showBiomes]);

  // Handle Structures Layer Toggle
  useEffect(() => {
    const map = mapRef.current;
    const layer = structureLayersRef.current;
    if (!map || !layer) return;
    if (showStructures) {
      if (!map.hasLayer(layer)) map.addLayer(layer);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  }, [showStructures]);

  // Handle Landmarks Layer Toggle
  useEffect(() => {
    const map = mapRef.current;
    const layer = landmarksLayersRef.current;
    if (!map || !layer) return;
    if (showLandmarks) {
      if (!map.hasLayer(layer)) map.addLayer(layer);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  }, [showLandmarks]);

  // Handle Clusters Layer Toggle
  useEffect(() => {
    const map = mapRef.current;
    const layer = clusterGroupLayersRef.current;
    if (!map || !layer) return;
    if (showClusters) {
      if (!map.hasLayer(layer)) map.addLayer(layer);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  }, [showClusters]);

  // Render Clusters & Structures
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous cluster layers
    clusterLayersRef.current.forEach((layer) => layer.remove());
    clusterLayersRef.current.clear();

    if (clusterGroupLayersRef.current) {
      clusterGroupLayersRef.current.clearLayers();
    }
    if (structureLayersRef.current) {
      structureLayersRef.current.clearLayers();
    }
    if (landmarksLayersRef.current) {
      landmarksLayersRef.current.clearLayers();
    }

    clusters.forEach((cluster) => {
      const isSelected = selectedClusterId === cluster.id;
      const clusterGroup = L.layerGroup().addTo(map);
      clusterLayersRef.current.set(cluster.id, clusterGroup);

      const centerLatLng = mcToLatLng(cluster.center.x, cluster.center.z);
      const radius = Math.max(cluster.cluster.diameter / 2, 60);

      // Cluster Circle
      const circle = L.circle(centerLatLng, {
        radius: radius,
        color: isSelected ? '#5B8731' : '#855E42',
        weight: isSelected ? 3 : 1.5,
        dashArray: isSelected ? undefined : '5, 4',
        fillColor: isSelected ? '#5B8731' : '#C49A6C',
        fillOpacity: isSelected ? 0.28 : 0.12,
      });

      circle.on('click', () => {
        if (onSelectCluster) onSelectCluster(cluster.id);
      });

      if (clusterGroupLayersRef.current) {
        circle.addTo(clusterGroupLayersRef.current);
      } else {
        circle.addTo(clusterGroup);
      }

      // Cluster Center Marker
      const centerIcon = L.divIcon({
        className: 'cluster-center-icon',
        html: `
          <div style="
            display:flex; align-items:center; justify-content:center;
            min-width:26px; height:22px; padding:0 5px;
            background:${isSelected ? '#5B8731' : '#866043'};
            color:${isSelected ? '#FFFFFF' : '#FADB44'};
            border-top:1.5px solid ${isSelected ? '#89BD44' : '#A87954'};
            border-left:1.5px solid ${isSelected ? '#89BD44' : '#A87954'};
            border-right:1.5px solid ${isSelected ? '#2A4413' : '#4E3523'};
            border-bottom:1.5px solid ${isSelected ? '#2A4413' : '#4E3523'};
            font-size:10px; font-weight:bold; font-family:monospace;
            box-shadow:1px 1px 0 #000; cursor:pointer;
          ">
            #${cluster.id}
          </div>
        `,
        iconSize: [30, 22],
        iconAnchor: [15, 11],
        tooltipAnchor: [0, -11],
      });

      const centerMarker = L.marker(centerLatLng, { icon: centerIcon, zIndexOffset: isSelected ? 800 : 500 });
      centerMarker.on('click', () => {
        if (onSelectCluster) onSelectCluster(cluster.id);
      });

      const primaryCatTranslated = translateCategory(cluster.primary_category);

      // Version-Contextual Hover Tooltip Card
      const clusterBanner = getHoverCardBanner('cluster', version, edition === 'bedrock');
      centerMarker.bindTooltip(`
        <div style="width:200px; font-family:monospace; font-size:11px; overflow:hidden;">
          <div style="width:100%; height:50px; position:relative; overflow:hidden; border-bottom:1.5px solid #555;">
            ${clusterBanner}
            <div style="position:absolute; top:3px; right:4px; background:rgba(0,0,0,0.75); color:#FADB44; padding:1px 4px; font-size:8px; font-weight:bold;">
              v${version}
            </div>
            ${edition === 'bedrock' ? `<div style="position:absolute; top:3px; left:4px; background:#0284C7; color:#FFF; padding:1px 3px; font-size:8px; font-weight:bold;">🪨 BEDROCK</div>` : ''}
          </div>
          <div class="mc-hover-card-content">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
              <span style="font-weight:bold; color:#5B8731; font-size:11px;">CLUSTER #${cluster.id}</span>
              <span style="font-size:9px; background:#866043; color:#FADB44; padding:1px 4px; font-weight:bold;">${primaryCatTranslated}</span>
            </div>
            <div style="background:#8B8B8B; color:#FFFFFF; padding:2px 4px; margin-bottom:3px; font-weight:bold; font-size:10px; text-align:center;" dir="ltr">
              X: ${cluster.center.x.toFixed(0)} | Z: ${cluster.center.z.toFixed(0)}
            </div>
            <div style="font-size:9px; color:#444; font-weight:bold; text-align:center;">
              ${cluster.cluster.count} Structures · Span: ${cluster.cluster.diameter.toFixed(0)}m
            </div>
          </div>
        </div>
      `, {
        className: 'mc-hover-tooltip',
        direction: 'top',
        offset: [0, 0],
        opacity: 1,
      });

      centerMarker.bindPopup(`
        <div style="background:#C6C6C6; color:#1E1E1E; padding:8px 10px; font-family:monospace; font-size:11px; min-width:180px; border-top:2px solid #FFF; border-left:2px solid #FFF; border-right:2px solid #555; border-bottom:2px solid #555; box-shadow:1px 1px 0 #000;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
            <span style="font-weight:bold; color:#5B8731; font-size:12px;">CLUSTER #${cluster.id}</span>
            <span style="font-size:10px; background:#866043; color:#FADB44; padding:1px 4px; font-weight:bold;">${primaryCatTranslated}</span>
          </div>
          <div style="color:#555555; font-size:10px; margin-bottom:4px; font-weight:bold;">
            ${cluster.cluster.count} POIs · Span: ${cluster.cluster.diameter.toFixed(0)}m
          </div>
          <div style="background:#8B8B8B; color:#FFF; padding:2px 6px; border-top:1px solid #373737; border-left:1px solid #373737; border-right:1px solid #FFF; border-bottom:1px solid #FFF; font-weight:bold;" dir="ltr">
            Center: X: ${cluster.center.x.toFixed(0)}, Z: ${cluster.center.z.toFixed(0)}
          </div>
        </div>
      `);

      if (clusterGroupLayersRef.current) {
        centerMarker.addTo(clusterGroupLayersRef.current);
      } else {
        centerMarker.addTo(clusterGroup);
      }

      // Structure Markers inside this cluster
      cluster.structures.forEach((structure) => {
        const structLatLng = mcToLatLng(structure.x, structure.z);

        const structIcon = L.divIcon({
          className: 'structure-pin-icon',
          html: getStructureIconHtml(structure.type),
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          tooltipAnchor: [0, -11],
        });

        const structMarker = L.marker(structLatLng, { icon: structIcon, zIndexOffset: 600 });
        const structNameTranslated = translateStructure(structure.type);

        // Version-Contextual Hover Tooltip Card
        const structBanner = getHoverCardBanner(structure.type, version, edition === 'bedrock');
        structMarker.bindTooltip(`
          <div style="width:200px; font-family:monospace; font-size:11px; overflow:hidden;">
            <div style="width:100%; height:50px; position:relative; overflow:hidden; border-bottom:1.5px solid #555;">
              ${structBanner}
              <div style="position:absolute; top:3px; right:4px; background:rgba(0,0,0,0.75); color:#FADB44; padding:1px 4px; font-size:8px; font-weight:bold;">
                v${version}
              </div>
              ${edition === 'bedrock' ? `<div style="position:absolute; top:3px; left:4px; background:#0284C7; color:#FFF; padding:1px 3px; font-size:8px; font-weight:bold;">🪨 BEDROCK</div>` : ''}
            </div>
            <div class="mc-hover-card-content">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                <span style="font-weight:bold; font-size:11px; color:#1E1E1E;">${structNameTranslated}</span>
                <span style="font-size:9px; background:#866043; color:#FADB44; padding:1px 3px; font-weight:bold;">#${cluster.id}</span>
              </div>
              <div style="background:#8B8B8B; color:#FFFFFF; padding:2px 4px; margin-bottom:3px; font-weight:bold; font-size:10px; text-align:center;" dir="ltr">
                X: ${structure.x} | Z: ${structure.z}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:9px; color:#444; font-weight:bold;">
                <span>Spawn: ${structure.distance_to_spawn.toFixed(0)}m</span>
                <span style="color:#5B8731;">/tp ${structure.x} ~ ${structure.z}</span>
              </div>
            </div>
          </div>
        `, {
          className: 'mc-hover-tooltip',
          direction: 'top',
          offset: [0, 0],
          opacity: 1,
        });

        structMarker.bindPopup(`
          <div style="background:#C6C6C6; color:#1E1E1E; padding:10px; font-family:monospace; font-size:11px; min-width:200px; border-top:2px solid #FFF; border-left:2px solid #FFF; border-right:2px solid #555; border-bottom:2px solid #555; box-shadow:2px 2px 0 #000;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:bold; font-size:12px; color:#1E1E1E;">${structNameTranslated}</span>
              <span style="font-size:10px; background:#866043; color:#FADB44; padding:1px 4px; font-weight:bold;">#${cluster.id}</span>
            </div>
            <div style="background:#8B8B8B; color:#FFFFFF; padding:4px 6px; border-top:1px solid #373737; border-left:1px solid #373737; border-right:1px solid #FFF; border-bottom:1px solid #FFF; margin-bottom:6px; font-weight:bold;" dir="ltr">
              X: ${structure.x} &nbsp;|&nbsp; Z: ${structure.z}
            </div>
            <div style="color:#555555; font-size:10px; margin-bottom:6px; font-weight:bold;">
              Spawn Dist: ${structure.distance_to_spawn.toFixed(0)}m
            </div>
            <button
              onclick="navigator.clipboard.writeText('/tp ${structure.x} ~ ${structure.z}')"
              style="width:100%; background:#5B8731; color:#FFFFFF; border-top:2px solid #89BD44; border-left:2px solid #89BD44; border-right:2px solid #2A4413; border-bottom:2px solid #2A4413; padding:4px 6px; font-size:11px; font-family:monospace; cursor:pointer; font-weight:bold; box-shadow:1px 1px 0 #000;"
            >
              Copy /tp ${structure.x} ~ ${structure.z}
            </button>
          </div>
        `);

        if (structureLayersRef.current) {
          structMarker.addTo(structureLayersRef.current);
        }
      });
    });

    // Discovered world structures outside Useful v3.1
    if (discovery?.structures && structureLayersRef.current) {
      discovery.structures.forEach((ds) => {
        const dsLatLng = mcToLatLng(ds.x, ds.z);
        const dsIcon = L.divIcon({
          className: "discovered-structure-pin",
          html: getStructureIconHtml(ds.type),
          iconSize: [22, 22],
          iconAnchor: [11, 11],
          tooltipAnchor: [0, -11],
        });
        const dsMarker = L.marker(dsLatLng, { icon: dsIcon, zIndexOffset: 500 });
        const nameTr = translateStructure(ds.type);
        const statusNote = ds.viability_status === "terrain_validated" ? "Terrain Validated" : "Biome Viable";

        // Version-Contextual Hover Tooltip Card
        const dsBanner = getHoverCardBanner(ds.type, version, edition === 'bedrock');
        dsMarker.bindTooltip(`
          <div style="width:200px; font-family:monospace; font-size:11px; overflow:hidden;">
            <div style="width:100%; height:50px; position:relative; overflow:hidden; border-bottom:1.5px solid #555;">
              ${dsBanner}
              <div style="position:absolute; top:3px; right:4px; background:rgba(0,0,0,0.75); color:#FADB44; padding:1px 4px; font-size:8px; font-weight:bold;">
                v${version}
              </div>
              ${edition === 'bedrock' ? `<div style="position:absolute; top:3px; left:4px; background:#0284C7; color:#FFF; padding:1px 3px; font-size:8px; font-weight:bold;">🪨 BEDROCK</div>` : ''}
            </div>
            <div class="mc-hover-card-content">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                <span style="font-weight:bold; font-size:11px; color:#1E1E1E;">${nameTr}</span>
                <span style="font-size:8px; background:#4B5563; color:#FFFFFF; padding:1px 3px; font-weight:bold;">${statusNote}</span>
              </div>
              <div style="background:#8B8B8B; color:#FFFFFF; padding:2px 4px; margin-bottom:3px; font-weight:bold; font-size:10px; text-align:center;" dir="ltr">
                X: ${ds.x} | Z: ${ds.z}
              </div>
              <div style="display:flex; justify-content:space-between; align-items:center; font-size:9px; color:#444; font-weight:bold;">
                <span>Spawn: ${ds.distance_to_spawn.toFixed(0)}m</span>
                <span style="color:#2563EB;">/tp ${ds.x} ~ ${ds.z}</span>
              </div>
            </div>
          </div>
        `, {
          className: 'mc-hover-tooltip',
          direction: 'top',
          offset: [0, 0],
          opacity: 1,
        });

        dsMarker.bindPopup(`
          <div style="background:#C6C6C6; color:#1E1E1E; padding:10px; font-family:monospace; font-size:11px; min-width:200px; border-top:2px solid #FFF; border-left:2px solid #FFF; border-right:2px solid #555; border-bottom:2px solid #555; box-shadow:2px 2px 0 #000;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:bold; font-size:12px; color:#1E1E1E;">${nameTr}</span>
              <span style="font-size:9px; background:#4B5563; color:#FFFFFF; padding:1px 4px; font-weight:bold;">${statusNote}</span>
            </div>
            <div style="background:#8B8B8B; color:#FFFFFF; padding:4px 6px; border-top:1px solid #373737; border-left:1px solid #373737; border-right:1px solid #FFF; border-bottom:1px solid #FFF; margin-bottom:6px; font-weight:bold;" dir="ltr">
              X: ${ds.x} &nbsp;|&nbsp; Z: ${ds.z}
            </div>
            <div style="color:#555555; font-size:10px; margin-bottom:6px; font-weight:bold;">
              Spawn Dist: ${ds.distance_to_spawn.toFixed(0)}m
            </div>
            <button
              onclick="navigator.clipboard.writeText('/tp ${ds.x} ~ ${ds.z}')"
              style="width:100%; background:#2563EB; color:#FFFFFF; border-top:2px solid #60A5FA; border-left:2px solid #60A5FA; border-right:2px solid #1D4ED8; border-bottom:2px solid #1D4ED8; padding:4px 6px; font-size:11px; font-family:monospace; cursor:pointer; font-weight:bold; box-shadow:1px 1px 0 #000;"
            >
              Copy /tp ${ds.x} ~ ${ds.z}
            </button>
          </div>
        `);
        if (structureLayersRef.current) {
          dsMarker.addTo(structureLayersRef.current);
        }
      });
    }

    // Landmarks (Scenic & Building Spots) - populated into landmarksLayersRef
    if (landmarks?.spots && landmarksLayersRef.current) {
      landmarks.spots.forEach((lm) => {
        const lmLatLng = mcToLatLng(lm.x, lm.z);
        const lmIcon = L.divIcon({
          className: "landmark-pin",
          html: getLandmarkIconHtml(lm.category),
          iconSize: [24, 24],
          iconAnchor: [12, 12],
          tooltipAnchor: [0, -12],
        });
        const lmMarker = L.marker(lmLatLng, { icon: lmIcon, zIndexOffset: 650 });
        const nameText = locale === 'ar' ? lm.name_ar : lm.name_en;
        const descText = locale === 'ar' ? lm.description_ar : lm.description_en;

        lmMarker.on('click', () => {
          if (onSelectLandmark) {
            onSelectLandmark(lm.id);
          }
        });

        // Version-Contextual Hover Tooltip Card
        const lmBanner = getHoverCardBanner(lm.category, version, edition === 'bedrock');
        lmMarker.bindTooltip(`
          <div style="width:210px; font-family:monospace; font-size:11px; overflow:hidden;">
            <div style="width:100%; height:52px; position:relative; overflow:hidden; border-bottom:1.5px solid #555;">
              ${lmBanner}
              <div style="position:absolute; top:3px; right:4px; background:rgba(0,0,0,0.75); color:#FADB44; padding:1px 4px; font-size:8px; font-weight:bold;">
                v${version}
              </div>
              ${edition === 'bedrock' ? `<div style="position:absolute; top:3px; left:4px; background:#0284C7; color:#FFF; padding:1px 3px; font-size:8px; font-weight:bold;">🪨 100% PARITY</div>` : ''}
            </div>
            <div class="mc-hover-card-content">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3px;">
                <span style="font-weight:bold; font-size:11px; color:#1E1E1E;">${nameText}</span>
                <span style="font-size:9px; background:#10B981; color:#FFFFFF; padding:1px 3px; font-weight:bold;">#${lm.id}</span>
              </div>
              <div style="background:#8B8B8B; color:#FFFFFF; padding:2px 4px; margin-bottom:3px; font-weight:bold; font-size:10px; text-align:center;" dir="ltr">
                X: ${lm.x} | Y: ~${lm.y} | Z: ${lm.z}
              </div>
              ${lm.tags && lm.tags.length > 0 ? `
                <div style="display:flex; flex-wrap:wrap; gap:2px; margin-bottom:3px; justify-content:center;">
                  ${lm.tags.map(t => `<span style="background:#ECECEC; border:0.5px solid #AAA; padding:0.5px 2.5px; font-size:8px; font-weight:bold; color:#444;">#${t.replace(/_/g, ' ')}</span>`).join('')}
                </div>
              ` : ''}
              <div style="display:flex; justify-content:space-between; font-size:9px; color:#333; margin-bottom:3px; font-weight:bold;">
                <span>🏔️ Scenic: <b style="color:#BE185D;">${lm.scenic_score}%</b></span>
                <span>🏰 Build: <b style="color:#B45309;">${lm.building_score}%</b></span>
              </div>
              <div style="color:#059669; font-size:9px; font-weight:bold; text-align:center;">
                ${lm.teleport_command}
              </div>
            </div>
          </div>
        `, {
          className: 'mc-hover-tooltip',
          direction: 'top',
          offset: [0, 0],
          opacity: 1,
        });

        lmMarker.bindPopup(`
          <div style="background:#C6C6C6; color:#1E1E1E; padding:10px; font-family:monospace; font-size:11px; min-width:220px; border-top:2px solid #FFF; border-left:2px solid #FFF; border-right:2px solid #555; border-bottom:2px solid #555; box-shadow:2px 2px 0 #000;">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <span style="font-weight:bold; font-size:12px; color:#1E1E1E;">${nameText}</span>
              <span style="font-size:9px; background:#10B981; color:#FFFFFF; padding:1px 4px; font-weight:bold;">#${lm.id}</span>
            </div>
            <div style="font-size:10px; color:#333; margin-bottom:6px; line-height:1.3;">
              ${descText}
            </div>
            ${lm.tags && lm.tags.length > 0 ? `
              <div style="display:flex; flex-wrap:wrap; gap:3px; margin-bottom:6px;">
                ${lm.tags.map(t => `<span style="background:rgba(0,0,0,0.08); border:1px solid #999; padding:1px 3px; font-size:9px; font-weight:bold;">#${t.replace(/_/g, ' ')}</span>`).join('')}
              </div>
            ` : ''}
            <div style="background:#8B8B8B; color:#FFFFFF; padding:4px 6px; border-top:1px solid #373737; border-left:1px solid #373737; border-right:1px solid #FFF; border-bottom:1px solid #FFF; margin-bottom:4px; font-weight:bold;" dir="ltr">
              X: ${lm.x} &nbsp;|&nbsp; Y: ~${lm.y} &nbsp;|&nbsp; Z: ${lm.z}
            </div>
            <div style="font-size:8px; color:#555; margin-bottom:6px; font-style:italic;">
              * ${locale === 'ar' ? 'الارتفاع Y تقريبي (~)، يُنصح بالانتقال بحذر لتفادي السقوط' : 'Y elevation is approximate (~); exercise caution when teleporting'}
            </div>
            <div style="display:flex; justify-content:space-between; color:#444; font-size:10px; margin-bottom:6px; font-weight:bold;">
              <span>🌟 Scenic: ${lm.scenic_score}%</span>
              <span>🏰 Build: ${lm.building_score}%</span>
            </div>
            <button
              onclick="navigator.clipboard.writeText('${lm.teleport_command}')"
              style="width:100%; background:#059669; color:#FFFFFF; border-top:2px solid #34D399; border-left:2px solid #34D399; border-right:2px solid #047857; border-bottom:2px solid #047857; padding:4px 6px; font-size:11px; font-family:monospace; cursor:pointer; font-weight:bold; box-shadow:1px 1px 0 #000;"
            >
              Copy ${lm.teleport_command}
            </button>
          </div>
        `);
        if (landmarksLayersRef.current) {
          lmMarker.addTo(landmarksLayersRef.current);
        }
      });
    }
  }, [clusters, discovery, landmarks, selectedClusterId, onSelectCluster, onSelectLandmark, locale, t, translateCategory, translateStructure, version, edition]);

  // Center on selected cluster when it changes
  useEffect(() => {
    if (!selectedClusterId || !mapRef.current) return;
    const cluster = clusters.find((c) => c.id === selectedClusterId);
    if (cluster) {
      const target = mcToLatLng(cluster.center.x, cluster.center.z);
      mapRef.current.flyTo(target, 0, { duration: 0.8 });
    }
  }, [selectedClusterId, clusters]);

  // Center on selected landmark when it changes
  useEffect(() => {
    if (!selectedLandmarkId || !mapRef.current || !landmarks?.spots) return;
    const lm = landmarks.spots.find((l) => l.id === selectedLandmarkId);
    if (lm) {
      const target = mcToLatLng(lm.x, lm.z);
      mapRef.current.flyTo(target, 0, { duration: 0.8 });
    }
  }, [selectedLandmarkId, landmarks]);

  const handleResetView = () => {
    if (!mapRef.current) return;
    const bounds: L.LatLngBoundsExpression = [
      [-searchBounds.max_z, searchBounds.min_x],
      [-searchBounds.min_z, searchBounds.max_x],
    ];
    mapRef.current.fitBounds(bounds, { padding: [20, 20] });
  };

  const spX = worldSpawn?.x ?? 0;
  const spZ = worldSpawn?.z ?? 0;
  const handleFocusSpawn = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([-spZ, spX], 0, { duration: 0.6 });
  };

  const handleFocusOrigin = () => {
    if (!mapRef.current) return;
    mapRef.current.flyTo([0, 0], 0, { duration: 0.6 });
  };

  const handleZoom = (delta: number) => {
    if (!mapRef.current) return;
    mapRef.current.setZoom(mapRef.current.getZoom() + delta);
  };

  return (
    <div className={`relative w-full mc-wood-frame p-2 flex flex-col justify-between overflow-hidden shadow-2xl select-none ${className}`}>
      {/* Top Map Tool Strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-[#C6C6C6] px-3 py-1.5 border-t-2 border-l-2 border-[#FFFFFF] border-b-2 border-r-2 border-[#555555] font-mc-mono text-xs font-bold text-[#1E1E1E]">
        <div className="flex items-center gap-2">
          <Compass className="w-4 h-4 text-[#5B8731] shrink-0" />
          <span className="uppercase">{t.mapTitle || 'Overworld Cartography Canvas'}</span>
          <span className="text-[#888888] hidden sm:inline">|</span>
          <span className="text-[#5E4325] hidden sm:inline">16x16 Chunk Grid</span>
        </div>

        {/* Layer Toggles & Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowStructures(!showStructures)}
            className={`px-2 py-0.5 font-mc-mono text-[11px] font-bold cursor-pointer transition-all ${
              showStructures ? 'mc-btn-green' : 'mc-button text-[#777777] line-through opacity-75'
            }`}
            title="Toggle Structures Layer"
          >
            🏰 {locale === 'ar' ? 'الهياكل' : 'Structures'}
          </button>
          <button
            type="button"
            onClick={() => setShowLandmarks(!showLandmarks)}
            className={`px-2 py-0.5 font-mc-mono text-[11px] font-bold cursor-pointer transition-all ${
              showLandmarks ? 'mc-btn-green' : 'mc-button text-[#777777] line-through opacity-75'
            }`}
            title="Toggle Landmarks Layer"
          >
            🌸 {locale === 'ar' ? 'المعالم' : 'Landmarks'}
          </button>
          <button
            type="button"
            onClick={() => setShowClusters(!showClusters)}
            className={`px-2 py-0.5 font-mc-mono text-[11px] font-bold cursor-pointer transition-all ${
              showClusters ? 'mc-btn-green' : 'mc-button text-[#777777] line-through opacity-75'
            }`}
            title="Toggle Clusters Layer"
          >
            💎 {locale === 'ar' ? 'العناقيد' : 'Clusters'}
          </button>
          <button
            type="button"
            onClick={() => setShowBiomes(!showBiomes)}
            className={`px-2 py-0.5 font-mc-mono text-[11px] font-bold cursor-pointer transition-all ${
              showBiomes ? 'mc-btn-green' : 'mc-button text-[#777777] line-through opacity-75'
            }`}
            title="Toggle Biomes Canvas Layer"
          >
            🗺️ {showBiomes ? (locale === 'ar' ? 'البيومات' : 'Biomes') : (locale === 'ar' ? 'البيومات (مغلق)' : 'Biomes (Off)')}
          </button>

          <span className="text-[#888888] hidden sm:inline">|</span>

          <button
            type="button"
            onClick={handleFocusSpawn}
            className="px-2 py-0.5 mc-button text-[#333333] hover:text-[#111111] font-mc-mono text-[11px] font-bold cursor-pointer"
          >
            {t.mapFocusSpawn || 'Spawn'}
          </button>
          <button
            type="button"
            onClick={handleFocusOrigin}
            className="px-2 py-0.5 mc-button text-[#333333] hover:text-[#111111] font-mc-mono text-[11px] font-bold cursor-pointer"
          >
            {t.mapFocusOrigin || '(0, 0)'}
          </button>
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="px-2 py-0.5 mc-button text-[#333333] hover:text-[#111111] font-mc-mono text-[11px] font-bold cursor-pointer"
          >
            {showLegend ? (locale === 'ar' ? 'إخفاء الدليل' : 'Hide Legend') : (locale === 'ar' ? 'الدليل' : 'Legend')}
          </button>
        </div>
      </div>

      {/* Map Viewport with Parchment Tone */}
      <div className="relative w-full flex-1 min-h-[360px] my-1.5 overflow-hidden bg-[#E5D7B5] border-2 border-[#A49272] shadow-[inset_0_0_24px_rgba(110,80,40,0.25)]">
        {/* Stylized Preview Disclaimer Badge */}
        <div className="absolute top-2 start-2 z-20 pointer-events-none bg-[#1E1E1E]/90 text-[#FBBF24] border border-[#555] px-2 py-0.5 text-[10px] font-mc-mono flex items-center gap-1.5 shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FBBF24] animate-pulse"></span>
          <span>{t.mapStylizedBadge}</span>
        </div>

        {/* Leaflet map container */}
        <div ref={mapContainerRef} className="w-full h-full z-0 cursor-crosshair" />

        {/* Crosshair Center HUD */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30 z-10">
          <div className="w-8 h-8 border-2 border-[#555555] relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#333333]"></div>
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#333333]"></div>
          </div>
        </div>

        {/* Legend Popover */}
        {showLegend && (
          <div className="absolute bottom-3 end-3 z-30 mc-gui-panel p-3 text-[11px] shadow-2xl flex flex-col gap-2 max-w-[240px] font-mc-mono animate-fade-in">
            <div>
              <div className="text-[#1E1E1E] font-bold mb-1 border-b border-[#A8A8A8] pb-0.5">
                {t.legendStructures}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[#222222]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#5B8731] border border-[#000] shrink-0" />
                  <span>Spawn [0,0]</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#C69176] border border-[#4A2F1B] shrink-0" />
                  <span>{t.legendVillage}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#07141B] border border-[#00F0FF] shrink-0" />
                  <span>{t.legendAncientCity}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#0A1F33] border border-[#38BDF8] shrink-0" />
                  <span>{t.legendShipwreck}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 bg-[#261B05] border border-[#FBBF24] shrink-0" />
                  <span>{t.legendPyramid}</span>
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#A8A8A8]">
              <div className="text-[#1E1E1E] font-bold mb-1">
                {t.legendLandmarks || 'Landmarks & Spots'}
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[#222222]">
                <div className="flex items-center gap-1.5">
                  <span>🌸</span>
                  <span>Cherry / Caldera</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🏔️</span>
                  <span>Mountain Ring</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>📷</span>
                  <span>Epic Clifftop</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🏰</span>
                  <span>Building Basin</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>🏝️</span>
                  <span>Survival Island</span>
                </div>
              </div>
            </div>

            {showBiomes && (
              <div className="pt-1.5 border-t border-[#A8A8A8]">
                <div className="text-[#1E1E1E] font-bold mb-1">
                  {t.legendBiomes}
                </div>
                <div className="grid grid-cols-2 gap-1.5 text-[#222222]">
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-[#729E38] shrink-0" />
                    <span>Plains</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-[#D8CA88] shrink-0" />
                    <span>Desert</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-[#3F76E4] shrink-0" />
                    <span>Ocean</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 bg-[#F8B2D6] shrink-0" />
                    <span>Cherry</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Map Coordinate Telemetry Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-[#C6C6C6] px-3 py-1.5 border-t-2 border-l-2 border-[#FFFFFF] border-b-2 border-r-2 border-[#555555] font-mc-mono text-xs font-bold text-[#222222]">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <span className="text-[#555555] uppercase text-[10px] me-1">Crosshair:</span>
            <span className="text-[#5B8731]">
              {cursorCoords ? `X: ${cursorCoords.x} | Z: ${cursorCoords.z}` : 'X: 0 | Z: 0'}
            </span>
          </div>
          <div className="hidden xs:block">
            <span className="text-[#555555] uppercase text-[10px] me-1">Chunk:</span>
            <span className="text-[#1E1E1E]">
              {cursorCoords
                ? `[${Math.floor(cursorCoords.x / 16)}, ${Math.floor(cursorCoords.z / 16)}]`
                : '[0, 0]'}
            </span>
          </div>
          <div>
            <span className="text-[#555555] uppercase text-[10px] me-1">Height:</span>
            <span className="text-[#2CBAA8]">
              Y: {hoveredPoint?.height ?? 64} {hoveredPoint ? `(${locale === 'ar' ? hoveredPoint.biome.nameAr : hoveredPoint.biome.nameEn})` : '(Sea Level)'}
            </span>
          </div>
          <div>
            <span className="text-[#555555] uppercase text-[10px] me-1">{locale === 'ar' ? 'النسخة:' : 'Edition:'}</span>
            <span className={`px-1.5 py-0.5 text-[10px] font-bold ${
              edition === 'bedrock'
                ? 'bg-[#0284C7] text-white shadow-[1px_1px_0_#000]'
                : 'bg-[#5B8731] text-white shadow-[1px_1px_0_#000]'
            }`}>
              {edition === 'bedrock' ? '🪨 Bedrock Parity' : `☕ Java ${version}`}
            </span>
          </div>
        </div>

        {/* Zoom & Reset Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom(1)}
            className="w-6 h-6 mc-button text-[#1E1E1E] font-bold flex items-center justify-center cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            onClick={() => handleZoom(-1)}
            className="w-6 h-6 mc-button text-[#1E1E1E] font-bold flex items-center justify-center cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
          <button
            onClick={handleResetView}
            className="px-2 h-6 mc-button text-[#333333] hover:text-[#1E1E1E] flex items-center justify-center font-mc-mono text-[11px] font-bold cursor-pointer"
            title="Reset View"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
