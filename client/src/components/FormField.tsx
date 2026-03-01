import { useFormContext, Controller } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Box,
  Typography,
  alpha,
  useTheme
} from '@mui/material';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  options?: { label: string; value: any }[];
  isSelect?: boolean;
}

export default function FormField({ name, label, type = 'text', placeholder, options, isSelect }: FormFieldProps) {
  const { control, formState: { errors } } = useFormContext();
  const theme = useTheme();
  const error = errors[name];

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary', ml: 0.5, mb: 1, display: 'block', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: 'Poppins', fontSize: '0.65rem' }}>
        {label}
      </Typography>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            select={isSelect}
            type={type}
            placeholder={placeholder}
            error={!!error}
            helperText={error?.message as string}
            variant="outlined"
            size="medium"
            InputProps={{
              sx: {
                borderRadius: 1,
                fontFamily: 'Poppins',
                fontSize: '0.875rem',
                fontWeight: 500,
                bgcolor: alpha(theme.palette.background.default, 0.3),
                transition: 'all 0.2s ease',
                '& fieldset': {
                  borderColor: alpha(theme.palette.divider, 0.8),
                  borderWidth: '1.5px'
                },
                '&:hover fieldset': {
                  borderColor: theme.palette.primary.main
                },
                '&.Mui-focused fieldset': {
                  borderColor: theme.palette.primary.main,
                  boxShadow: `0 0 0 4px ${alpha(theme.palette.primary.main, 0.1)}`
                }
              }
            }}
            SelectProps={{
              displayEmpty: true,
              MenuProps: {
                PaperProps: {
                  sx: {
                    borderRadius: 1,
                    mt: 1,
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }
                }
              }
            }}
          >
            {isSelect && [
              <MenuItem key="empty" value="" disabled sx={{ display: 'none' }}>
                <Typography variant="body2" color="text.disabled">Select {label}</Typography>
              </MenuItem>,
              ...(options?.map((opt) => (
                <MenuItem
                  key={opt.value}
                  value={opt.value}
                  sx={{
                    fontFamily: 'Poppins',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    borderRadius: 2,
                    mx: 1,
                    my: 0.5,
                    '&.Mui-selected': {
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      color: 'primary.main',
                      '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.15) }
                    }
                  }}
                >
                  {opt.label}
                </MenuItem>
              )) || [])
            ]}
          </TextField>
        )}
      />
    </Box>
  );
}
