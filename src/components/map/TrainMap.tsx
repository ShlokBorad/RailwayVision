import React, { useEffect, useRef, useState } from 'react';
import {
  MapContainer as MapContainerComponent,
  TileLayer as TileLayerComponent,
  Polyline as PolylineComponent,
  Marker as MarkerComponent,
  Popup as PopupComponent,
  useMap,
} from 'react-leaflet';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MapContainer = MapContainerComponent as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TileLayer = TileLayerComponent as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Polyline = PolylineComponent as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Marker = MarkerComponent as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Popup = PopupComponent as any;
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { TrainTelemetry } from '../../types/train';
import { useTrainStore } from '../../store/useTrainStore';
import { MapControls } from './MapControls';
import { format12HourTime } from '../../utils/formatters';

interface TrainMapProps {
  telemetry: TrainTelemetry;
  height?: string;
  isFullscreenMode?: boolean;
}

// Recenter map ONLY when train selection changes, allowing free panning & zooming anywhere
const MapRecenter: React.FC<{ center: [number, number]; trainNumber: string }> = ({ center, trainNumber }) => {
  const map = useMap();
  const prevTrainRef = useRef<string | null>(null);

  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      if (prevTrainRef.current !== trainNumber) {
        prevTrainRef.current = trainNumber;
        map.flyTo(center, 9, { animate: true, duration: 1.2 });
      }
    }
  }, [center, trainNumber, map]);
  return null;
};

export const TrainMap: React.FC<TrainMapProps> = ({
  telemetry,
  height = '550px',
  isFullscreenMode = false,
}) => {
  const { mapStyleMode } = useTrainStore();
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const trainPos: [number, number] = [telemetry.currentLat, telemetry.currentLng];

  // Tile layer URL based on active mapStyleMode
  const tileUrls = {
    DARK_CYBER: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    LIGHT_GRID: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    SIGNALS: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    WEATHER: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  };

  // Fullscreen toggle handler
  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
      }).catch(() => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        setTimeout(() => mapRef.current?.invalidateSize(), 200);
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const onFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
      setTimeout(() => mapRef.current?.invalidateSize(), 200);
    };
    document.addEventListener('fullscreenchange', onFSChange);
    return () => document.removeEventListener('fullscreenchange', onFSChange);
  }, []);

  // Create custom aerodynamic SVG train icon with smooth directional heading rotation
  const createTrainIcon = (heading: number, speed: number) => {
    return L.divIcon({
      className: 'custom-train-marker',
      html: `
        <div style="transform: rotate(${heading}deg); transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);" class="relative flex items-center justify-center w-14 h-14">
          <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00E5FF]/40 to-[#7C3AED]/30 animate-ping"></div>
          <div class="relative w-11 h-11 rounded-full bg-[#050816] border-2 border-[#00E5FF] shadow-[0_0_25px_#00E5FF] flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L18 8H14V20H10V8H6L12 2Z" fill="#00E5FF" stroke="#00E5FF" stroke-width="1.5" stroke-linejoin="round"/>
              <circle cx="12" cy="14" r="2" fill="#FFFFFF"/>
            </svg>
          </div>
          <div class="absolute -bottom-6 px-2 py-0.5 rounded-full bg-[#050816]/90 text-[10px] font-mono font-extrabold text-[#00E5FF] border border-[#00E5FF]/50 shadow-[0_0_10px_rgba(0,229,255,0.4)] whitespace-nowrap">
            ${speed} KM/H
          </div>
        </div>
      `,
      iconSize: [56, 56],
      iconAnchor: [28, 28],
    });
  };

  // Station marker icons (Completed = Green, Current = Cyan Pulse, Upcoming = Amber)
  const createStationIcon = (status: 'COMPLETED' | 'CURRENT' | 'UPCOMING', code: string) => {
    const colorClass =
      status === 'CURRENT'
        ? 'border-[#00E5FF] bg-[#00E5FF]/20 text-[#00E5FF] shadow-[0_0_15px_#00E5FF]'
        : status === 'COMPLETED'
        ? 'border-[#22C55E] bg-[#22C55E]/10 text-[#22C55E]'
        : 'border-slate-500 bg-slate-900/80 text-slate-400';

    return L.divIcon({
      className: 'custom-station-marker',
      html: `
        <div class="flex flex-col items-center group">
          <div class="w-7 h-7 rounded-full border-2 ${colorClass} flex items-center justify-center font-mono font-bold text-[10px]">
            ${code.substring(0, 3)}
          </div>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  // Build Polyline points - Continuous linear track path from Origin -> Train -> Destination
  const allCoords = telemetry.allStations.map((s) => s.coordinates);
  let currentIdx = telemetry.allStations.findIndex((s) => s.status === 'CURRENT');
  if (currentIdx === -1) {
    currentIdx = Math.max(0, telemetry.allStations.length - 2);
  }

  // Traversed track: Origin station -> Stations up to current station -> Live Train Position
  const pastCoords: [number, number][] = [
    ...allCoords.slice(0, currentIdx + 1),
    trainPos,
  ];

  // Remaining track: Live Train Position -> Next Stations -> Destination Terminal
  const futureCoords: [number, number][] = [
    trainPos,
    ...allCoords.slice(currentIdx + 1),
  ];

  const handleRecenter = () => {
    if (mapRef.current) {
      mapRef.current.flyTo(trainPos, 12, { animate: true, duration: 1 });
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ height: isFullscreen ? '100vh' : isFullscreenMode ? 'calc(100vh - 80px)' : height }}
      className={`w-full overflow-hidden relative border border-white/10 shadow-2xl glass-panel ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-[#050816]' : 'rounded-2xl'
      }`}
    >
      <MapControls
        onRecenter={handleRecenter}
        onToggleFullscreen={handleToggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <MapContainer
        center={trainPos}
        zoom={9}
        minZoom={2}
        maxZoom={20}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; RailVision Radar'
          url={tileUrls[mapStyleMode]}
          maxNativeZoom={19}
          maxZoom={20}
        />

        <MapRecenter center={trainPos} trainNumber={telemetry.train.number} />

        {/* Traversed route polyline (Solid Cyan/Green glow) */}
        <Polyline
          positions={pastCoords}
          pathOptions={{
            color: '#22C55E',
            weight: 4,
            opacity: 0.8,
          }}
        />

        {/* Upcoming route polyline (Dashed Cyan/Purple) */}
        <Polyline
          positions={futureCoords}
          pathOptions={{
            color: '#00E5FF',
            weight: 4,
            opacity: 0.7,
            dashArray: '8, 8',
          }}
        />

        {/* Train Live Marker */}
        <Marker position={trainPos} icon={createTrainIcon(telemetry.heading, telemetry.currentSpeed)}>
          <Popup>
            <div className="p-1 min-w-[200px]">
              <div className="font-bold text-[#00E5FF] text-sm flex items-center justify-between">
                <span>{telemetry.train.number}</span>
                <span className="text-xs text-emerald-400 font-mono">{telemetry.currentSpeed} KM/H</span>
              </div>
              <div className="text-xs text-white font-medium mt-1">{telemetry.train.name}</div>
              <div className="text-[11px] text-slate-300 mt-2 border-t border-white/10 pt-1 flex justify-between">
                <span>Heading: {telemetry.heading}°</span>
                <span>Signal: {telemetry.signalAspect}</span>
              </div>
              <div className="text-[11px] text-slate-300 flex justify-between mt-0.5">
                <span>Delay: +{telemetry.delayMinutes}m</span>
                <span>Next: {telemetry.nextStation.name}</span>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* Station Markers */}
        {telemetry.allStations.map((st) => (
          <Marker
            key={st.id}
            position={st.coordinates}
            icon={createStationIcon(st.status, st.code)}
          >
            <Popup>
              <div className="p-1 min-w-[180px]">
                <div className="font-bold text-white text-sm flex justify-between items-center">
                  <span>{st.name} ({st.code})</span>
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Scheduled: <span className="font-mono text-[#00E5FF]">{format12HourTime(st.scheduledArrival)}</span>
                </div>
                <div className="text-xs text-slate-300">
                  Platform: <span className="font-bold text-amber-400">PF {st.platform || '1'}</span>
                </div>
                <div className="text-[11px] text-[#22C55E] mt-1 font-semibold">
                  Status: {st.status}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
