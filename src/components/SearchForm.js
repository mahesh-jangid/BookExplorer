import React, { useState } from 'react';
import {
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Typography,
  Alert,
  Tooltip,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade,
  
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TitleIcon from '@mui/icons-material/Title';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import ClearIcon from '@mui/icons-material/Clear';
import { searchBooks } from '../services/booksApi';

const SearchForm = ({ onSearchResults, onSearchStart }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError('');
  };

  const handleClear = (field) => {
    handleChange({ target: { name: field, value: '' } });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that at least one field is filled
    if (!formData.title && !formData.author && !formData.genre) {
      setError('Please fill at least one search field');
      return;
    }

    setIsLoading(true);
    setError('');
    onSearchStart && onSearchStart();

    try {
      const results = await searchBooks(formData);
      
      if (Array.isArray(results) && results.length === 0) {
        setError('No books found matching your criteria. Try different search terms.');
        onSearchResults([]);
      } else {
        setError('');
        onSearchResults(results);
      }
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch books. Please try again.');
      onSearchResults([]); // Clear any previous results
    }
    setIsLoading(false);
  };

  return (
    <Paper 
      component="form" 
      onSubmit={handleSubmit}
      elevation={2}
      sx={{ 
        p: { xs: 2, sm: 3 },
        mb: 4,
        borderRadius: 2,
        background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
        border: '1px solid',
        borderColor: 'divider',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <Typography 
        variant="h5" 
        gutterBottom
        sx={{ 
          fontWeight: 600,
          color: 'primary.main',
          textAlign: { xs: 'center', sm: 'left' },
          mb: 3
        }}
      >
        Discover Your Next Book
      </Typography>
      <Typography 
        variant="body1" 
        sx={{ 
          mb: 3,
          color: 'text.secondary',
          textAlign: { xs: 'center', sm: 'left' }
        }}
      >
        Search by title, author, or genre to find your perfect read
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Enter a book title to search" arrow placement="top">
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              variant="outlined"
              placeholder="e.g. The Great Gatsby"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: formData.title ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClear('title')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: 2
                  }
                }
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Enter an author's name" arrow placement="top">
            <TextField
              fullWidth
              label="Author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              variant="outlined"
              placeholder="e.g. J.K. Rowling"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: formData.author ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClear('author')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: 2
                  }
                }
              }}
            />
          </Tooltip>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Tooltip title="Enter a genre or keyword" arrow placement="top">
            <TextField
              fullWidth
              label="Genre/Keyword"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              variant="outlined"
              placeholder="e.g. Fantasy, Mystery"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CategoryIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: formData.genre ? (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleClear('genre')}
                      edge="end"
                      size="small"
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                  },
                  '&.Mui-focused fieldset': {
                    borderWidth: 2
                  }
                }
              }}
            />
          </Tooltip>
        </Grid>
      </Grid>

      <Box sx={{ minHeight: '48px', mt: 2 }}>
        <Fade in={Boolean(error)}>
          <Alert 
            severity="error"
            sx={{
              borderRadius: 2,
              '& .MuiAlert-icon': {
                fontSize: '24px'
              }
            }}
          >
            {error}
          </Alert>
        </Fade>
      </Box>

      <Box 
        mt={3} 
        display="flex" 
        justifyContent="flex-end" 
        gap={2}
        sx={{
          width: '100%',
          px: { xs: 0, sm: 1 }
        }}
      >
        <Button
          type="button"
          variant="outlined"
          color="primary"
          onClick={() => setFormData({ title: '', author: '', genre: '' })}
          disabled={isLoading}
          sx={{ 
            minWidth: '120px',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem'
          }}
        >
          Clear All
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isLoading}
          startIcon={isLoading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <SearchIcon />
          )}
          sx={{ 
            minWidth: '140px',
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '1rem',
            background: 'linear-gradient(45deg, #007FFF 30%, #0059B2 90%)',
            boxShadow: '0 3px 5px 2px rgba(0, 127, 255, .3)',
            '&:hover': {
              background: 'linear-gradient(45deg, #0059B2 30%, #004094 90%)'
            },
            '&.Mui-disabled': {
              background: 'linear-gradient(45deg, #ccc 30%, #999 90%)',
              color: 'rgba(255, 255, 255, 0.8)'
            },
            transition: 'all 0.3s ease-in-out'
          }}
        >
          {isLoading ? 'Searching...' : 'Search Books'}
        </Button>
      </Box>
    </Paper>
  );
};

export default SearchForm;