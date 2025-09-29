import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Paper,
  InputAdornment,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Fade,
  Container,
  Skeleton,
  CircularProgress,
  Link,
} from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { useFavorites } from '../context/FavoritesContext';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';

const Favorites = () => {
  const { favorites } = useFavorites();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading state for demonstration
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAnchorEl, setSortAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState('dateAdded');
  const [filterBy, setFilterBy] = useState('all');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  // Filter and sort handlers
  const handleSortClick = (event) => setSortAnchorEl(event.currentTarget);
  const handleFilterClick = (event) => setFilterAnchorEl(event.currentTarget);
  const handleSortClose = () => setSortAnchorEl(null);
  const handleFilterClose = () => setFilterAnchorEl(null);

  const handleSortSelect = (value) => {
    setSortBy(value);
    handleSortClose();
  };

  const handleFilterSelect = (value) => {
    setFilterBy(value);
    handleFilterClose();
  };

  // Filter books based on search query and category
  const filteredBooks = favorites.filter((book) => {
    const matchesSearch = searchQuery.toLowerCase() === '' ||
      book.volumeInfo.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.volumeInfo.authors?.some(author => 
        author.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = filterBy === 'all' ||
      book.volumeInfo.categories?.includes(filterBy);

    return matchesSearch && matchesFilter;
  });

  // Sort filtered books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.volumeInfo.title.localeCompare(b.volumeInfo.title);
      case 'author':
        const authorA = a.volumeInfo.authors?.[0] || '';
        const authorB = b.volumeInfo.authors?.[0] || '';
        return authorA.localeCompare(authorB);
      case 'dateAdded':
      default:
        return 0;
    }
  });

  // Get unique categories for filter menu
  const categories = [...new Set(favorites.flatMap(book => 
    book.volumeInfo.categories || []))];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ px: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 600,
            textAlign: { xs: 'center', sm: 'left' },
            mb: 4
          }}
        >
          My Favorite Books
        </Typography>

        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            mb: 4, 
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: 1,
            borderColor: 'divider'
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={8}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                size="medium"
                sx={{
                  bgcolor: 'background.paper',
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderWidth: 2,
                    }
                  },
                  '& input::placeholder': {
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  },
                  transition: 'transform 0.2s ease-in-out',
                  '&:focus-within': {
                    transform: 'scale(1.005)'
                  }
                }}
              />
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SortIcon />}
                onClick={handleSortClick}
                sx={{
                  height: '56px',
                  borderWidth: sortAnchorEl ? 2 : 1,
                  borderColor: sortAnchorEl ? 'primary.main' : 'divider',
                  bgcolor: sortAnchorEl ? 'action.hover' : 'background.paper',
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Sort {sortBy !== 'dateAdded' && `• ${sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}`}
              </Button>
              <Menu
                anchorEl={sortAnchorEl}
                open={Boolean(sortAnchorEl)}
                onClose={handleSortClose}
                TransitionComponent={Fade}
              >
                <MenuItem 
                  onClick={() => handleSortSelect('title')}
                  selected={sortBy === 'title'}
                >
                  By Title
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSortSelect('author')}
                  selected={sortBy === 'author'}
                >
                  By Author
                </MenuItem>
                <MenuItem 
                  onClick={() => handleSortSelect('dateAdded')}
                  selected={sortBy === 'dateAdded'}
                >
                  By Date Added
                </MenuItem>
              </Menu>
            </Grid>
            <Grid item xs={6} sm={3} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterIcon />}
                onClick={handleFilterClick}
                sx={{
                  height: '56px',
                  borderWidth: filterAnchorEl ? 2 : 1,
                  borderColor: filterAnchorEl ? 'primary.main' : 'divider',
                  bgcolor: filterAnchorEl ? 'action.hover' : 'background.paper',
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Filter {filterBy !== 'all' && `• ${filterBy}`}
              </Button>
              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
                TransitionComponent={Fade}
              >
                <MenuItem 
                  onClick={() => handleFilterSelect('all')}
                  selected={filterBy === 'all'}
                >
                  All Categories
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    onClick={() => handleFilterSelect(category)}
                    selected={filterBy === category}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>
            </Grid>
          </Grid>
        </Paper>

        {isLoading ? (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Paper
                key={item}
                sx={{
                  p: 2,
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}
              >
                <Skeleton variant="rectangular" height={250} />
                <Skeleton variant="text" height={32} width="80%" />
                <Skeleton variant="text" height={24} width="60%" />
                <Skeleton variant="rectangular" height={36} width="100%" />
              </Paper>
            ))}
          </Box>
        ) : sortedBooks.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8,
              px: 2,
              bgcolor: 'background.paper',
              borderRadius: 2,
              border: 1,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3
            }}
          >
            <Box
              component="img"
              src="/empty-favorites.svg"
              alt="Empty favorites illustration"
              sx={{ 
                width: '200px',
                height: '200px',
                opacity: 0.7
              }}
            />
            <Box>
              <Typography 
                variant="h5" 
                color="text.primary" 
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                {favorites.length === 0 
                  ? "Your Favorites List is Empty"
                  : "No Matches Found"}
              </Typography>
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{ maxWidth: '500px', mx: 'auto', mb: 3 }}
              >
                {favorites.length === 0 
                  ? "Start building your personal library by adding books you love. Browse our collection and click the heart icon to add books to your favorites."
                  : "Try adjusting your search terms or filters to find what you're looking for."}
              </Typography>
              {favorites.length === 0 ? (
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/"
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Explore Books
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    setSearchQuery('');
                    setFilterBy('all');
                    setSortBy('dateAdded');
                  }}
                  sx={{ 
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1.1rem'
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>
          </Box>
        ) : (
          <Box
            component={motion.div}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3
            }}
          >
            {sortedBooks.map((book) => (
              <Box
                key={book.id}
                component={motion.div}
                variants={itemVariants}
              >
                <BookCard book={book} />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default Favorites;