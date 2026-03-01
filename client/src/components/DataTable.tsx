import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  Pagination,
  PaginationItem,
  alpha,
  useTheme,
  Grid,
  Card,
  CardContent,
  Stack,
  Divider,
  IconButton
} from '@mui/material';
import { ChevronLeft, ChevronRight, Inbox, MoreVertical } from 'lucide-react';

interface Column<T> {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  viewMode?: 'table' | 'card';
  renderCard?: (item: T) => React.ReactNode;
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
}

function DataTable<T>({ columns, data, viewMode = 'table', renderCard, pagination }: DataTableProps<T>) {
  const theme = useTheme();

  const renderTableView = () => (
    <TableContainer
      component={Paper}
      elevation={0}
      sx={{
        border: '1px solid',
        borderColor: '#e5e7eb',
        borderRadius: 1,
        overflow: 'hidden',
        bgcolor: '#fff',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}
    >
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: '#f9fafb' }}>
            {columns.map((col, idx) => (
              <TableCell
                key={idx}
                sx={{
                  py: 1.5, px: 3, fontSize: '0.75rem', fontWeight: 700, color: '#64748b',
                  textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb'
                }}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? data.map((item, rowIdx) => (
            <TableRow key={rowIdx} hover sx={{ '&:last-child td': { border: 0 }, transition: 'all 0.2s' }}>
              {columns.map((col, colIdx) => (
                <TableCell
                  key={colIdx}
                  sx={{ px: 3, py: 2, fontSize: '0.875rem', color: '#1e293b', fontWeight: 500, borderBottom: '1px solid #f1f5f9' }}
                >
                  {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                </TableCell>
              ))}
            </TableRow>
          )) : <NoData colSpan={columns.length} />}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderCardView = () => (
    <Grid container spacing={3}>
      {data.length > 0 ? data.map((item, idx) => (
        <Grid item xs={12} sm={6} lg={4} key={idx}>
          {renderCard ? renderCard(item) : (
            <Card elevation={0} sx={{
              borderRadius: 3, border: '1px solid #e2e8f0', height: '100%',
              transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }
            }}>
              <CardContent sx={{ p: 2.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#111827' }}>
                    {typeof columns[0].accessor === 'function' ? columns[0].accessor(item) : (item[columns[0].accessor] as string)}
                  </Typography>
                  <IconButton size="small"><MoreVertical size={16} /></IconButton>
                </Stack>
                <Stack spacing={1.5}>
                  {columns.slice(1).map((col, cIdx) => (
                    <Box key={cIdx}>
                      <Typography variant="caption" sx={{ fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                        {col.header}
                      </Typography>
                      <Box sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>
                        {typeof col.accessor === 'function' ? col.accessor(item) : (item[col.accessor] as React.ReactNode)}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </Grid>
      )) : <Grid item xs={12}><NoData isCard /></Grid>}
    </Grid>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {viewMode === 'table' ? renderTableView() : renderCardView()}

      {pagination && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4, px: 1 }}>
          <Typography variant="body2" sx={{ fontWeight: 700, color: '#64748b' }}>
            Page {pagination.currentPage} of {pagination.totalPages}
          </Typography>
          <Pagination
            count={pagination.totalPages}
            page={pagination.currentPage}
            onChange={(_, page) => pagination.onPageChange(page)}
            renderItem={(item) => (
              <PaginationItem slots={{ previous: ChevronLeft, next: ChevronRight }} {...item} sx={{ borderRadius: 1.5, fontWeight: 700 }} />
            )}
          />
        </Box>
      )}
    </Box>
  );
}

function NoData({ colSpan, isCard }: { colSpan?: number, isCard?: boolean }) {
  const content = (
    <Box sx={{ py: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, opacity: 0.4 }}>
      <Inbox size={48} strokeWidth={1} />
      <Typography variant="body1" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
        No records found
      </Typography>
    </Box>
  );

  if (isCard) return content;
  return (
    <TableRow>
      <TableCell colSpan={colSpan} align="center">{content}</TableCell>
    </TableRow>
  );
}

export default DataTable;
