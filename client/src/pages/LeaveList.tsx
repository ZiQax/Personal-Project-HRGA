import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link as MuiLink,
  alpha,
  CircularProgress,
  Chip,
  Tooltip,
  Collapse
} from '@mui/material';
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  X,
  Filter,
  Calendar as CalendarIcon,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { usePermissions } from '../hooks/usePermissions';

const leaveSchema = z.object({
  employee_id: z.string().min(1, "Select Employee"),
  alasan: z.string().min(5, "Reason too short"),
  estimasi_keluar: z.string().min(1, "Time required"),
  tanggal: z.string().min(1, "Date required")
});

type LeaveFormValues = z.infer<typeof leaveSchema>;

interface LeaveRecord {
  id: number;
  employee_id: number;
  nama_karyawan: string;
  jabatan: string;
  department: string;
  section: string;
  alasan: string;
  tanggal: string;
  estimasi_keluar: string;
  status: string;
}

const LeaveList = () => {
  const { hasPermission } = usePermissions();
  const [data, setData] = useState<LeaveRecord[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeave, setEditingLeave] = useState<LeaveRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const methods = useForm<LeaveFormValues>({
    resolver: zodResolver(leaveSchema)
  });

  const fetchData = useCallback(async (pageNum: number, search: string = '', start: string = '', end: string = '') => {
    setLoading(true);
    try {
      const { data: response } = await api.get(`/izin/log/pagination?page=${pageNum}&limit=10&search=${search}&startDate=${start}&endDate=${end}`);
      setData(response.data || []);
      setTotalPages(response.pagination?.total_pages || 1);
      setPage(response.pagination?.current_page || 1);
    } catch (err) {
      console.error('Error fetching leave data', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDependencies = useCallback(async () => {
    try {
      const { data: empRes } = await api.get('/employees/pagination?limit=100');
      const res = empRes.data;
      setEmployees(res.data.map((e: any) => ({ label: `${e.nama} (${e.nik})`, value: e.id.toString() })));
    } catch (err) {
      console.error("Failed to fetch dependencies", err);
    }
  }, []);

  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  useEffect(() => {
    fetchData(page, debouncedSearch, startDate, endDate);
  }, [page, debouncedSearch, startDate, endDate, fetchData]);

  const handleOpenModal = (record: LeaveRecord | null = null) => {
    setEditingLeave(record);
    if (record) {
      methods.reset({
        employee_id: record.employee_id?.toString() || '',
        alasan: record.alasan,
        estimasi_keluar: record.estimasi_keluar,
        tanggal: record.tanggal.split('T')[0]
      });
    } else {
      methods.reset({
        employee_id: '',
        alasan: '',
        estimasi_keluar: '',
        tanggal: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this request?')) return;
    try {
      await api.delete(`/izin/log/${id}`);
      fetchData(page, debouncedSearch, startDate, endDate);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const onSubmit = async (formData: LeaveFormValues) => {
    try {
      if (editingLeave) {
        await api.put(`/izin/log/update/${editingLeave.id}`, { ...formData, status: editingLeave.status });
      } else {
        await api.post('/izin', formData);
      }
      setIsModalOpen(false);
      methods.reset();
      fetchData(page, debouncedSearch, startDate, endDate);
    } catch (err) {
      alert('Operation failed');
    }
  };

  const columns = [
    {
      header: 'Date',
      accessor: (item: LeaveRecord) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Poppins', color: 'text.secondary' }}>
          {new Date(item.tanggal).toLocaleDateString('id-ID')}
        </Typography>
      )
    },
    {
      header: 'Employee',
      accessor: (item: LeaveRecord) => (
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>{item.nama_karyawan}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{item.jabatan}</Typography>
        </Box>
      )
    },
    {
      header: 'Unit',
      accessor: (item: LeaveRecord) => (
        <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'Poppins', color: 'text.primary' }}>
          {item.department}
        </Typography>
      )
    },
    {
      header: 'Justification',
      accessor: (item: LeaveRecord) => (
        <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'Poppins', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {item.alasan}
        </Typography>
      )
    },
    {
      header: 'Return Est.',
      accessor: (item: LeaveRecord) => (
        <Stack direction="row" spacing={1} alignItems="center">
          <Clock size={14} color={alpha('#000', 0.4)} />
          <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'Poppins', color: 'primary.main' }}>
            {item.estimasi_keluar}
          </Typography>
        </Stack>
      )
    },
    {
      header: 'Status',
      accessor: (item: LeaveRecord) => <StatusBadge status={item.status} />
    },
    {
      header: 'Actions',
      accessor: (item: LeaveRecord) => (
        <Stack direction="row" spacing={1}>
          {hasPermission('create_leave') && (
            <Tooltip title="Edit Permit">
              <IconButton size="small" onClick={() => handleOpenModal(item)} sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'primary.light' } }}>
                <Edit2 size={16} />
              </IconButton>
            </Tooltip>
          )}
          {hasPermission('delete_leave') && (
            <Tooltip title="Revoke Permit">
              <IconButton size="small" onClick={() => handleDelete(item.id)} sx={{ color: 'text.secondary', '&:hover': { color: 'error.main', bgcolor: 'error.light' } }}>
                <Trash2 size={16} />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      )
    }
  ];

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontFamily: 'Poppins', letterSpacing: -0.5 }}>
              Leave Management
            </Typography>
            <Breadcrumbs separator="•" sx={{ '& .MuiBreadcrumbs-separator': { color: 'text.disabled' } }}>
              <MuiLink underline="hover" color="inherit" href="/" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Poppins' }}>
                Home
              </MuiLink>
              <Typography color="primary" sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Poppins' }}>
                Permit Directory
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={() => handleOpenModal()}
              sx={{
                px: 3,
                py: 1.2,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' },
                boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.25)',
                fontWeight: 700,
                fontFamily: 'Poppins'
              }}
            >
              Create Leave Permit
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Card sx={{ mb: 3, borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }} elevation={0}>
        <CardContent sx={{ p: '16px !important' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField
              fullWidth
              placeholder="Search by personnel name or ID number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} color="#94a3b8" />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchTerm('')}>
                      <X size={16} />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: { borderRadius: 1, bgcolor: 'rgba(0,0,0,0.02)', fontFamily: 'Poppins' }
              }}
            />
            <Button
              variant={showFilters ? "contained" : "outlined"}
              startIcon={<Filter size={18} />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{
                borderRadius: 1,
                px: 3,
                textTransform: 'none',
                fontWeight: 700,
                fontFamily: 'Poppins',
                minWidth: 160
              }}
            >
              {showFilters ? 'Hide Parameters' : 'Date Filters'}
            </Button>
          </Stack>

          <Collapse in={showFilters}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
              <Grid container spacing={2} alignItems="flex-end">
                <Grid item xs={12} sm={5} md={4}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase' }}>
                    Period Start
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><CalendarIcon size={16} /></InputAdornment>,
                      sx: { borderRadius: 1, fontFamily: 'Poppins' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={5} md={4}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', ml: 1, mb: 0.5, display: 'block', textTransform: 'uppercase' }}>
                    Period End
                  </Typography>
                  <TextField
                    fullWidth
                    type="date"
                    size="small"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start"><CalendarIcon size={16} /></InputAdornment>,
                      sx: { borderRadius: 1, fontFamily: 'Poppins' }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  {(startDate || endDate) && (
                    <Button
                      onClick={() => { setStartDate(''); setEndDate(''); }}
                      sx={{ color: 'error.main', fontWeight: 800, fontFamily: 'Poppins', textTransform: 'uppercase', fontSize: '0.7rem' }}
                    >
                      Reset
                    </Button>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress size={40} thickness={4} color="primary" />
        </Box>
      ) : (
        <DataTable
          columns={columns}
          data={data}
          pagination={{
            currentPage: page,
            totalPages: totalPages,
            onPageChange: (p) => setPage(p)
          }}
        />
      )}

      <Dialog
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 1, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Poppins' }}>
            {editingLeave ? 'Update Leave Permit' : 'New Leave Request'}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
            Permit Management System
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '8px !important' }}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
              <Stack spacing={2.5}>
                <FormField
                  isSelect
                  name="employee_id"
                  label="Select Personnel"
                  options={employees}
                />
                <Stack direction="row" spacing={2}>
                  <Box sx={{ flex: 1 }}><FormField name="tanggal" label="Permit Date" type="date" /></Box>
                  <Box sx={{ flex: 1 }}><FormField name="estimasi_keluar" label="Est. Return" type="time" /></Box>
                </Stack>
                <FormField name="alasan" label="Justification" placeholder="Brief explanation for leave..." />
              </Stack>
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'Poppins' }}>Discard</Button>
          <Button
            variant="contained"
            onClick={methods.handleSubmit(onSubmit)}
            sx={{ px: 3, fontWeight: 700, fontFamily: 'Poppins', boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.2)' }}
          >
            {editingLeave ? 'Save Changes' : 'Submit Request'}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

function StatusBadge({ status }: { status: string }) {
  const getColors = (s: string) => {
    switch (s) {
      case 'Disetujui': return { bg: alpha('#ef4444', 0.1), text: '#ef4444' };
      case 'Ditolak': return { bg: alpha('#64748b', 0.1), text: '#64748b' };
      case 'Menunggu Persetujuan': return { bg: alpha('#f59e0b', 0.1), text: '#f59e0b' };
      default: return { bg: alpha('#94a3b8', 0.1), text: '#94a3b8' };
    }
  };
  const colors = getColors(status);
  return (
    <Chip
      label={status}
      size="small"
      sx={{
        height: 22,
        fontSize: '0.65rem',
        fontWeight: 800,
        bgcolor: colors.bg,
        color: colors.text,
        borderRadius: 1.5,
        border: '1px solid',
        borderColor: alpha(colors.text, 0.1),
        textTransform: 'uppercase',
        fontFamily: 'Poppins'
      }}
    />
  );
}

export default LeaveList;
