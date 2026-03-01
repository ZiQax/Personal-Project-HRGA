import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Car,
  FileText,
  Users,
  LogOut,
  Menu,
  Search,
  Bell,
  Building2,
  PieChart,
  ShieldCheck,
  Settings,
  Activity,
  ChevronRight,
  Command,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePermissions, type Permission } from '../hooks/usePermissions';
import { useDebounce } from '../hooks/useDebounce';
import api from '../services/api';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Chip,
  InputBase,
  Paper,
  Stack,
  alpha,
  useTheme,
  useMediaQuery,
  Button
} from '@mui/material';
import { styled } from '@mui/material/styles';

const DRAWER_WIDTH = 300;

// Styling Search mirip persis Apex (Light Gray, Border tipis, tinggi 40px)
const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: '8px',
  backgroundColor: '#f1f5f9',
  border: '1px solid #e2e8f0',
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: '#e2e8f0',
  },
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#64748b',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#1e293b',
  width: '100%',
  height: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: theme.spacing(6), // Space for Cmd+K
    width: '100%',
    fontSize: '0.875rem',
    fontWeight: 500,
    [theme.breakpoints.up('md')]: {
      width: '35ch',
      '&:focus': { width: '45ch' },
    },
  },
}));

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { hasPermission } = usePermissions();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchSearchResults = useCallback(async (query: string) => {
    setIsSearching(true);
    try {
      const { data } = await api.get(`/system/search?q=${query}`);
      setSearchResults(data.results || []);
    } catch (err) { console.error(err); }
    finally { setIsSearching(false); }
  }, []);

  useEffect(() => {
    if (debouncedSearch.length >= 2) fetchSearchResults(debouncedSearch);
    else setSearchResults([]);
  }, [debouncedSearch, fetchSearchResults]);

  const menuSections: {
    title: string,
    items: { icon: React.ReactNode, label: string, path: string, permission?: Permission, badge?: string | number, badgeColor?: string }[]
  }[] = [
      {
        title: 'Overview',
        items: [
          { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard', permission: 'view_dashboard' },
          { icon: <PieChart size={20} />, label: 'Analytics', path: '/reports', permission: 'view_dashboard', badge: 'New', badgeColor: '#10b981' },
          { icon: <Activity size={20} />, label: 'System Logs', path: '/logs', permission: 'view_dashboard' },
        ]
      },
      {
        title: 'Management',
        items: [
          { icon: <ShieldCheck size={20} />, label: 'Validator', path: '/validator', permission: 'approve_leave', badge: 3, badgeColor: '#f59e0b' },
          { icon: <Car size={20} />, label: 'Mobility', path: '/mobility', permission: 'view_mobility' },
          { icon: <FileText size={20} />, label: 'Permits', path: '/leave', permission: 'view_leave' },
        ]
      },
      {
        title: 'Organization',
        items: [
          { icon: <Users size={20} />, label: 'Workforce', path: '/employees', permission: 'manage_users' },
          { icon: <Building2 size={20} />, label: 'Organization', path: '/organization', permission: 'manage_users' },
          { icon: <Settings size={20} />, label: 'Settings', path: '/settings', permission: 'manage_users' },
        ]
      }
    ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#ffffff' }}>
      {/* HEADER SIDEBAR: Diubah jadi tinggi 72px biar sejajar rata dengan AppBar */}
      <Box sx={{ px: 3, height: 72, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{
          bgcolor: theme.palette.primary.main,
          p: 0.75,
          borderRadius: 2,
          display: 'flex',
          boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
        }}>
          <Command color="white" size={22} />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', fontSize: '1.25rem' }}>
          APEX DASH
        </Typography>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {menuSections.map((section) => (
          <Box key={section.title} sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ px: 2, mb: 1, display: 'block', color: '#94a3b8', fontWeight: 700, letterSpacing: 1 }}>
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.filter(item => !item.permission || hasPermission(item.permission)).map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                    <ListItemButton
                      component={Link}
                      to={item.path}
                      onClick={() => !isDesktop && setMobileOpen(false)}
                      sx={{
                        borderRadius: 2,
                        py: 1.2,
                        px: 2,
                        bgcolor: isActive ? '#eff6ff' : 'transparent',
                        color: isActive ? '#3b82f6' : '#64748b',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: isActive ? '#eff6ff' : '#f8fafc',
                          color: '#3b82f6',
                          '& .MuiListItemIcon-root': { color: '#3b82f6' }
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 38, color: isActive ? '#3b82f6' : '#94a3b8' }}>
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 700 : 600 }}
                      />
                      {item.badge && (
                        <Chip
                          label={item.badge}
                          size="small"
                          sx={{
                            height: 20, fontSize: '0.65rem', fontWeight: 800,
                            bgcolor: alpha(item.badgeColor || '#3b82f6', 0.1),
                            color: item.badgeColor || '#3b82f6', borderRadius: 1.5
                          }}
                        />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Widget Help & Logout bawah */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #e2e8f0', mb: 2 }}>
          <Stack spacing={1}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
              <HelpCircle size={16} color="#3b82f6" /> Need Help?
            </Typography>
            <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>Check system docs</Typography>
            <Button
              size="small" variant="contained" fullWidth disableElevation
              sx={{ mt: 1, bgcolor: '#fff', color: '#0f172a', border: '1px solid #e2e8f0', textTransform: 'none', fontWeight: 600, '&:hover': { bgcolor: '#f1f5f9' } }}
            >
              Documentation
            </Button>
          </Stack>
        </Paper>
        <ListItemButton
          onClick={() => { logout(); navigate('/login'); }}
          sx={{ borderRadius: 2, color: '#ef4444', py: 1.2, '&:hover': { bgcolor: alpha('#ef4444', 0.05) } }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}><LogOut size={20} /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 700 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      {/* PERBAIKAN APP BAR: 
        1. Warnanya #ffffff solid (bukan rgba) biar bersih.
        2. Hapus zIndex custom biar Drawer HP bisa nutupin header.
      */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { lg: `${DRAWER_WIDTH}px` },
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          color: '#0f172a',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', height: 72, px: { lg: 4 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={() => setMobileOpen(!mobileOpen)}
              sx={{ display: { lg: 'none' }, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: 2 }}
            >
              <Menu size={20} />
            </IconButton>

            <SearchWrapper sx={{ display: { xs: 'none', md: 'flex' } }}>
              <SearchIconWrapper>
                <Search size={16} />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Box sx={{
                position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
                bgcolor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px',
                px: 1, py: 0.3, display: 'flex', alignItems: 'center', gap: 0.5, pointerEvents: 'none',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#64748b', fontSize: '0.65rem' }}>⌘ K</Typography>
              </Box>
            </SearchWrapper>
          </Box>

          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              size="small"
              startIcon={<Box sx={{ width: 16, height: 16, bgcolor: 'white', color: 'primary.main', borderRadius: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>+</Box>}
              sx={{ display: { xs: 'none', sm: 'flex' }, height: 40, px: 2, boxShadow: 'none', textTransform: 'none', fontWeight: 600, borderRadius: '8px' }}
            >
              New Action
            </Button>

            <IconButton sx={{ bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', p: 1, '&:hover': { bgcolor: '#f8fafc' } }}>
              <Badge variant="dot" color="error" overlap="circular" sx={{ '& .MuiBadge-badge': { right: 2, top: 2 } }}>
                <Bell size={18} color="#64748b" />
              </Badge>
            </IconButton>

            <Divider orientation="vertical" flexItem sx={{ height: 24, my: 'auto', borderColor: '#e2e8f0' }} />

            <Box
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5, p: 0.5, pr: 1.5, borderRadius: '10px',
                cursor: 'pointer', transition: 'all 0.2s', '&:hover': { bgcolor: '#f1f5f9' }
              }}
            >
              <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: 'primary.main', fontWeight: 800, width: 36, height: 36, borderRadius: '10px', fontSize: '0.9rem' }}>
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>{user?.username || 'Guest User'}</Typography>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, fontSize: '0.7rem' }}>{user?.role || 'Visitor'}</Typography>
              </Box>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { lg: DRAWER_WIDTH }, flexShrink: { lg: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', lg: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, border: 'none', boxShadow: '0 0 40px rgba(0,0,0,0.1)' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', lg: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH, borderRight: '1px solid #e2e8f0' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* PERBAIKAN KONTEN UTAMA: 
        Dikasih display flex & col, lalu pakai <Toolbar/> sebagai "dongkrak" 
        biar kontennya nggak nabrak header. mt: 9 DIBUANG.
      */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          bgcolor: '#f8fafc',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Toolbar sx={{ height: 72 }} /> {/* Ini Spacer biar konten pas dibawah AppBar */}
        <Box sx={{ p: { xs: 2, md: 3, lg: 4 }, flexGrow: 1, width: '100%', maxWidth: 1600, mx: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}