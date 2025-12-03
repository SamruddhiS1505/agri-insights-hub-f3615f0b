import { useState } from 'react';
import { getStats, StatsParams, StatsData } from '@/api/api';
import StatsTable from '@/components/StatsTable';
import { toast } from '@/hooks/use-toast';
import { User, Leaf, Calendar, BarChart3, Loader2 } from 'lucide-react';

const Stats = () => {
  const [params, setParams] = useState<StatsParams>({
    farmer_id: '',
    crop: '',
    date_from: '',
    date_to: '',
  });
  const [statsData, setStatsData] = useState<StatsData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFetchStats = async () => {
    if (!params.farmer_id || !params.date_from || !params.date_to) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in Farmer ID and date range.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = await getStats(params);
      setStatsData(data);
      if (data.length === 0) {
        toast({
          title: 'No Data Found',
          description: 'No statistics found for the given parameters.',
        });
      } else {
        toast({
          title: 'Statistics Loaded',
          description: `Found ${data.length} metric(s).`,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch statistics. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary to-background border-b border-border">
        <div className="content-wrapper py-8 lg:py-12">
          <div className="max-w-3xl">
            <h1 className="section-title text-3xl lg:text-4xl flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" />
              Statistics Overview
            </h1>
            <p className="section-subtitle text-lg">
              View aggregated statistics for your crop data by metric type.
            </p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Parameters Card */}
        <div className="card-elevated p-6 lg:p-8 mb-8 animate-fade-in">
          <h2 className="text-xl font-display font-semibold text-foreground mb-6">
            Filter Parameters
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>

          {/* Action Button */}
          <div className="mt-8">
            <button
              onClick={handleFetchStats}
              disabled={isLoading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  View Stats
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Stats Table */}
        <div className="animate-slide-up">
          <StatsTable data={statsData} />
        </div>

        {/* Info Cards */}
        {statsData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card-elevated p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <p className="text-sm text-muted-foreground mb-1">Total Metrics</p>
              <p className="text-3xl font-display font-bold text-primary">{statsData.length}</p>
            </div>
            <div className="card-elevated p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-sm text-muted-foreground mb-1">Total Events</p>
              <p className="text-3xl font-display font-bold text-foreground">
                {statsData.reduce((sum, s) => sum + s.total_events, 0).toLocaleString()}
              </p>
            </div>
            <div className="card-elevated p-6 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-muted-foreground mb-1">Avg Events/Metric</p>
              <p className="text-3xl font-display font-bold text-accent">
                {Math.round(
                  statsData.reduce((sum, s) => sum + s.total_events, 0) / statsData.length
                ).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
