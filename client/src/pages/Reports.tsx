import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  IconButton,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
  alpha,
  useTheme,
  Paper,
  Divider,
  Chip,
  ButtonGroup,
  Avatar,
  Fade
} from '@mui/material';
import {
  TrendingUp,
  Download,
  Target,
  Users,
  Activity,
  ArrowUpRight,
  ChevronRight,
  MoreVertical,
  Layers,
  Zap,
  MousePointer2,
  Timer,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import ApexChartWidget from '../components/ApexChartWidget';
import DataTable from '../components/DataTable';
import api from '../services/api';
import { exportToPdf } from '../services/pdfService';

/**
 * PROFESSIONAL ENTERPRISE ANALYTICS
 * Refactored using Dashboard reference layout (MUI v6 Grid sizing, flexGrow, and isolated containers)
 */
export default function Reports() {
  const [isExporting, setIsExporting] = useState(false);
  const [deptUsage, setDeptUsage] = useState<any[]>([]);
  const [leaveReasons, setLeaveReasons] = useState<any[]>([]);
  const [monthlyTrends, setMonthlyTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [topIzin, setTopIzin] = useState<any[]>([]);
  const theme = useTheme();

  const fetchReportData = useCallback(async () => {
    setLoading(true);
    try {
      const [deptRes, reasonsRes, vehTrendsRes, izinTrendsRes, recentRes] = await Promise.all([
        api.get('/analytics/dept-usage'),
        api.get('/analytics/leave-reasons'),
        api.get('/analytics/peminjaman-monthly'),
        api.get('/analytics/izin-monthly'),
        api.get('/analytics/top-izin')
      ]);

      if (deptRes.data.success) setDeptUsage(deptRes.data.data);
      if (reasonsRes.data.success) setLeaveReasons(reasonsRes.data.data);

      if (vehTrendsRes.data.success && izinTrendsRes.data.success) {
        const combined = vehTrendsRes.data.labels.map((name: string, i: number) => ({
          name,
          logistics: vehTrendsRes.data.data[i] || 0,
          permits: izinTrendsRes.data.data[i] || 0
        }));
        setMonthlyTrends(combined);
      }

      if (recentRes.data.success) {
        setTopIzin(recentRes.data.data.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to load reports", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReportData();
  }, [fetchReportData]);

  const handleExport = async () => {
    setIsExporting(true);
    await exportToPdf('reports-content', `Analytics-Report-${new Date().toISOString().split('T')[0]}`);
    setIsExporting(false);
  };

  return (
    <MainLayout>
      <Fade in={true} timeout={600}>
        <Box>
          {/* ==========================================
              HEADER SECTION
          ========================================== */}
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Breadcrumbs separator={<Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#cbd5e1', mx: 0.5 }} />} sx={{ mb: 1 }}>
                <MuiLink underline="hover" color="inherit" href="/" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>App</MuiLink>
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: 'primary.main' }}>Intelligence</Typography>
              </Breadcrumbs>
              <Typography variant="h1" sx={{ mb: 1, fontSize: '2.25rem', color: '#0f172a', fontWeight: 800, letterSpacing: '-0.02em' }}>
                System Performance
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', fontWeight: 500 }}>
                Real-time insights and system resource utilization metrics.
              </Typography>
            </Box>

            <Stack direction="row" spacing={2} alignItems="center">
              <ButtonGroup sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', p: 0.5, borderRadius: '8px' }}>
                {['7d', '30d', '90d'].map((range) => (
                  <Button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    sx={{
                      border: 'none !important', borderRadius: '6px !important', minWidth: 48, height: 34,
                      fontSize: '0.75rem', fontWeight: 700,
                      bgcolor: timeRange === range ? '#f1f5f9' : 'transparent',
                      color: timeRange === range ? '#0f172a' : '#64748b',
                    }}
                  >
                    {range}
                  </Button>
                ))}
              </ButtonGroup>
              <Button
                variant="contained"
                disabled={isExporting}
                startIcon={!isExporting && <Download size={18} />}
                onClick={handleExport}
                sx={{
                  bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' },
                  height: 44, px: 3, borderRadius: '8px', textTransform: 'none', fontWeight: 700,
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.25)'
                }}
              >
                {isExporting ? 'Exporting...' : 'Export Report'}
              </Button>
            </Stack>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}><CircularProgress size={40} thickness={4} /></Box>
          ) : (
            <Box id="reports-content">

              {/* ==========================================
                  ROW 1: KPI CARDS
              ========================================== */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {[
                  { label: 'System Logs', value: (monthlyTrends || []).reduce((a, b) => a + (Number(b.logistics) || 0) + (Number(b.permits) || 0), 0), trend: '+14.2%', icon: <Activity size={24} />, color: '#3b82f6' },
                  { label: 'Avg Logistics', value: Math.round((monthlyTrends || []).reduce((a, b) => a + (Number(b.logistics) || 0), 0) / (monthlyTrends?.length || 1)), trend: '+8.4%', icon: <Layers size={24} />, color: '#10b981' },
                  { label: 'Unique Staff', value: (deptUsage || []).reduce((a, b) => a + (Number(b.total) || 0), 0), trend: 'Stable', icon: <Users size={24} />, color: '#6366f1' },
                  { label: 'Avg Session', value: '4m 32s', trend: '+2.1%', icon: <Timer size={24} />, color: '#f59e0b' },
                ].map((kpi, i) => (
                  <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                    <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                          <Box sx={{ p: 1.5, borderRadius: '10px', bgcolor: alpha(kpi.color, 0.1), color: kpi.color, display: 'flex' }}>
                            {kpi.icon}
                          </Box>
                          <Chip
                            label={kpi.trend}
                            size="small"
                            sx={{
                              height: 24, fontWeight: 700, borderRadius: '6px', fontSize: '0.7rem',
                              bgcolor: kpi.trend.startsWith('+') ? '#dcfce7' : '#f1f5f9',
                              color: kpi.trend.startsWith('+') ? '#10b981' : '#64748b'
                            }}
                          />
                        </Stack>
                        <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '1.85rem', color: '#0f172a', mb: 0.5 }}>
                          {kpi.value}
                        </Typography>
                        <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: '0.75rem' }}>
                          {kpi.label}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              {/* ==========================================
                  ROW 2: CHARTS
              ========================================== */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Comparative Activity Trends</Typography>
                        <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Volume of logistics vs personnel permits monthly</Typography>
                      </Box>
                      <IconButton size="small"><MoreVertical size={20} color="#94a3b8" /></IconButton>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3, minHeight: 320 }}>
                      <ApexChartWidget data={monthlyTrends || []} type="area" height={320} colors={['#3b82f6', '#10b981']} />
                    </CardContent>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2.5, borderBottom: '1px solid #f1f5f9' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Resource Drivers</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>Top leave request categories</Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 320 }}>
                      <ApexChartWidget data={leaveReasons || []} type="pie" height={320} />
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* ==========================================
                  ROW 3: DATA TABLES & BREAKDOWN
              ========================================== */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, lg: 8 }}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Recent Operational Activity</Typography>
                      <Button size="small" endIcon={<ChevronRight size={16} />} sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'none' }}>View All Logs</Button>
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <DataTable
                        columns={[
                          {
                            header: 'Employee', accessor: (item: any) => (
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700 }}>
                                  {item?.nama_karyawan?.charAt(0) || 'U'}
                                </Avatar>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: '#0f172a' }}>{item?.nama_karyawan || 'Unknown'}</Typography>
                              </Stack>
                            )
                          },
                          {
                            header: 'Reason', accessor: (item: any) => (
                              <Typography variant="body2" sx={{ color: '#334155', fontWeight: 500, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {item?.alasan || '-'}
                              </Typography>
                            )
                          },
                          {
                            header: 'Status', accessor: (item: any) => (
                              <Chip
                                label={item?.status || 'Pending'}
                                size="small"
                                sx={{
                                  height: 24, fontSize: '0.7rem', fontWeight: 800,
                                  bgcolor: item?.status === 'Disetujui' ? '#dcfce7' : '#f1f5f9',
                                  color: item?.status === 'Disetujui' ? '#10b981' : '#64748b',
                                  borderRadius: '6px', textTransform: 'uppercase', letterSpacing: 0.5
                                }}
                              />
                            )
                          }
                        ]}
                        data={topIzin || []}
                      />
                    </Box>
                  </Card>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9' }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#0f172a' }}>Departmental Load</Typography>
                      <Layers size={20} color="#94a3b8" />
                    </Box>
                    <CardContent sx={{ p: 3, flexGrow: 1 }}>
                      <Stack spacing={2.5}>
                        {deptUsage.slice(0, 5).map((item, i) => (
                          <Box key={i}>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155' }}>{item.department}</Typography>
                              <Typography variant="body2" sx={{ fontWeight: 800, color: '#0f172a' }}>{item.total} trips</Typography>
                            </Stack>
                            <Box sx={{ width: '100%', height: 8, bgcolor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' }}>
                              <Box sx={{ width: `${Math.min(100, (item.total / (deptUsage[0]?.total || 1)) * 100)}%`, height: '100%', bgcolor: i === 0 ? 'primary.main' : alpha(theme.palette.primary.main, 0.4), borderRadius: 4 }} />
                            </Box>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* ==========================================
                  ROW 4: BOTTOM SYSTEM HEALTH
              ========================================== */}
              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <Paper elevation={0} sx={{
                    p: 3, borderRadius: '12px', display: 'flex', alignItems: 'center', gap: 3,
                    bgcolor: alpha(theme.palette.primary.main, 0.02), border: '1px dashed #cbd5e1'
                  }}>
                    <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: '10px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                      <ShieldCheck size={28} color={theme.palette.primary.main} />
                    </Box>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Operational Health Status</Typography>
                      <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>System diagnostics indicate 100% operational uptime for current resources.</Typography>
                    </Box>
                    <Button variant="outlined" sx={{ borderRadius: '8px', fontWeight: 700, textTransform: 'none', px: 3, height: 40, borderColor: '#cbd5e1', color: '#334155' }}>
                      Run Analytics Sync
                    </Button>
                  </Paper>
                </Grid>
              </Grid>

            </Box>
          )}
        </Box>
      </Fade>
    </MainLayout>
  );
}