export interface Station {
  id: string;
  code: string;
  name: string;
  scheduledArrival: string; // "06:00"
  scheduledDeparture: string; // "06:05"
  actualArrival?: string;
  actualDeparture?: string;
  platform?: string;
  delayMinutes: number;
  distanceKm: number;
  haltMinutes: number;
  coordinates: [number, number]; // [lat, lng]
  status: 'COMPLETED' | 'CURRENT' | 'UPCOMING';
  state?: string;
}

export interface Coach {
  id: string;
  code: string; // e.g. "WAP-7", "E1", "C1", "C2", "B1"
  type: 'ENGINE' | 'EXECUTIVE' | 'AC_CHAIR' | 'AC_3_TIER' | 'AC_2_TIER' | 'AC_1_TIER' | 'SLEEPER' | 'PANTRY' | 'SLR';
  name: string;
  occupancyPercent: number;
}

export interface SpeedDataPoint {
  time: string;
  speed: number;
  elevation: number;
  delay: number;
  distance: number;
}

export interface WeatherInfo {
  tempC: number;
  condition: string;
  icon: string;
  rainChance: number;
  windKmH: number;
  humidity: number;
  visibilityKm: number;
}

export interface AiInsights {
  delayProbability: number; // 0 - 100%
  predictedArrival: string;
  confidenceScore: number;
  speedConsistency: 'EXCELLENT' | 'GOOD' | 'MODERATE' | 'POOR';
  weatherImpact: string;
  platformRecommendation: string;
}

export interface TrainDetails {
  number: string;
  name: string;
  type: string; // "Vande Bharat Express", "Rajdhani Express", "Superfast"
  operator: string; // "Indian Railways / Western Railway"
  zone: string; // "WR / NR"
  origin: string;
  destination: string;
  totalDistanceKm: number;
  maxSpeedKmH: number;
  avgSpeedKmH: number;
  runningDays: string[]; // ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  coaches: Coach[];
  engineType: string;
  totalDurationHours: number;
}

export interface TrainTelemetry {
  train: TrainDetails;
  currentLat: number;
  currentLng: number;
  heading: number; // 0 - 360 degrees
  currentSpeed: number; // km/h
  status: 'RUNNING' | 'HALTED' | 'ARRIVING' | 'DEPARTED' | 'DELAYED';
  delayMinutes: number;
  signalAspect: 'GREEN' | 'YELLOW' | 'RED';
  signalStrengthPercent: number; // 0-100%
  coveredDistanceKm: number;
  remainingDistanceKm: number;
  eta: string;
  lastUpdated: string;
  currentStation?: Station;
  nextStation: Station;
  previousStation: Station;
  upcomingStops: Station[];
  allStations: Station[];
  elevationMeters: number;
  speedHistory: SpeedDataPoint[];
  weather: WeatherInfo;
  aiInsights: AiInsights;
  journeyProgressPercent: number;
}

export type MapStyleMode = 'DARK_CYBER' | 'LIGHT_GRID' | 'SATELLITE' | 'SIGNALS' | 'WEATHER';

export interface ApiHealth {
  endpoint: string;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  latencyMs: number;
  requestsToday: number;
  successRatePercent: number;
  rateLimitRemaining: number;
  rateLimitTotal: number;
  apiKeyMasked: string;
  lastPingTime: string;
}

export interface TrainSummary {
  number: string;
  name: string;
  type: string;
  origin: string;
  destination: string;
  status: string;
  currentLocationName: string;
  delayMinutes: number;
  speed: number;
}
