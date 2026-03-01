import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { useTheme } from '@mui/material/styles';
import { Box, Typography, IconButton } from '@mui/material';
import { Info } from 'lucide-react';
import type { ApexOptions } from 'apexcharts';

interface ChartData {
  name: string;
  value: number;
}

interface ApexChartWidgetProps {
  title?: string;
  data: any[];
  type: 'bar' | 'pie' | 'area' | 'radar' | 'line';
  colors?: string[];
  height?: number | string;
}

const ApexChartWidget: React.FC<ApexChartWidgetProps> = ({ title, data, type, colors, height = 300 }) => {
  const theme = useTheme();
  
  // Prepare data for ApexCharts
  let series: any[] = [];
  let categories: string[] = [];

  if (type === 'pie') {
    series = data.map(d => d.value || d.total || 0);
    categories = data.map(d => d.name || d.department || d.label || '');
  } else {
    // Check if we have multiple data points or just one series
    const firstItem = data[0];
    const keys = firstItem ? Object.keys(firstItem).filter(k => typeof firstItem[k] === 'number') : [];
    
    if (keys.length > 1 && type !== 'radar') {
       series = keys.map(key => ({
         name: key.charAt(0).toUpperCase() + key.slice(1),
         data: data.map(d => d[key])
       }));
    } else {
       const valueKey = keys[0] || 'value';
       series = [{ 
         name: title || 'Data', 
         data: data.map(d => d[valueKey] || d.value || d.total || 0) 
       }];
    }
    categories = data.map(d => d.name || d.department || d.label || '');
  }
    
  const chartColors = colors || [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main, theme.palette.error.main, '#6366f1', '#8b5cf6'];

  const commonOptions: ApexOptions = {
    chart: {
      fontFamily: theme.typography.fontFamily,
      toolbar: { show: false },
      background: 'transparent',
    },
    colors: chartColors,
    dataLabels: { enabled: false },
    theme: { mode: 'light' },
    grid: {
      borderColor: '#f1f5f9',
      strokeDashArray: 4,
      padding: { top: 0, right: 0, bottom: 0, left: 10 }
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px' },
      x: { show: true },
      marker: { show: true },
    }
  };

  const lineOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'line', zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 600 } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 600 } } },
    legend: { 
      show: series.length > 1,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const radarOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'radar' },
    plotOptions: {
      radar: {
        polygons: {
          strokeColors: '#e2e8f0',
          connectorColors: '#e2e8f0',
          fill: { colors: ['#f8fafc', '#fff'] }
        }
      }
    },
    stroke: { width: 2 },
    fill: { opacity: 0.2 },
    markers: { size: 4, strokeWidth: 2 },
    xaxis: {
      categories: categories,
      labels: { style: { colors: '#64748b', fontSize: '11px', fontWeight: 600 } }
    },
    yaxis: { show: false },
    legend: { show: false }
  };

  const barOptions: ApexOptions = {
    ...commonOptions,
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '45%',
        distributed: type === 'bar' && series.length === 1,
        dataLabels: { position: 'top' }
      }
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 600 }
      }
    },
    yaxis: {
      labels: {
        style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 600 }
      }
    },
    legend: { 
      show: series.length > 1,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const areaOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'area', zoom: { enabled: false } },
    stroke: { curve: 'smooth', width: 3 },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.05,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 600 } }
    },
    yaxis: { labels: { style: { colors: '#94a3b8', fontSize: '12px', fontWeight: 600 } } },
    legend: { 
      show: series.length > 1,
      position: 'top',
      horizontalAlign: 'right'
    }
  };

  const pieOptions: ApexOptions = {
    ...commonOptions,
    chart: { ...commonOptions.chart, type: 'donut' },
    plotOptions: {
      pie: {
        donut: {
          size: '75%',
          labels: {
            show: true,
            name: { show: true, fontSize: '14px', fontWeight: 600, color: '#64748b', offsetY: -5 },
            value: { show: true, fontSize: '24px', fontWeight: 700, color: '#1e293b', offsetY: 5 },
            total: { 
              show: true, 
              label: 'Total', 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#64748b' 
            }
          }
        }
      }
    },
    labels: categories,
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '13px',
      fontWeight: 500,
      labels: { colors: '#475569' },
      markers: { radius: 12 },
      itemMargin: { horizontal: 10, vertical: 5 }
    },
    dataLabels: { enabled: false }
  };

  return (
    <Box sx={{ width: '100%', height: '100%', minHeight: height }}>
      {title && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>{title}</Typography>
          <IconButton size="small"><Info size={16} /></IconButton>
        </Box>
      )}
      
      {type === 'bar' && (
        <ReactApexChart options={barOptions} series={series} type="bar" height={height} />
      )}
      
      {type === 'area' && (
        <ReactApexChart options={areaOptions} series={series} type="area" height={height} />
      )}
      
      {type === 'pie' && (
        <ReactApexChart options={pieOptions} series={series as number[]} type="donut" height={height} />
      )}

      {type === 'line' && (
        <ReactApexChart options={lineOptions} series={series} type="line" height={height} />
      )}

      {type === 'radar' && (
        <ReactApexChart options={radarOptions} series={series} type="radar" height={height} />
      )}
    </Box>
  );
};

export default ApexChartWidget;
