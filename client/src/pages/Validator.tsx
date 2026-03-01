import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  IconButton,
  CircularProgress,
  alpha,
  useTheme,
  Fade,
  Avatar,
  Divider,
  ButtonGroup,
  Chip
} from '@mui/material';
import {
  Clock,
  Calendar,
  ShieldCheck,
  Check,
  X as XIcon,
  MoreVertical
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';

type Tab = 'leave' | 'mobility';

export default function Validator() {
  const [activeType, setActiveType] = useState<Tab>('leave');
  const [data, setData] = useState<{ pending: any[], approved: any[], rejected: any[] }>({
    pending: [],
    approved: [],
    rejected: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoints = activeType === 'leave'
        ? ['/izin/log/pending', '/izin/log/approved', '/izin/log/rejected']
        : ['/mobilitas/pending', '/mobilitas/approved', '/mobilitas/rejected'];

      console.log(`Validator: Fetching ${activeType} data...`);

      const results = await Promise.allSettled(
        endpoints.map(url => api.get(url))
      );

      const [pendingRes, approvedRes, rejectedRes] = results.map(res =>
        res.status === 'fulfilled' ? res.value : { data: { data: [] } }
      );

      // Log any failures
      results.forEach((res, i) => {
        if (res.status === 'rejected') {
          console.error(`Validator: Failed to fetch ${endpoints[i]}`, res.reason);
        }
      });

      setData({
        pending: pendingRes.data.data || [],
        approved: approvedRes.data.data || [],
        rejected: rejectedRes.data.data || []
      });

      console.log('Validator: Data updated successfully', {
        pending: pendingRes.data.data?.length || 0,
        approved: approvedRes.data.data?.length || 0,
        rejected: rejectedRes.data.data?.length || 0
      });
    } catch (err: any) {
      console.error("Validator: Unexpected error", err);
      setError("Unable to connect to the security validation service.");
    } finally {
      setLoading(false);
    }
  }, [activeType]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAction = async (id: number, action: 'Disetujui' | 'Ditolak' | 'Menunggu Persetujuan') => {
    try {
      const endpoint = activeType === 'leave' ? `/izin/log/update/${id}` : `/mobilitas/edit/${id}`;
      await api.put(endpoint, { status: action });
      fetchData();
    } catch (err) {
      alert('Action failed');
    }
  };

  const columns = [
    { id: 'pending', title: 'Pending Review', color: '#f59e0b', items: data.pending },
    { id: 'approved', title: 'Approved', color: '#10b981', items: data.approved },
    { id: 'rejected', title: 'Rejected', color: '#ef4444', items: data.rejected }
  ];

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 2 }}>
          <CircularProgress size={40} thickness={4} />
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            Accessing Security Vault...
          </Typography>
        </Box>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <Box sx={{ p: 6, textAlign: 'center', bgcolor: alpha(theme.palette.error.main, 0.02), borderRadius: 4, border: '1px dashed', borderColor: 'error.light' }}>
          <ShieldCheck size={48} color={theme.palette.error.main} style={{ marginBottom: 16 }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Vault Connection Error</Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>{error}</Typography>
          <Button variant="contained" color="error" onClick={() => fetchData()}>Retry Authentication</Button>
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, mb: 0.5, display: 'block' }}>
              Workflow Management
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, letterSpacing: -0.5 }}>
              Validation Board
            </Typography>
          </Grid>
          <Grid>
            <Stack direction="row" spacing={2} alignItems="center">
              <ButtonGroup size="small" sx={{ bgcolor: 'white', borderRadius: 2, p: 0.5, border: '1px solid #e2e8f0' }}>
                <Button
                  onClick={() => setActiveType('leave')}
                  sx={{
                    border: 'none !important', borderRadius: '6px !important', px: 2, fontWeight: 700,
                    bgcolor: activeType === 'leave' ? '#eff6ff' : 'transparent',
                    color: activeType === 'leave' ? 'primary.main' : 'text.secondary',
                  }}
                >
                  Permits
                </Button>
                <Button
                  onClick={() => setActiveType('mobility')}
                  sx={{
                    border: 'none !important', borderRadius: '6px !important', px: 2, fontWeight: 700,
                    bgcolor: activeType === 'mobility' ? '#eff6ff' : 'transparent',
                    color: activeType === 'mobility' ? 'primary.main' : 'text.secondary',
                  }}
                >
                  Mobility
                </Button>
              </ButtonGroup>
              <Button variant="contained" size="small" sx={{ height: 40, px: 3, fontWeight: 700, borderRadius: 2 }}>
                Clear Board
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={40} thickness={4} color="primary" />
        </Box>
      ) : (
        <Box sx={{
          display: 'flex',
          gap: 3,
          overflowX: 'auto',
          pb: 2,
          minHeight: 'calc(100vh - 250px)',
          alignItems: 'flex-start'
        }}>
          {columns.map((col) => (
            <Box key={col.id} sx={{ minWidth: 340, width: 340, flexShrink: 0 }}>
              <Box sx={{
                mb: 2,
                px: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: col.color }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', textTransform: 'uppercase', letterSpacing: 1 }}>
                    {col.title}
                  </Typography>
                  <Chip
                    label={col.items.length}
                    size="small"
                    sx={{ height: 20, fontWeight: 800, bgcolor: '#f1f5f9', color: '#64748b' }}
                  />
                </Stack>
                <IconButton size="small"><MoreVertical size={16} /></IconButton>
              </Box>

              <Stack spacing={2}>
                {col.items.length > 0 ? col.items.map((item, idx) => (
                  <Fade in={true} key={item.id} timeout={300 + idx * 50}>
                    <Box>
                      <KanbanCard
                        type={activeType}
                        item={item}
                        onAction={(id: number, action: 'Disetujui' | 'Ditolak' | 'Menunggu Persetujuan') => handleAction(id, action)}
                        columnId={col.id}
                      />
                    </Box>
                  </Fade>
                )) : (
                  <Box sx={{
                    p: 4,
                    borderRadius: 1,
                    border: '2px dashed #e2e8f0',
                    textAlign: 'center',
                    bgcolor: alpha('#f8fafc', 0.5)
                  }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8' }}>
                      EMPTY COLUMN
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Box>
          ))}
        </Box>
      )}
    </MainLayout>
  );
}

function KanbanCard({ type, item, onAction, columnId }: any) {
  const theme = useTheme();

  const tags = type === 'leave'
    ? [item.department || 'General', 'Permit']
    : [item.merk || 'Vehicle', 'Logistics'];

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 1,
        border: '1px solid #e2e8f0',
        transition: 'all 0.2s ease',
        cursor: 'pointer',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          {tags.map((tag, i) => (
            <Chip
              key={i}
              label={tag}
              size="small"
              sx={{
                height: 18,
                fontSize: '0.6rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                bgcolor: i === 0 ? alpha(theme.palette.primary.main, 0.1) : '#f1f5f9',
                color: i === 0 ? 'primary.main' : '#64748b',
                borderRadius: 0
              }}
            />
          ))}
        </Stack>

        <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827', mb: 0.5, lineHeight: 1.3 }}>
          {type === 'leave' ? item.nama_karyawan : item.nama_peminjam}
        </Typography>

        <Typography variant="body2" sx={{
          color: '#64748b',
          fontSize: '0.8rem',
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: 1.5
        }}>
          {type === 'leave' ? item.alasan : item.tujuan}
        </Typography>

        <Divider sx={{ mb: 2, opacity: 0.5 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{
              width: 24, height: 24, fontSize: '0.65rem',
              bgcolor: 'primary.main', fontWeight: 800
            }}>
              {(type === 'leave' ? item?.nama_karyawan : item?.nama_peminjam)?.charAt(0) || 'U'}
            </Avatar>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Calendar size={12} color="#94a3b8" />
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b' }}>
                {new Date(item?.created_at || item?.tanggal || new Date()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </Typography>
            </Stack>
          </Stack>

          <Stack direction="row" spacing={0.5}>
            {columnId === 'pending' ? (
              <>
                <IconButton
                  size="small"
                  onClick={() => onAction(item.id, 'Ditolak')}
                  sx={{ color: '#ef4444', bgcolor: '#fee2e2', borderRadius: 1.5, '&:hover': { bgcolor: '#fecaca' } }}
                >
                  <XIcon size={14} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => onAction(item.id, 'Disetujui')}
                  sx={{ color: '#10b981', bgcolor: '#dcfce7', borderRadius: 1.5, '&:hover': { bgcolor: '#bbf7d0' } }}
                >
                  <Check size={14} />
                </IconButton>
              </>
            ) : (
              <IconButton
                size="small"
                onClick={() => onAction(item.id, 'Menunggu Persetujuan')}
                sx={{ color: '#64748b', bgcolor: '#f1f5f9', borderRadius: 1.5 }}
              >
                <Clock size={14} />
              </IconButton>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

