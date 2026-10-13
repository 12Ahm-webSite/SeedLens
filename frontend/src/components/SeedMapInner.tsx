'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Cluster, SearchBounds, WorldSpawn, DiscoverySummary } from '@/types/seedlens';
import { getStructureMetadata } from '@/components/StructureBadge';
import { Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { MinecraftTerrainEngine, TerrainPoint } from '@/lib/minecraftTerrain';

interface SeedMapInnerProps {
  seed?: string | number;
  clusters: Cluster[];
  searchBounds?: SearchBounds;
  worldSpawn?: WorldSpawn;
  discovery?: DiscoverySummary;
  selectedClusterId?: number | null;
  onSelectCluster?: (clusterId: number) => void;
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
  clusters,
  searchBounds = { min_x: -5000, max_x: 5000, min_z: -5000, max_z: 5000 },
  worldSpawn,
  discovery,
  selectedClusterId,
  onSelectCluster,
  className = '',
}: SeedMapInnerProps) {
  const { t, locale, translateCategory, translateStructure } = useLanguage();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const biomeLayerRef = useRef<L.GridLayer | null>(null);
  const clusterLayersRef = useRef<Map<number, L.LayerGroup>>(new Map());
  const structureLayersRef = useRef<L.LayerGroup | null>(null);

  const [showBiomes, setShowBiomes] = useState(true);
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

    // Structure layer group
    structureLayersRef.current = L.layerGroup().addTo(map);

    // Fit view to bounds
    map.fitBounds(bounds, { padding: [20, 20] });

    return () => {
      map.remove();
      mapRef.current = null;
      biomeLayerRef.current = null;
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

  // Render Clusters & Structures
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous cluster layers
    clusterLayersRef.current.forEach((layer) => layer.remove());
    clusterLayersRef.current.clear();

    if (structureLayersRef.current) {
      structureLayersRef.current.clearLayers();
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

      circle.addTo(clusterGroup);

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
      });

      const centerMarker = L.marker(centerLatLng, { icon: centerIcon, zIndexOffset: isSelected ? 800 : 500 });
      centerMarker.on('click', () => {
        if (onSelectCluster) onSelectCluster(cluster.id);
      });

      const primaryCatTranslated = translateCategory(cluster.primary_category);

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

      centerMarker.addTo(clusterGroup);

      // Structure Markers inside this cluster
      cluster.structures.forEach((structure) => {
        const structLatLng = mcToLatLng(structure.x, structure.z);

        const structIcon = L.divIcon({
          className: 'structure-pin-icon',
          html: getStructureIconHtml(structure.type),
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const structMarker = L.marker(structLatLng, { icon: structIcon, zIndexOffset: 600 });
        const structNameTranslated = translateStructure(structure.type);

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
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });
        const dsMarker = L.marker(dsLatLng, { icon: dsIcon, zIndexOffset: 500 });
        const nameTr = translateStructure(ds.type);
        const statusNote = ds.viability_status === "terrain_validated" ? "Terrain Validated" : "Biome Viable";

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
  }, [clusters, discovery, selectedClusterId, onSelectCluster, t, translateCategory, translateStructure]);

  // Center on selected cluster when it changes
  useEffect(() => {
    if (!selectedClusterId || !mapRef.current) return;
    const cluster = clusters.find((c) => c.id === selectedClusterId);
    if (cluster) {
      const target = mcToLatLng(cluster.center.x, cluster.center.z);
      mapRef.current.flyTo(target, 0, { duration: 0.8 });
    }
  }, [selectedClusterId, clusters]);

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
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowBiomes(!showBiomes)}
            className={`px-2 py-0.5 font-mc-mono text-[11px] font-bold cursor-pointer ${
              showBiomes ? 'mc-btn-green' : 'mc-button text-[#333333]'
            }`}
          >
            {showBiomes ? t.mapLayerBiomes : t.mapLayerMinimal}
          </button>
          <button
            onClick={handleFocusSpawn}
            className="px-2 py-0.5 mc-button text-[#333333] hover:text-[#111111] font-mc-mono text-[11px] font-bold cursor-pointer"
          >
            {t.mapFocusSpawn || 'Spawn'}
          </button>
          <button
            onClick={handleFocusOrigin}
            className="px-2 py-0.5 mc-button text-[#333333] hover:text-[#111111] font-mc-mono text-[11px] font-bold cursor-pointer"
          >
            {t.mapFocusOrigin || '(0, 0)'}
          </button>
          <button
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
