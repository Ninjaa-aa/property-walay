/**
 * Types for Trends API responses
 */

// ============================================
// Region Types
// ============================================

export interface TrendsRegion {
  id: number;
  name: string;
  name_urdu?: string | null;
  level: number;
  created_at?: string | null;
  updated_at?: string | null;
}

// ============================================
// City Types
// ============================================

export interface TrendsCity {
  id: number;
  name: string;
  name_urdu?: string | null;
  region_id?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  level: number;
  region?: TrendsRegion | null;
  created_at?: string | null;
  updated_at?: string | null;
}

// ============================================
// Location Types
// ============================================

export interface TrendsLocation {
  id: number;
  title: string;
  title_urdu?: string | null;
  city_id?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  created_at?: string | null;
  updated_at?: string | null;
}

export interface TrendsLocationWithStats extends TrendsLocation {
  monthly_stats: TrendsMonthlyStats[];
  latest_ranking?: TrendsPositionRanking | null;
}

// ============================================
// Monthly Stats Types
// ============================================

export interface TrendsMonthlyStats {
  id: number;
  location_id: number;
  category: "buying" | "renting";
  stats_date: string;
  month_year?: string | null;
  view_count: number;
  search_percentage: number;
  created_at?: string | null;
}

// ============================================
// Position Ranking Types
// ============================================

export interface TrendsPositionRanking {
  id: number;
  location_id: number;
  city_id: number;
  category: "buying" | "renting";
  stats_date: string;
  current_position?: number | null;
  previous_position?: number | null;
  position_change?: number | null;
  current_search_percentage?: number | null;
  previous_search_percentage?: number | null;
  search_percentage_change?: number | null;
  current_view_count?: number | null;
  location?: TrendsLocation | null;
  created_at?: string | null;
}

// ============================================
// Summary Types
// ============================================

export interface TrendsSummary {
  total_regions: number;
  total_cities: number;
  total_locations: number;
  buying_locations: number;
  renting_locations: number;
  latest_data_date?: string | null;
  last_import?: string | null;
}

// ============================================
// Top Location Types (for city rankings)
// ============================================

export interface TopLocation {
  location_id: number;
  title: string;
  title_urdu?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  current_position: number;
  previous_position?: number | null;
  position_change?: number | null;
  current_search_percentage?: number | null;
  current_view_count?: number | null;
  stats_date: string;
}

// ============================================
// Top Mover Types
// ============================================

export interface TopMover {
  location_id: number;
  location_title: string;
  city_id: number;
  city_name: string;
  current_position: number;
  previous_position?: number | null;
  position_change: number;
  current_search_percentage?: number | null;
  current_view_count?: number | null;
}

// ============================================
// Location History Types
// ============================================

export interface LocationHistory {
  location_id: number;
  category: "buying" | "renting";
  labels: string[];
  view_counts: number[];
  search_percentages: number[];
  dates: string[];
}

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsOverview {
  category: "buying" | "renting";
  latest_date?: string | null;
  total_views: number;
  average_search_percentage: number;
  top_cities: {
    id: number;
    name: string;
    total_views: number;
  }[];
  region_distribution: {
    id: number;
    name: string;
    city_count: number;
    location_count: number;
  }[];
}

export interface LocationComparison {
  location_id: number;
  title: string;
  data: {
    labels: string[];
    view_counts: number[];
    search_percentages: number[];
  };
}

// ============================================
// Map Types
// ============================================

export interface MapLocation {
  id: number;
  title: string;
  city_id: number;
  latitude: number;
  longitude: number;
  position?: number | null;
  position_change?: number | null;
  view_count?: number | null;
  search_percentage?: number | null;
}

export interface MapCity {
  id: number;
  name: string;
  region_id?: number | null;
  latitude: number;
  longitude: number;
}

// ============================================
// Filter/Search Params
// ============================================

export interface TrendsSearchParams {
  category?: "buying" | "renting";
  region_id?: number;
  city_id?: number;
  location_id?: number;
  start_date?: string;
  end_date?: string;
  min_position?: number;
  max_position?: number;
  limit?: number;
  offset?: number;
}

export type TrendsCategory = "buying" | "renting";


