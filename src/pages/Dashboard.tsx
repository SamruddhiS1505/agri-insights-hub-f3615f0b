import DataForm from '@/components/DataForm';
import { Sprout, TrendingUp, BarChart3, CloudRain } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) => (
  <div className="card-elevated p-6 animate-slide-up">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="page-container">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary/5 via-secondary to-background border-b border-border">
        <div className="content-wrapper py-8 lg:py-12">
          <div className="max-w-3xl">
            <h1 className="section-title text-3xl lg:text-4xl">
              Welcome to CropAdvisor
            </h1>
            <p className="section-subtitle text-lg">
              Record your crop data and get smart insights for better farming decisions.
            </p>
          </div>
        </div>
      </div>

      <div className="content-wrapper">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={Sprout}
            label="Active Crops"
            value="--"
            color="bg-primary/10 text-primary"
          />
          <StatCard
            icon={TrendingUp}
            label="Avg. Yield"
            value="--"
            color="bg-success/10 text-success"
          />
          <StatCard
            icon={BarChart3}
            label="Total Records"
            value="--"
            color="bg-accent/10 text-accent-foreground"
          />
          <StatCard
            icon={CloudRain}
            label="Rainfall (mm)"
            value="--"
            color="bg-primary/10 text-primary"
          />
        </div>

        {/* Data Entry Form */}
        <div className="card-elevated p-6 lg:p-8 animate-fade-in">
          <div className="mb-6">
            <h2 className="text-xl font-display font-semibold text-foreground mb-2">
              Record Crop Data
            </h2>
            <p className="text-muted-foreground">
              Enter your farming metrics to track and analyze crop performance over time.
            </p>
          </div>
          <DataForm />
        </div>

        {/* Tips Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
              <Sprout className="w-5 h-5 text-primary" />
              Track Your Metrics
            </h3>
            <p className="text-sm text-muted-foreground">
              Record yield, fertilizer usage, pest levels, and rainfall regularly for accurate forecasting.
            </p>
          </div>
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-foreground" />
              Analyze Trends
            </h3>
            <p className="text-sm text-muted-foreground">
              Visit the Time Series page to view trends and forecast future crop performance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
