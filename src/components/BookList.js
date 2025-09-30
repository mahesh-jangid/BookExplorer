import React from 'react';
import { Grid, Typography, Box, useTheme, Container, Skeleton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import BookCard from '../components/BookCard.js';

const BookList = ({ books = [], loading = false }) => {
  const theme = useTheme();

  const LoadingSkeleton = () => (
    <Grid 
      container
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
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item key={index} data-testid="book-skeleton">
          <Box 
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              bgcolor: 'background.paper',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: 1
            }}
          >
            <Skeleton 
              variant="rectangular" 
              sx={{ 
                height: 0,
                paddingTop: '150%',
                transform: 'none',
                bgcolor: 'grey.100'
              }} 
            />
            <Box sx={{ p: 2 }}>
              <Skeleton variant="text" height={28} sx={{ transform: 'none', mb: 1 }} />
              <Skeleton variant="text" width="60%" height={20} sx={{ transform: 'none', mb: 2 }} />
              <Skeleton variant="text" height={60} sx={{ transform: 'none' }} />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3, md: 4 },
        minHeight: 400 // Prevents layout shift when no results
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={books.length}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
        {loading ? (
          <LoadingSkeleton />
        ) : !books.length ? (
          <Box 
            textAlign="center" 
            py={4}
            sx={{
              background: theme.palette.background.paper,
              borderRadius: 2,
              p: 4,
              boxShadow: theme.shadows[1],
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No books found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search terms or browse our recommendations
            </Typography>
          </Box>
        ) : (
          <Grid 
            container
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)'
              },
              gap: 3,
              py: 2,
              '& .book-card': {
                height: '100%',
                width: '100%'
              }
            }}
          >
            {books.map((book, index) => (
              <Grid 
                item 
                key={book.id}
                className="book-card-container"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex'
                  }}
                >
                  <BookCard book={book} className="book-card" />
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}
      </motion.div>
    </AnimatePresence>
    </Container>
  );
};

export default BookList;