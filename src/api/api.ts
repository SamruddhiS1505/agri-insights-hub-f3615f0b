import { supabase } from '@/integrations/supabase/client';

export interface CropData {
  farmer_id: string;
  crop: string;
  event_date: string;
  metric_name: string;
  metric_value: number;
  notes?: string;
}

export interface TimeSeriesParams {
  farmer_id: string;
  crop?: string;
  metric_name: string;
  date_from: string;
  date_to: string;
  freq: 'D' | 'W' | 'M';
  forecast_periods: number;
}

export interface StatsParams {
  farmer_id: string;
  crop?: string;
  date_from: string;
  date_to: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  value: number;
  is_forecast?: boolean;
}

export interface StatsData {
  metric_name: string;
  total_events: number;
  distinct_days: number;
}

// POST - Submit crop data to Supabase
export const submitCropData = async (data: CropData) => {
  const { data: result, error } = await supabase
    .from('crop_data')
    .insert({
      farmer_id: data.farmer_id,
      crop: data.crop,
      event_date: data.event_date,
      metric_name: data.metric_name,
      metric_value: data.metric_value,
      notes: data.notes || null,
    })
    .select()
    .single();

  if (error) throw error;
  return result;
};

// GET - Retrieve crop data from Supabase
export const getCropData = async (farmerId?: string) => {
  let query = supabase.from('crop_data').select('*').order('event_date', { ascending: false });
  
  if (farmerId) {
    query = query.eq('farmer_id', farmerId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// GET - Get time series data with aggregation
export const getTimeSeries = async (params: TimeSeriesParams): Promise<TimeSeriesDataPoint[]> => {
  let query = supabase
    .from('crop_data')
    .select('event_date, metric_value')
    .eq('farmer_id', params.farmer_id)
    .eq('metric_name', params.metric_name)
    .gte('event_date', params.date_from)
    .lte('event_date', params.date_to)
    .order('event_date', { ascending: true });

  if (params.crop) {
    query = query.eq('crop', params.crop);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Aggregate data based on frequency
  const aggregatedData = aggregateByFrequency(data || [], params.freq);
  
  // Add simple forecast
  const forecast = generateForecast(aggregatedData, params.forecast_periods);
  
  return [...aggregatedData, ...forecast];
};

// Aggregate data by frequency (Daily, Weekly, Monthly)
function aggregateByFrequency(data: any[], freq: 'D' | 'W' | 'M'): TimeSeriesDataPoint[] {
  if (data.length === 0) return [];

  const grouped: { [key: string]: number[] } = {};

  data.forEach((item) => {
    const date = new Date(item.event_date);
    let key: string;

    switch (freq) {
      case 'W':
        // Group by week (start of week)
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay());
        key = weekStart.toISOString().split('T')[0];
        break;
      case 'M':
        // Group by month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
        break;
      default:
        // Daily
        key = item.event_date;
    }

    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(parseFloat(item.metric_value));
  });

  return Object.entries(grouped)
    .map(([date, values]) => ({
      date,
      value: values.reduce((a, b) => a + b, 0) / values.length,
      is_forecast: false,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

// Generate simple linear forecast
function generateForecast(data: TimeSeriesDataPoint[], periods: number): TimeSeriesDataPoint[] {
  if (data.length < 2 || periods <= 0) return [];

  // Simple linear regression for trend
  const values = data.map((d) => d.value);
  const n = values.length;
  const sumX = (n * (n - 1)) / 2;
  const sumY = values.reduce((a, b) => a + b, 0);
  const sumXY = values.reduce((acc, y, i) => acc + i * y, 0);
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const lastDate = new Date(data[data.length - 1].date);
  const forecast: TimeSeriesDataPoint[] = [];

  for (let i = 1; i <= periods; i++) {
    const forecastDate = new Date(lastDate);
    forecastDate.setDate(forecastDate.getDate() + i);
    const forecastValue = intercept + slope * (n + i - 1);

    forecast.push({
      date: forecastDate.toISOString().split('T')[0],
      value: Math.max(0, forecastValue), // Ensure non-negative
      is_forecast: true,
    });
  }

  return forecast;
}

// GET - Get statistics
export const getStats = async (params: StatsParams): Promise<StatsData[]> => {
  let query = supabase
    .from('crop_data')
    .select('metric_name, event_date')
    .eq('farmer_id', params.farmer_id)
    .gte('event_date', params.date_from)
    .lte('event_date', params.date_to);

  if (params.crop) {
    query = query.eq('crop', params.crop);
  }

  const { data, error } = await query;
  if (error) throw error;

  // Aggregate statistics
  const stats: { [metric: string]: { events: number; days: Set<string> } } = {};

  (data || []).forEach((item) => {
    if (!stats[item.metric_name]) {
      stats[item.metric_name] = { events: 0, days: new Set() };
    }
    stats[item.metric_name].events++;
    stats[item.metric_name].days.add(item.event_date);
  });

  return Object.entries(stats).map(([metric_name, data]) => ({
    metric_name,
    total_events: data.events,
    distinct_days: data.days.size,
  }));
};
