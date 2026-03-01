import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  InputAdornment, 
  Alert, 
  CircularProgress,
  Link,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fade,
  Stack,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Login as LoginIcon, 
  PersonAdd, 
  LockOutlined, 
  PersonOutline,
  BadgeOutlined,
  ChevronRight
} from '@mui/icons-material';
import { Globe, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nik: '',
    role: 'user'
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister 
        ? formData 
        : { identifier: formData.username, password: formData.password };

      const { data } = await api.post(endpoint, payload);

      if (isRegister) {
        setIsRegister(false);
        setFormData({ ...formData, password: '' });
        alert('Registration successful! Please login.');
      } else {
        login(data.user, data.token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication sequence failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        bgcolor: '#f8fafc',
        backgroundImage: `radial-gradient(circle at 2px 2px, ${alpha(theme.palette.primary.main, 0.05)} 1px, transparent 0)`,
        backgroundSize: '40px 40px',
      }}
    >
      {/* Left Decoration - Visible on LG up */}
      <Box 
        sx={{ 
          flex: 1, 
          display: { xs: 'none', lg: 'flex' }, 
          bgcolor: 'primary.main',
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          flexDirection: 'column',
          justifyContent: 'center',
          p: 8,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', border: `40px solid ${alpha('#fff', 0.05)}` }} />
        <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: alpha('#fff', 0.05) }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
            <Box sx={{ bgcolor: '#fff', p: 1, borderRadius: 2, display: 'flex' }}>
              <Globe color={theme.palette.primary.main} size={32} />
            </Box>
            <Typography variant="h4" sx={{ color: '#fff', fontWeight: 900, letterSpacing: -1 }}>APEX HRGA</Typography>
          </Stack>
          
          <Typography variant="h2" sx={{ color: '#fff', fontWeight: 900, mb: 3, lineHeight: 1.1 }}>
            Enterprise Resource <br />
            <Box component="span" sx={{ color: alpha('#fff', 0.6) }}>Management Platform.</Box>
          </Typography>
          
          <Typography variant="h6" sx={{ color: alpha('#fff', 0.8), fontWeight: 500, maxWidth: 500, mb: 6 }}>
            The complete solution for workforce optimization, fleet logistics, and departmental validation.
          </Typography>
          
          <Stack spacing={3}>
            {[
              { icon: <ShieldCheck size={20} />, text: "State-of-the-art validation protocols" },
              { icon: <BadgeOutlined sx={{ fontSize: 20 }} />, text: "Comprehensive personnel directory" },
              { icon: <LoginIcon sx={{ fontSize: 20 }} />, text: "Real-time activity stream analytics" }
            ].map((item, i) => (
              <Stack key={i} direction="row" spacing={2} alignItems="center">
                <Box sx={{ display: 'flex', color: '#fff', opacity: 0.9 }}>{item.icon}</Box>
                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{item.text}</Typography>
              </Stack>
            ))}
          </Stack>
        </Box>
        
        <Typography variant="caption" sx={{ position: 'absolute', bottom: 40, left: 64, color: alpha('#fff', 0.5), fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2 }}>
          © 2026 APEX ENTERPRISE SYSTEMS
        </Typography>
      </Box>

      {/* Right Login Section */}
      <Box 
        sx={{ 
          flex: { xs: 1, lg: 0.8 }, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4
        }}
      >
        <Container maxWidth="xs">
          <Fade in={true} timeout={800}>
            <Box>
              <Box sx={{ mb: 5 }}>
                <Box sx={{ display: { xs: 'flex', lg: 'none' }, mb: 3, alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1.5, display: 'flex' }}>
                    <Globe color="#fff" size={24} />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>APEX HRGA</Typography>
                </Box>
                
                <Typography variant="h4" sx={{ fontWeight: 900, mb: 1, letterSpacing: -0.5 }}>
                  {isRegister ? 'Create Profile' : 'System Access'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {isRegister ? 'Register your organizational credentials.' : 'Please authenticate to proceed to hub.'}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {isRegister && (
                    <TextField
                      fullWidth
                      label="Employee ID (NIK)"
                      name="nik"
                      required
                      value={formData.nik}
                      onChange={handleInputChange}
                      placeholder="e.g. 2024-X100"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <BadgeOutlined sx={{ fontSize: 20, color: 'text.disabled' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}

                  <TextField
                    fullWidth
                    label="Access Identifier"
                    name="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Username"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutline sx={{ fontSize: 20, color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Security Key"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined sx={{ fontSize: 20, color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  {isRegister && (
                    <FormControl fullWidth>
                      <InputLabel>Operational Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        label="Operational Role"
                        onChange={handleInputChange}
                      >
                        <MenuItem value="user">Operational User</MenuItem>
                        <MenuItem value="admin">System Administrator</MenuItem>
                      </Select>
                    </FormControl>
                  )}

                  {error && (
                    <Alert severity="error" variant="filled" sx={{ borderRadius: 2, fontWeight: 700 }}>
                      {error}
                    </Alert>
                  )}

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                      py: 1.8, 
                      fontSize: '1rem',
                      boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.25)}`,
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <Typography sx={{ fontWeight: 800 }}>{isRegister ? 'Initialize Registration' : 'Authorize Access'}</Typography>
                        <ChevronRight sx={{ fontSize: 20 }} />
                      </Stack>
                    )}
                  </Button>

                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                      {isRegister ? 'Already registered?' : "Don't have an account?"}{' '}
                      <Link 
                        component="button"
                        type="button"
                        onClick={() => {
                          setIsRegister(!isRegister);
                          setError('');
                        }}
                        sx={{ 
                          fontWeight: 800, 
                          color: 'primary.main', 
                          textDecoration: 'none',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                      >
                        {isRegister ? 'Sign In' : 'Register Now'}
                      </Link>
                    </Typography>
                  </Box>
                </Stack>
              </form>
            </Box>
          </Fade>
        </Container>
      </Box>
    </Box>
  );
};

export default Login;
