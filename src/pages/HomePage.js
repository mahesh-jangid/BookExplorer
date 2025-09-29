import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SearchForm from '../components/SearchForm';
import BookList from '../components/BookList';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchResults = (results) => {
    setBooks(results);
    setHasSearched(true);
    setIsLoading(false);
  };

  const handleSearchStart = () => {
    setIsLoading(true);
  };

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box mb={4}>
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              textAlign: { xs: 'center', sm: 'left' },
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}
          >
            Discover Your Next Book
          </Typography>
          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{
              textAlign: { xs: 'center', sm: 'left' },
              mb: 4,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            Search by title, author, or genre to find your perfect read
          </Typography>
        </Box>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <SearchForm onSearchResults={handleSearchResults} onSearchStart={handleSearchStart} />
      </motion.div>

      <AnimatePresence mode="wait">
        {hasSearched && (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box mb={3} mt={4}>
              <Typography 
                variant="h6" 
                color="text.secondary"
                sx={{
                  fontWeight: 500,
                  borderLeft: '4px solid',
                  borderColor: 'primary.main',
                  pl: 2,
                }}
              >
                {books.length 
                  ? `Found ${books.length} book${books.length === 1 ? '' : 's'}`
                  : 'No results found'}
              </Typography>
            </Box>
            <BookList books={books} loading={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default HomePage;