import React, { useEffect, useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Avatar, 
  Chip, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  InputAdornment,
  alpha,
  CircularProgress,
  Tooltip,
  Paper,
  useTheme
} from '@mui/material';
import { Plus, Trash2, Edit2, Search, X, Filter, LayoutGrid, List as ListIcon } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import DataTable from '../components/DataTable';
import FormField from '../components/FormField';
import api from '../services/api';
import { useDebounce } from '../hooks/useDebounce';
import { ButtonGroup } from '@mui/material';

const employeeSchema = z.object({
  nik: z.string().min(3, "Required").max(20),
  nama: z.string().min(3, "Required").max(100),
  postion: z.string().min(2, "Required"),
  departement_id: z.string().min(1, "Required"),
  section_id: z.string().min(1, "Required"),
  status: z.enum(['active', 'inactive'])
});

const EmployeeList = () => {
  const theme = useTheme();
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'card'>('table');
  const debouncedSearch = useDebounce(searchTerm, 500);

  const methods = useForm({ resolver: zodResolver(employeeSchema), defaultValues: { status: 'active', departement_id: '', section_id: '' } });
  const selectedDeptId = methods.watch('departement_id');

  const fetchOrgData = useCallback(async () => {
    try {
      const { data } = await api.get('/org/departments');
      setDepartments(data.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchSections = useCallback(async (deptId: string) => {
    try {
      const { data } = await api.get(`/org/sections/${deptId}`);
      setSections(data.data);
    } catch (err) { setSections([]); }
  }, []);

  useEffect(() => { fetchOrgData(); }, [fetchOrgData]);
  useEffect(() => { 
    if (selectedDeptId) fetchSections(selectedDeptId);
    else setSections([]);
  }, [selectedDeptId, fetchSections]);

  const fetchEmployees = useCallback(async (pageNum: number, search: string = '') => {
    setLoading(true);
    try {
      const { data: response } = await api.get(`/employees/pagination?page=${pageNum}&limit=10&search=${search}`);
      setEmployees(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setPage(response.data.currentPage || 1);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEmployees(page, debouncedSearch); }, [page, debouncedSearch, fetchEmployees]);

  const handleOpenModal = (employee = null) => {
    setEditingEmployee(employee);
    if (employee) {
      methods.reset({
        nik: employee.nik,
        nama: employee.nama,
        postion: employee.postion,
        departement_id: employee.departement_id?.toString() || '',
        section_id: employee.section_id?.toString() || '',
        status: employee.status
      });
    } else {
      methods.reset({ nik: '', nama: '', postion: '', departement_id: '', section_id: '', status: 'active' });
    }
    setIsModalOpen(true);
  };

  const columns = [
    { 
      header: 'Employee Identity', 
      accessor: (item: any) => (
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 32, height: 32, borderRadius: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 700, fontSize: '0.75rem' }}>{item.nama.charAt(0)}</Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>{item.nama}</Typography>
            <Typography variant="caption" color="text.secondary">ID: {item.nik}</Typography>
          </Box>
        </Stack>
      ) 
    },
    { header: 'Position', accessor: (item: any) => <Typography variant="body2">{item.postion}</Typography> },
    { header: 'Unit', accessor: (item: any) => <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.department_name}</Typography> },
    { 
      header: 'Status', 
      accessor: (item: any) => (
        <Chip label={item.status} size="small" sx={{ height: 20, fontSize: '0.6rem', fontWeight: 700, bgcolor: item.status === 'active' ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.secondary.main, 0.1), color: item.status === 'active' ? 'success.main' : 'secondary.main', borderRadius: 1 }} />
      )
    },
    {
      header: 'Actions',
      accessor: (item: any) => (
        <Stack direction="row" spacing={0.5}>
          <IconButton size="small" onClick={() => handleOpenModal(item)} sx={{ color: '#94a3b8', '&:hover': { color: 'primary.main' } }}><Edit2 size={14} /></IconButton>
          <IconButton size="small" onClick={() => { if(confirm('Delete?')) api.delete(`/employees/${item.id}`).then(() => fetchEmployees(page, debouncedSearch)); }} sx={{ color: '#94a3b8', '&:hover': { color: 'error.main' } }}><Trash2 size={14} /></IconButton>
        </Stack>
      )
    }
  ];

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h2" sx={{ fontWeight: 800 }}>Workforce Management</Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>Maintain and optimize your organizational personnel records.</Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <ButtonGroup size="small" sx={{ bgcolor: 'white', borderRadius: 2, p: 0.5, border: '1px solid #e2e8f0' }}>
              <IconButton onClick={() => setViewMode('table')} sx={{ borderRadius: 1.5, bgcolor: viewMode === 'table' ? '#eff6ff' : 'transparent', color: viewMode === 'table' ? 'primary.main' : '#64748b' }}><ListIcon size={18} /></IconButton>
              <IconButton onClick={() => setViewMode('card')} sx={{ borderRadius: 1.5, bgcolor: viewMode === 'card' ? '#eff6ff' : 'transparent', color: viewMode === 'card' ? 'primary.main' : '#64748b' }}><LayoutGrid size={18} /></IconButton>
            </ButtonGroup>
            <Button variant="contained" startIcon={<Plus size={18} />} onClick={() => handleOpenModal()} sx={{ px: 3, fontWeight: 700 }}>Add Personnel</Button>
          </Stack>
        </Grid>
      </Box>

      <Paper elevation={0} sx={{ p: 2, mb: 3, border: '1px solid #e2e8f0', borderRadius: 2 }}>
        <Stack direction="row" spacing={2}>
          <TextField
            fullWidth
            placeholder="Search database by name, ID or position..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search size={16} color="#94a3b8" /></InputAdornment>,
              endAdornment: searchTerm && <IconButton size="small" onClick={() => setSearchTerm('')}><X size={14} /></IconButton>,
              sx: { bgcolor: '#f8fafc', '& fieldset': { border: 'none' } }
            }}
          />
          <Button variant="outlined" startIcon={<Filter size={16} />} sx={{ px: 3, color: 'text.secondary', borderColor: '#e2e8f0', fontWeight: 700 }}>Filters</Button>
        </Stack>
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress size={32} /></Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={employees} 
          viewMode={viewMode}
          pagination={{ currentPage: page, totalPages: totalPages, onPageChange: (p) => setPage(p) }} 
        />
      )}

      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ px: 3, pt: 3 }}><Typography variant="h4" sx={{ fontWeight: 800 }}>{editingEmployee ? 'Update Profile' : 'New Personnel'}</Typography></DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit((d) => api.post('/employees', d).then(() => { setIsModalOpen(false); fetchEmployees(page, debouncedSearch); }))}>
              <Grid container spacing={2.5}>
                <Grid item xs={6}><FormField name="nik" label="NIK Number" /></Grid>
                <Grid item xs={6}><FormField name="nama" label="Full Name" /></Grid>
                <Grid item xs={12}><FormField name="postion" label="Official Position" /></Grid>
                <Grid item xs={6}><FormField isSelect name="departement_id" label="Department" options={departments.map(d => ({ label: d.name, value: d.id.toString() }))} /></Grid>
                <Grid item xs={6}><FormField isSelect name="section_id" label="Operational Section" options={sections.map(s => ({ label: s.name, value: s.id.toString() }))} /></Grid>
              </Grid>
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsModalOpen(false)} sx={{ color: 'text.secondary', fontWeight: 700 }}>Cancel</Button>
          <Button variant="contained" sx={{ fontWeight: 700 }} onClick={methods.handleSubmit((d) => {
            const req = editingEmployee ? api.put(`/employees/${editingEmployee.id}`, d) : api.post('/employees', d);
            req.then(() => { setIsModalOpen(false); fetchEmployees(page, debouncedSearch); });
          })}>Commit Records</Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default EmployeeList;
