import { useEffect, useState } from 'react';
import { 
  Box, 
  Grid, 
  Typography, 
  Button, 
  Paper, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemSecondaryAction, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Divider,
  Breadcrumbs,
  Link as MuiLink,
  Stack,
  alpha,
  useTheme,
  Fade
} from '@mui/material';
import { 
  Plus, 
  Trash2, 
  Building2, 
  LayoutPanelLeft, 
  ChevronRight, 
  X,
  PlusCircle
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import api from '../services/api';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import FormField from '../components/FormField';

const deptSchema = z.object({
  name: z.string().min(2, "Name too short").max(50),
  description: z.string().optional()
});

const sectionSchema = z.object({
  name: z.string().min(2, "Name too short").max(50),
  deptId: z.string().min(1, "Dept required")
});

export default function OrgManagement() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isSecModalOpen, setIsSecModalOpen] = useState(false);
  const theme = useTheme();

  const deptMethods = useForm({ resolver: zodResolver(deptSchema) });
  const secMethods = useForm({ resolver: zodResolver(sectionSchema) });

  const fetchDepts = async () => {
    try {
      const { data } = await api.get('/org/departments');
      setDepartments(data.data);
    } catch (err) {
      console.error("Failed to fetch departments", err);
    }
  };

  const fetchSections = async (deptId: number) => {
    try {
      const { data } = await api.get(`/org/sections/${deptId}`);
      setSections(data.data);
    } catch (err) {
      setSections([]);
    }
  };

  useEffect(() => { fetchDepts(); }, []);

  useEffect(() => {
    if (selectedDept) fetchSections(selectedDept.id);
    else setSections([]);
  }, [selectedDept]);

  const onAddDept = async (data: any) => {
    try {
      await api.post('/org/departments', data);
      setIsDeptModalOpen(false);
      fetchDepts();
      deptMethods.reset();
    } catch (err) {
      alert('Failed to add department');
    }
  };

  const onAddSec = async (data: any) => {
    try {
      await api.post('/org/sections', data);
      setIsSecModalOpen(false);
      if (selectedDept) fetchSections(selectedDept.id);
      secMethods.reset();
    } catch (err) {
      alert('Failed to add section');
    }
  };

  const deleteDept = async (id: number) => {
    if (!confirm('Delete department and all associated sections?')) return;
    try {
      await api.delete(`/org/departments/${id}`);
      fetchDepts();
      if (selectedDept?.id === id) setSelectedDept(null);
    } catch (err) {
      alert('Delete failed');
    }
  };

  const deleteSection = async (id: number) => {
    if (!confirm('Delete section?')) return;
    try {
      await api.delete(`/org/sections/${id}`);
      if (selectedDept) fetchSections(selectedDept.id);
    } catch (err) {
      alert('Delete failed');
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.5, fontFamily: 'Poppins', letterSpacing: -0.5 }}>
              Organization Structure
            </Typography>
            <Breadcrumbs separator="•" sx={{ '& .MuiBreadcrumbs-separator': { color: 'text.disabled' } }}>
              <MuiLink underline="hover" color="inherit" href="/" sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Poppins' }}>
                Home
              </MuiLink>
              <Typography color="primary" sx={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Poppins' }}>
                Corporate Hierarchy
              </Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={3}>
        {/* Departments List */}
        <Grid item xs={12} lg={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider', 
              height: 600, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': { boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)' }
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(0,0,0,0.01)' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2, display: 'flex' }}>
                  <Building2 size={20} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>Departments</Typography>
              </Stack>
              <IconButton 
                size="small" 
                onClick={() => { deptMethods.reset(); setIsDeptModalOpen(true); }}
                sx={{ bgcolor: 'primary.light', color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
              >
                <Plus size={20} />
              </IconButton>
            </Box>
            
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              <List sx={{ p: 0 }}>
                {departments.map((dept) => {
                  const isSelected = selectedDept?.id === dept.id;
                  return (
                    <ListItem 
                      key={dept.id}
                      onClick={() => setSelectedDept(dept)}
                      sx={{ 
                        borderRadius: 3, 
                        mb: 1, 
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        border: '1px solid',
                        borderColor: isSelected ? 'primary.main' : 'transparent',
                        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.05) : 'transparent',
                        '&:hover': {
                          bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'rgba(0,0,0,0.02)',
                        }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 48 }}>
                        <Box sx={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: 2, 
                          bgcolor: isSelected ? 'primary.main' : 'rgba(0,0,0,0.05)', 
                          color: isSelected ? 'white' : 'text.secondary',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          fontFamily: 'Poppins'
                        }}>
                          {dept.name.charAt(0)}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={dept.name} 
                        primaryTypographyProps={{ 
                          fontWeight: 700, 
                          fontFamily: 'Poppins', 
                          fontSize: '0.875rem',
                          color: isSelected ? 'primary.main' : 'text.primary'
                        }} 
                      />
                      <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton 
                          size="small" 
                          onClick={(e) => { e.stopPropagation(); deleteDept(dept.id); }}
                          sx={{ 
                            opacity: isSelected ? 1 : 0, 
                            '&:hover': { color: 'error.main' },
                            transition: '0.2s'
                          }}
                          className="action-btn"
                        >
                          <Trash2 size={16} />
                        </IconButton>
                        <ChevronRight 
                          size={18} 
                          color={isSelected ? theme.palette.primary.main : theme.palette.text.disabled}
                          style={{ transition: '0.2s', transform: isSelected ? 'translateX(4px)' : 'none' }}
                        />
                      </ListItemSecondaryAction>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
          </Paper>
        </Grid>

        {/* Sections List */}
        <Grid item xs={12} lg={6}>
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4, 
              border: '1px solid', 
              borderColor: 'divider', 
              height: 600, 
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'all 0.3s',
              '&:hover': { boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)' }
            }}
          >
            <Box sx={{ p: 2.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: 'rgba(0,0,0,0.01)' }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Box sx={{ p: 1, bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', borderRadius: 2, display: 'flex' }}>
                  <LayoutPanelLeft size={20} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontFamily: 'Poppins' }}>
                  Sections {selectedDept && `· ${selectedDept.name}`}
                </Typography>
              </Stack>
              {selectedDept && (
                <IconButton 
                  size="small" 
                  onClick={() => { secMethods.reset({ deptId: selectedDept.id.toString() }); setIsSecModalOpen(true); }}
                  sx={{ bgcolor: 'primary.light', color: 'primary.main', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
                >
                  <Plus size={20} />
                </IconButton>
              )}
            </Box>

            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {!selectedDept ? (
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.disabled', opacity: 0.5 }}>
                  <Box sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: '50%', mb: 2 }}>
                    <Building2 size={48} strokeWidth={1} />
                  </Box>
                  <Typography variant="overline" sx={{ fontWeight: 800, letterSpacing: 2, fontFamily: 'Poppins' }}>
                    Select a Department
                  </Typography>
                </Box>
              ) : sections.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {sections.map((sec) => (
                    <ListItem 
                      key={sec.id}
                      sx={{ 
                        borderRadius: 3, 
                        mb: 1, 
                        bgcolor: 'rgba(0,0,0,0.01)', 
                        border: '1px solid transparent',
                        '&:hover': {
                          bgcolor: 'white',
                          borderColor: alpha(theme.palette.primary.main, 0.1),
                          boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                        },
                        transition: 'all 0.2s'
                      }}
                    >
                      <ListItemText 
                        primary={sec.name} 
                        primaryTypographyProps={{ fontWeight: 600, fontFamily: 'Poppins', fontSize: '0.875rem' }} 
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          size="small" 
                          onClick={() => deleteSection(sec.id)}
                          sx={{ '&:hover': { color: 'error.main', bgcolor: 'error.light' } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box sx={{ py: 10, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500, fontStyle: 'italic', fontFamily: 'Poppins' }}>
                    No operational sections configured
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Dept Modal */}
      <Dialog 
        open={isDeptModalOpen} 
        onClose={() => setIsDeptModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Poppins' }}>Register Department</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Organizational Node</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '8px !important' }}>
          <FormProvider {...deptMethods}>
            <form onSubmit={deptMethods.handleSubmit(onAddDept)}>
              <Stack spacing={2.5}>
                <FormField name="name" label="Unit Designation" placeholder="e.g. Finance & Control" />
                <FormField name="description" label="Scope of Operations" placeholder="Describe unit responsibilities..." />
              </Stack>
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsDeptModalOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'Poppins' }}>Discard</Button>
          <Button 
            variant="contained" 
            onClick={deptMethods.handleSubmit(onAddDept)}
            sx={{ px: 3, fontWeight: 700, fontFamily: 'Poppins', boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.2)' }}
          >
            Register Unit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sec Modal */}
      <Dialog 
        open={isSecModalOpen} 
        onClose={() => setIsSecModalOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, backgroundImage: 'none' } }}
      >
        <DialogTitle sx={{ p: 3, pb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: 'Poppins' }}>Register Section</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Operational Branch</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3, pt: '8px !important' }}>
          <FormProvider {...secMethods}>
            <form onSubmit={secMethods.handleSubmit(onAddSec)}>
              <FormField name="name" label="Operational Section" placeholder="e.g. Asset Management" />
              <input type="hidden" {...secMethods.register('deptId')} />
            </form>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={() => setIsSecModalOpen(false)} sx={{ fontWeight: 700, color: 'text.secondary', fontFamily: 'Poppins' }}>Discard</Button>
          <Button 
            variant="contained" 
            onClick={secMethods.handleSubmit(onAddSec)}
            sx={{ px: 3, fontWeight: 700, fontFamily: 'Poppins', boxShadow: '0 8px 16px -4px rgba(239, 68, 68, 0.2)' }}
          >
            Register Section
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
}


