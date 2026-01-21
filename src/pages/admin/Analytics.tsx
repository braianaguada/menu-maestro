import { useState } from 'react';
import { useAllMenusViews, useTopPromos } from '@/hooks/useAnalytics';
import { useMenus } from '@/hooks/useAdminMenus';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, Eye, MousePointerClick, TrendingUp, Calendar } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';

const chartConfig = {
  views: {
    label: 'Visitas',
    color: 'hsl(var(--primary))',
  },
  clicks: {
    label: 'Clicks',
    color: 'hsl(var(--accent))',
  },
};

export default function Analytics() {
  const [days, setDays] = useState<number>(14);
  const { data: menus, isLoading: menusLoading } = useMenus();
  const { data: viewsData, isLoading: viewsLoading } = useAllMenusViews(days);
  const { data: topPromos, isLoading: promosLoading } = useTopPromos(30);

  const isLoading = menusLoading || viewsLoading || promosLoading;

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), 'd MMM', { locale: es });
  };

  const totalClicks = topPromos?.reduce((sum, p) => sum + p.clicks, 0) || 0;

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-2">
          Analítica
        </h1>
        <p className="text-muted-foreground">
          Estadísticas de visitas y rendimiento de promociones
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Período:</span>
        <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v))}>
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Últimos 7 días</SelectItem>
            <SelectItem value="14">Últimos 14 días</SelectItem>
            <SelectItem value="30">Últimos 30 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Eye}
          label="Visitas Totales"
          value={viewsData?.totalViews || 0}
          loading={isLoading}
          color="primary"
        />
        <StatCard
          icon={MousePointerClick}
          label="Clicks en Promos"
          value={totalClicks}
          loading={isLoading}
          color="accent"
        />
        <StatCard
          icon={BarChart3}
          label="Menús Activos"
          value={menus?.filter(m => m.status === 'published').length || 0}
          loading={isLoading}
          color="green"
        />
        <StatCard
          icon={TrendingUp}
          label="Promedio/día"
          value={viewsData?.totalViews ? Math.round(viewsData.totalViews / days) : 0}
          loading={isLoading}
          color="yellow"
        />
      </div>

      {/* Views Chart */}
      <div className="gradient-card border border-border/50 rounded-xl p-6 mb-8">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Visitas por día
        </h2>
        
        {viewsLoading ? (
          <Skeleton className="h-[300px] w-full rounded-lg" />
        ) : viewsData?.dailyViews && viewsData.dailyViews.length > 0 ? (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={viewsData.dailyViews}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip 
                content={<ChartTooltipContent labelFormatter={(value) => format(parseISO(value as string), 'EEEE, d MMM', { locale: es })} />}
              />
              <Area
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#viewsGradient)"
              />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            No hay datos de visitas aún
          </div>
        )}
      </div>

      {/* Top Promos */}
      <div className="gradient-card border border-border/50 rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold text-foreground mb-4">
          Top Promociones (últimos 30 días)
        </h2>
        
        {promosLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : topPromos && topPromos.length > 0 ? (
          <div className="space-y-3">
            {topPromos.map((promo, index) => (
              <div
                key={promo.promotion_id}
                className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {promo.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {promo.menu_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="w-4 h-4 text-muted-foreground" />
                  <span className="font-semibold text-foreground">
                    {promo.clicks}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No hay datos de promociones aún
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  loading?: boolean;
  color: 'primary' | 'accent' | 'green' | 'yellow';
}

function StatCard({ icon: Icon, label, value, loading, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    green: 'bg-green-500/10 text-green-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <div className="gradient-card border border-border/50 rounded-xl p-5">
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {loading ? (
        <Skeleton className="h-8 w-16 mb-1" />
      ) : (
        <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
      )}
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
