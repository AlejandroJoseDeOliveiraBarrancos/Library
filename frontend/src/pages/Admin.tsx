import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Paper,
} from '@mui/material';
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Book as BookIcon,
} from '@mui/icons-material';
import Layout from '@/components/Layout/Layout';
import apiService from '@/services/api';

interface AdminLoan {
  id: string;
  book_id: string;
  user_id: string;
  user_display_name: string;
  user_email: string;
  borrowed_date: string;
  due_date: string;
  status: string;
  book_title: string;
  book_image: string;
  book_authors: string[];
}

const Admin: React.FC = () => {
  const [loans, setLoans] = useState<AdminLoan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returningLoanId, setReturningLoanId] = useState<string | null>(null);

  useEffect(() => {
    fetchActiveLoans();
  }, []);

  const fetchActiveLoans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getAllActiveLoans();
      setLoans(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to fetch active loans');
    } finally {
      setLoading(false);
    }
  };

  const handleReturnBook = async (loanId: string) => {
    try {
      setReturningLoanId(loanId);
      await apiService.adminReturnBook(loanId);
      
      setLoans(prev => prev.filter(loan => loan.id !== loanId));
      
      console.log('Book returned successfully');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to return book');
    } finally {
      setReturningLoanId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Container>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={fetchActiveLoans}>
            Retry
          </Button>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage all active book loans
        </Typography>
      </Box>

      {loans.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <BookIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No active loans found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            All books are currently available in the library.
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {loans.map((loan) => (
            <Grid item xs={12} sm={6} md={4} key={loan.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    loan.book_image || 
                    'https://via.placeholder.com/200x300?text=No+Image'
                  }
                  alt={loan.book_title}
                  sx={{ objectFit: 'contain', p: 1 }}
                />
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {loan.book_title}
                  </Typography>
                  
                  {loan.book_authors.length > 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      by {loan.book_authors.join(', ')}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 1, width: 24, height: 24 }}>
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">
                      <strong>{loan.user_display_name}</strong>
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {loan.user_email}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography variant="body2">
                        Borrowed: {formatDate(loan.borrowed_date)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <CalendarIcon sx={{ mr: 1, fontSize: 16 }} />
                      <Typography 
                        variant="body2"
                        color={isOverdue(loan.due_date) ? 'error' : 'text.primary'}
                      >
                        Due: {formatDate(loan.due_date)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Chip
                      label={isOverdue(loan.due_date) ? 'Overdue' : 'Active'}
                      color={isOverdue(loan.due_date) ? 'error' : 'primary'}
                      size="small"
                    />
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleReturnBook(loan.id)}
                    disabled={returningLoanId === loan.id}
                  >
                    {returningLoanId === loan.id ? (
                      <>
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                        Returning...
                      </>
                    ) : (
                      'Return Book'
                    )}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="primary">
              {loans.length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Active Loans
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="error">
              {loans.filter(loan => isOverdue(loan.due_date)).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Overdue Loans
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h4" color="success.main">
              {loans.filter(loan => !isOverdue(loan.due_date)).length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              On Time
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      </Container>
    </Layout>
  );
};

export default Admin;
