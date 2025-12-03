import { StatsData } from '@/api/api';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';

interface StatsTableProps {
  data: StatsData[];
}

const StatsTable = ({ data }: StatsTableProps) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-muted/30 rounded-lg border border-border">
        <BarChart3 className="w-12 h-12 text-muted-foreground/50 mb-4" />
        <p className="text-muted-foreground">No statistics available. Enter parameters and click "View Stats".</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Metric Name
                </span>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Total Events
                </span>
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Distinct Days
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {data.map((row, index) => (
              <tr
                key={index}
                className="hover:bg-muted/50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary capitalize">
                    {row.metric_name}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                  {row.total_events.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-foreground font-medium">
                  {row.distinct_days.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StatsTable;
