import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  AlertCircle,
  Zap,
  ChevronRight,
  Users as UsersIcon,
  Car,
} from 'lucide-react';
import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Chip,
  alpha,
  useTheme,
  Fade,
  CircularProgress,
} from '@mui/material';
import MainLayout from '../layouts/MainLayout';
import ApexChartWidget from '../components/ApexChartWidget';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';


interface PeminjamanItem {
  nama_karyawan: string;
  nik: string;
  merk: string;
  plat_no: string;
  status: string;
}

interface IzinItem {
  nama_karyawan: string;
  department?: string;
  alasan: string;
  status: string;
}

interface MonthlyData {
  name: string;
  value: number;
}

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  useAuth();

  const [topPeminjaman, setTopPeminjaman] = useState<PeminjamanItem[]>([]);
  const [topIzin, setTopIzin] = useState<IzinItem[]>([]);
  const [monthlyPeminjaman, setMonthlyPeminjaman] = useState<MonthlyData[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    employees: 0,
    vehicles: 0,
    pending: 0,
    mobility: 0,
    approved: 0,
    rejected: 0,
    total: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [recentRes, izinRes, kpiRes, monthlyVehRes] = await Promise.all([
          api.get('/analytics/top-recent'),
          api.get('/analytics/top-izin'),
          api.get('/analytics/kpi-counts'),
          api.get('/analytics/peminjaman-monthly')
        ]);

        if (recentRes.data.success) setTopPeminjaman(recentRes.data.data || []);
        if (izinRes.data.success) setTopIzin(izinRes.data.data || []);

        if (kpiRes.data.success) {
          const {
            total_employees = 0,
            total_vehicles = 0,
            pending_izin = 0,
            pending_mobility = 0,
            total_mobility = 0,
            approved_total = 0,
            rejected_total = 0
          } = kpiRes.data.data;

          const pending = pending_izin + pending_mobility;
          setStats({
            employees: total_employees,
            vehicles: total_vehicles,
            pending: pending,
            mobility: total_mobility,
            approved: approved_total,
            rejected: rejected_total,
            total: pending + approved_total + rejected_total
          });
        }

        if (monthlyVehRes.data.success) {
          const labels = monthlyVehRes.data.labels || [];
          const data = monthlyVehRes.data.data || [];
          setMonthlyPeminjaman(labels.map((name: string, i: number) => ({
            name,
            value: data[i] || 0
          })));
        }
      } catch (err: any) {
        console.error('Failed to fetch dashboard data', err);
        setError('Connection failed. Please check your backend server.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
          <CircularProgress size={48} thickness={4} />
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
            Synchronizing Database...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <AlertCircle size={48} color={theme.palette.error.main} style={{ marginBottom: 16 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Backend Unreachable</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>{error}</Typography>
          <Button variant="contained" onClick={() => window.location.reload()}>Retry Connection</Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Fade in={true} timeout={600}>
        <Box>
          <Box id="dashboard-content">
            {/* ==========================================
                ROW 1: KPI CARDS
            ========================================== */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {[
                { title: 'Total Workforce', value: stats.employees, icon: <UsersIcon size={20} />, color: '#6366f1', trend: '+12.5%', isUp: true },
                { title: 'Pending Approval', value: stats.pending, icon: <Clock size={20} />, color: '#10b981', trend: '+8.2%', isUp: true },
                { title: 'Fleet Assets', value: stats.vehicles, icon: <Car size={20} />, color: '#3b82f6', trend: '-3.1%', isUp: false },
                { title: 'Mobility Trips', value: stats.mobility, icon: <Zap size={20} />, color: '#f59e0b', trend: '+24.7%', isUp: true },
              ].map((card, i) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={i}>
                  <Card elevation={0} sx={{ height: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ color: '#6b7280', fontWeight: 500 }}>
                          {card.title}
                        </Typography>
                        <Box sx={{ p: 1, borderRadius: '8px', bgcolor: alpha(card.color, 0.1), color: card.color, display: 'flex' }}>
                          {card.icon}
                        </Box>
                      </Stack>
                      <Typography variant="h2" sx={{ fontWeight: 800, fontSize: '1.75rem', color: '#111827', mb: 1 }}>
                        {card.value}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: card.isUp ? '#10b981' : '#ef4444', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {card.trend} <span style={{ color: '#9ca3af', fontWeight: 400 }}>vs last month</span>
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* ==========================================
                ROW 2: CHARTS (Area & Donut)
            ========================================== */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Overview - Area Chart */}
              <Grid size={{ xs: 12, lg: 8 }}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pb: 0 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Overview</Typography>
                      <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 400 }}>Monthly performance for the current year</Typography>
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3, pt: 1, minHeight: 320 }}>
                    {/* Mengubah Chart jadi Area dan warnanya Indigo */}
                    <ApexChartWidget
                      title=""
                      type="area"
                      data={monthlyPeminjaman}
                      colors={['#6366f1']}
                    // Pastikan komponen ApexChartWidget lu punya konfigurasi options prop kalo mau pass ini:
                    // options={{ stroke: { curve: 'smooth' }, fill: { type: 'gradient' } }} 
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Status Ratio - Donut Chart */}
              <Grid size={{ xs: 12, lg: 4 }}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 3, pb: 0 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Permit Sources</Typography>
                    <Typography variant="body2" sx={{ color: '#6b7280', fontWeight: 400 }}>Where your requests come from</Typography>
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {/* Mengubah Pie jadi Donut */}
                      <ApexChartWidget
                        title=""
                        type="pie"
                        data={[
                          { name: 'Approved', value: stats.approved },
                          { name: 'Pending', value: stats.pending },
                          { name: 'Rejected', value: stats.rejected }
                        ]}
                        colors={['#6366f1', '#10b981', '#f59e0b']}
                      />
                    </Box>
                    <Stack spacing={1.5} sx={{ mt: 'auto', pt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#6366f1', mr: 2 }} />
                        <Typography variant="body2" sx={{ flexGrow: 1, color: '#4b5563', fontWeight: 500 }}>Approved</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>{stats.total ? Math.round((stats.approved / stats.total) * 100) : 0}%</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#10b981', mr: 2 }} />
                        <Typography variant="body2" sx={{ flexGrow: 1, color: '#4b5563', fontWeight: 500 }}>Pending</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>{stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}%</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

            </Grid>

            {/* ==========================================
                ROW 3: TABLES
            ========================================== */}
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Recent Mobility</Typography>
                    <Button size="small" endIcon={<ChevronRight size={16} />} sx={{ color: '#6366f1', fontWeight: 600, textTransform: 'none' }} onClick={() => navigate('/mobility')}>
                      View All
                    </Button>
                  </Box>
                  <TableContainer sx={{ flexGrow: 1 }}>
                    <Table size="medium">
                      <TableHead sx={{ bgcolor: 'transparent' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Personnel</TableCell>
                          <TableCell sx={{ color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Vehicle</TableCell>
                          <TableCell align="right" sx={{ color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topPeminjaman.slice(0, 5).map((item, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ borderBottom: '1px solid #f3f4f6' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: alpha('#6366f1', 0.1), color: '#6366f1', fontWeight: 700 }}>
                                  {item.nama_karyawan?.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>{item.nama_karyawan}</Typography>
                                  <Typography variant="caption" sx={{ color: '#6b7280' }}>{item.nik}</Typography>
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #f3f4f6' }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: '#374151' }}>{item.merk}</Typography>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>{item.plat_no}</Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #f3f4f6' }}>
                              <StatusBadge status={item.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <Card elevation={0} sx={{ height: '100%', border: '1px solid #e5e7eb', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#111827' }}>Personnel Activity</Typography>
                    <Button size="small" endIcon={<ChevronRight size={16} />} sx={{ color: '#6366f1', fontWeight: 600, textTransform: 'none' }} onClick={() => navigate('/logs')}>
                      Full Log
                    </Button>
                  </Box>
                  <TableContainer sx={{ flexGrow: 1 }}>
                    <Table size="medium">
                      <TableHead sx={{ bgcolor: 'transparent' }}>
                        <TableRow>
                          <TableCell sx={{ color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Employee</TableCell>
                          <TableCell sx={{ color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Reason</TableCell>
                          <TableCell align="right" sx={{ color: '#6b7280', fontWeight: 600, borderBottom: '1px solid #e5e7eb' }}>Validation</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {topIzin.slice(0, 5).map((item, idx) => (
                          <TableRow key={idx} hover>
                            <TableCell sx={{ borderBottom: '1px solid #f3f4f6' }}>
                              <Typography variant="body2" sx={{ fontWeight: 700, color: '#111827' }}>{item.nama_karyawan}</Typography>
                              <Typography variant="caption" sx={{ color: '#6b7280' }}>{item.department || 'General'}</Typography>
                            </TableCell>
                            <TableCell sx={{ borderBottom: '1px solid #f3f4f6' }}>
                              <Typography variant="body2" sx={{ color: '#4b5563', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                {item.alasan}
                              </Typography>
                            </TableCell>
                            <TableCell align="right" sx={{ borderBottom: '1px solid #f3f4f6' }}>
                              <StatusBadge status={item.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Card>
              </Grid>
            </Grid>

          </Box>
        </Box>
      </Fade>
    </MainLayout>
  );
};

// Komponen Badge dipisah agar lebih rapi
function StatusBadge({ status }: { status: string }) {
  const getColors = (s: string) => {
    switch (s) {
      case 'Disetujui': return { bg: '#dcfce7', text: '#059669' };
      case 'Ditolak': return { bg: '#fee2e2', text: '#dc2626' };
      case 'Menunggu Persetujuan': return { bg: '#fef3c7', text: '#d97706' };
      default: return { bg: '#f3f4f6', text: '#6b7280' };
    }
  };
  const colors = getColors(status);
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: 24,
        fontSize: '0.7rem',
        fontWeight: 700,
        bgcolor: colors.bg,
        color: colors.text,
        borderRadius: '6px',
        textTransform: 'capitalize'
      }}
    />
  );
}

export default Dashboard;