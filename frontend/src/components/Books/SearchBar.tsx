import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import { Search, FilterList, Close } from '@mui/icons-material';

interface SearchBarProps {
  onSearch: (params: {
    query: string;
    category: string;
    sortBy: string;
  }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    onSearch({ query, category, sortBy });
  };

  const handleClear = () => {
    setQuery('');
    setCategory('');
    setSortBy('newest');
    onSearch({ query: '', category: '', sortBy: 'newest' });
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={8}>
          <TextField
            fullWidth
            placeholder="Search by title, author, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSearch}
              startIcon={<Search />}
            >
              Search
            </Button>
            <IconButton onClick={() => setShowFilters(!showFilters)}>
              <FilterList />
            </IconButton>
            {(query || category) && (
              <IconButton onClick={handleClear}>
                <Close />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>

      <Collapse in={showFilters}>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={category}
                label="Category"
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="Fiction">Fiction</MenuItem>
                <MenuItem value="Science">Science</MenuItem>
                <MenuItem value="History">History</MenuItem>
                <MenuItem value="Biography & Autobiography">Biography</MenuItem>
                <MenuItem value="Computers">Technology</MenuItem>
                <MenuItem value="Philosophy">Philosophy</MenuItem>
                <MenuItem value="Art">Art</MenuItem>
                <MenuItem value="Business & Economics">Business</MenuItem>
                <MenuItem value="Mathematics">Mathematics</MenuItem>
                <MenuItem value="Medical">Medical</MenuItem>
                <MenuItem value="Education">Education</MenuItem>
                <MenuItem value="Religion">Religion</MenuItem>
                <MenuItem value="Social Science">Social Science</MenuItem>
                <MenuItem value="Sports & Recreation">Sports</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="relevance">Relevance</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Collapse>
    </Paper>
  );
};

export default SearchBar;

