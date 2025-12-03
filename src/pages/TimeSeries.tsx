import { useState, useRef } from 'react';
import { getTimeSeries, TimeSeriesParams, TimeSeriesDataPoint } from '@/api/api';
import TimeSeriesChart from '@/components/TimeSeriesChart';
import { toast } from '@/hooks/use-toast';
import {
  User,
  Leaf,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  Download,
  Loader2,
} from 'lucide-react';

const FREQ_OPTIONS = [
  { value: 'D', label: 'Daily' },
  { value: 'W', label: 'Weekly' },
  { value: 'M', label: 'Monthly' },
];

const TimeSeries = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [params, setParams] = useState<TimeSeriesParams>({
    farmer_id: '',
    crop: '',
    metric_name: '',
    date_from: '',
    date_to: '',
    freq: 'D',
    forecast_periods: 7,
  });
  const [chartData, setChartData] = useState<TimeSeriesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: name === 'forecast_periods' ? parseInt(value) || 0 : value,
    }));
  };

  const handleGenerate = async () => {
    if (!params.farmer_id || !params.metric_name || !params.date_from || !params.date_to) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in Farmer ID, Metric Name, and date range.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await getTimeSeries(params);
      setChartData(data);
      toast({
        title: 'Analysis Complete',
        description: 'Time series data generated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch time series data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadPlot = async () => {
    if (chartData.length === 0) {
      toast({
        title: 'No Data',
        description: 'Generate an analysis first before downloading.',
        variant: 'destructive',
      });
      return;
    }

    setIsDownloading(true);
    try {
      const canvas = chartRef.current?.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `timeseries_plot_${params.farmer_id}_${params.metric_name}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: 'Download Complete',
          description: 'Your plot has been downloaded.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to download plot. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary to-background border-b border-border">
        <div className="content-wrapper py-8 lg:py-12">
          <div className="max-w-3xl">
            <h1 className="section-title text-3xl lg:text-4xl flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              Time Series Analysis
            </h1>
            <p className="section-subtitle text-lg">
              Analyze trends and forecast future values based on your crop data.
            </p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Parameters Card */}
        <div className="card-elevated p-6 lg:p-8 mb-8 animate-fade-in">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            Analysis Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Farmer ID */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <User className="w-4 h-4 text-primary" />
                Farmer ID <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="farmer_id"
                value={params.farmer_id}
                onChange={handleChange}
                placeholder="Enter farmer ID"
                className="input-field"
              />
            </div>

            {/* Crop */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Leaf className="w-4 h-4 text-primary" />
                Crop (Optional)
              </label>
              <input
                type="text"
                name="crop"
                value={params.crop}
                onChange={handleChange}
                placeholder="e.g., Wheat"
                className="input-field"
              />
            </div>

            {/* Metric Name */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <FileText className="w-4 h-4 text-primary" />
                Metric Name <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                name="metric_name"
                value={params.metric_name}
                onChange={handleChange}
                placeholder="e.g., yield, rainfall"
                className="input-field"
              />
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                From Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                name="date_from"
                value={params.date_from}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                To Date <span className="text-destructive">*</span>
              </label>
              <input
                type="date"
                name="date_to"
                value={params.date_to}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Clock className="w-4 h-4 text-primary" />
                Frequency
              </label>
              <select
                name="freq"
                value={params.freq}
                onChange={handleChange}
                className="input-field cursor-pointer"
              >
                {FREQ_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Forecast Periods */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <TrendingUp className="w-4 h-4 text-primary" />
                Forecast Periods
              </label>
              <input
                type="number"
                name="forecast_periods"
                value={params.forecast_periods}
                onChange={handleChange}
                min="1"
                max="365"
                className="input-field"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Generate Analysis
                </span>
              )}
            </button>

            <button
              onClick={handleDownloadPlot}
              disabled={isDownloading || chartData.length === 0}
              className="btn-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Downloading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Download className="w-5 h-5" />
                  Download PNG Plot
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Chart */}
        <div className="animate-slide-up" ref={chartRef}>
          <TimeSeriesChart
            data={chartData}
            title={`${params.metric_name || 'Metric'} Analysis`}
            metricName={params.metric_name || 'Value'}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeSeries;
