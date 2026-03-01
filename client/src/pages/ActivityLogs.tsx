import { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Avatar, 
  Chip, 
  IconButton, 
  Breadcrumbs, 
  Link as MuiLink,
  CircularProgress,
  alpha,
  useTheme,
  Fade,
  Grid
} from '@mui/material';
import { 
  History, 
  Car, 
  FileText, 
  Clock,
  ChevronRight,
  Activity
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';

interface ActivityLog {
  id: number;
  type: 'leave' | 'mobility' | 'service';
  description: string;
  status: string;
  created_at: string;
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    let isMounted = true;
    const fetchLogs = async () => {
      try {
        const { data } = await api.get('/system/activity-feed');
        if (isMounted) {
          setLogs(data.data || []);
        }
      } catch (err) {
        console.error("Failed to fetch activity logs", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };
    fetchLogs();
    return () => { isMounted = false; };
  }, []);

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontFamily: 'Poppins', letterSpacing: -0.5 }}>
              Activity Stream
            </Typography>
            <Breadcrumbs separator="•" sx={{ '& .MuiBreadcrumbs-separator': { color: 'text.disabled' } }}>
              <MuiLink underline="hover" color="inherit" href="/" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Poppins' }}>
                Home
              </MuiLink>
              <Typography color="primary" sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Poppins' }}>
                System Logs
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2, display: 'flex' }}>
              <Activity size={20} />
            </Box>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={40} thickness={4} color="primary" />
        </Box>
      ) : (
        <Stack spacing={2}>
          {logs.map((log, idx) => (
            <Fade in={true} timeout={300 + idx * 50} key={`${log.type}-${log.id}`}>
              <Paper 
                elevation={0} 
                sx={{ 
                  p: 2.5, 
                  borderRadius: 4, 
                  border: '1px solid', 
                  borderColor: 'divider', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  '&:hover': { 
                    borderColor: 'primary.main', 
                    boxShadow: '0 8px 16px -4px rgba(0,0,0,0.05)',
                    bgcolor: alpha(theme.palette.primary.main, 0.01)
                  },
                  cursor: 'pointer'
                }}
              >
                <Stack direction="row" spacing={3} alignItems="center">
                  <Avatar 
                    variant="rounded"
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: 2.5,
                      bgcolor: log.type === 'leave' ? alpha('#ef4444', 0.1) : 
                               log.type === 'mobility' ? alpha('#64748b', 0.1) : 
                               alpha('#f59e0b', 0.1),
                      color: log.type === 'leave' ? '#ef4444' : 
                             log.type === 'mobility' ? '#64748b' : 
                             '#f59e0b',
                    }}
                  >
                    {log.type === 'leave' ? <FileText size={22} /> : 
                     log.type === 'mobility' ? <Car size={22} /> : <History size={22} />}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary', fontFamily: 'Poppins', mb: 0.5 }}>
                      {log.description}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Clock size={12} color={theme.palette.text.disabled} />
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </Typography>
                      </Stack>
                      <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'divider' }} />
                      <StatusBadge status={log.status} />
                    </Stack>
                  </Box>
                </Stack>
                
                <IconButton 
                  size="small" 
                  sx={{ 
                    bgcolor: 'rgba(0,0,0,0.02)', 
                    color: 'text.disabled',
                    '&:hover': { bgcolor: 'primary.main', color: 'white' } 
                  }}
                >
                  <ChevronRight size={18} />
                </IconButton>
              </Paper>
            </Fade>
          ))}
          
          {logs.length === 0 && (
            <Box sx={{ py: 10, textAlign: 'center', opacity: 0.5 }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600, fontStyle: 'italic', fontFamily: 'Poppins' }}>
                No recent activities found in the stream
              </Typography>
            </Box>
          )}
        </Stack>
      )}
    </MainLayout>
  );
}

function StatusBadge({ status }: { status: string }) {
  const getColors = (s: string) => {
    switch (s) {
      case 'Disetujui':
      case 'Completed':
      case 'Selesai':
        return { bg: alpha('#ef4444', 0.1), text: '#ef4444', border: alpha('#ef4444', 0.1) };
      case 'Ditolak':
        return { bg: alpha('#64748b', 0.1), text: '#64748b', border: alpha('#64748b', 0.1) };
      case 'Menunggu Persetujuan':
      case 'Berjalan':
        return { bg: alpha('#f59e0b', 0.1), text: '#f59e0b', border: alpha('#f59e0b', 0.1) };
      default:
        return { bg: alpha('#94a3b8', 0.1), text: '#94a3b8', border: alpha('#94a3b8', 0.1) };
    }
  };
  
  const colors = getColors(status);
  
  return (
    <Chip 
      label={status} 
      size="small"
      sx={{ 
        height: 20,
        fontSize: '0.6rem', 
        fontWeight: 800, 
        bgcolor: colors.bg, 
        color: colors.text,
        borderRadius: 1,
        border: '1px solid',
        borderColor: colors.border,
        textTransform: 'uppercase',
        fontFamily: 'Poppins'
      }} 
    />
  );
}
