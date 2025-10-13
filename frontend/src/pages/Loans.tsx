import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { format } from 'date-fns';
import Layout from '@/components/Layout/Layout';
import { Loan } from '@/types/book';
import apiService from '@/services/api';

const Loans: React.FC = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiService.getMyLoans();
      setLoans(response);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async (loanId: string) => {
    try {
      await apiService.returnBook(loanId);
      fetchLoans();
    } catch (err: any) {
      alert(err.response?.data?.detail || 'Failed to return book');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'overdue':
        return 'error';
      case 'returned':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Typography variant="h3" sx={{ mb: 3, fontWeight: 700 }}>
        My Loans
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            You haven't borrowed any books yet.
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Book</TableCell>
                <TableCell>Borrowed Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {loan.book?.title || 'Unknown'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {loan.book?.authors?.join(', ') || 'Unknown Author'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {format(new Date(loan.borrowedDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    {format(new Date(loan.dueDate), 'MMM dd, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={loan.status}
                      color={getStatusColor(loan.status)}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    {loan.status === 'active' || loan.status === 'overdue' ? (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleReturn(loan.id)}
                      >
                        Return
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Returned
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Layout>
  );
};

export default Loans;

