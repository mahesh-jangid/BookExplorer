import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Rating,
  Divider,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ArrowBack as ArrowBackIcon,
  Language as LanguageIcon,
  Image as ImageIcon,
} from '@mui/icons-material';
import { getBookById } from '../services/booksApi';
import { useFavorites } from '../context/FavoritesContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const data = await getBookById(id);
        setBook(data);
      } catch (err) {
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error">{error}</Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  if (!book) return null;

  const {
    volumeInfo: {
      title,
      authors = ['Unknown Author'],
      description = 'No description available',
      publisher,
      publishedDate,
      pageCount,
      categories = [],
      imageLinks = {},
      language,
      averageRating,
      infoLink,
    } = {},
  } = book;

  const handleFavoriteClick = () => {
    toggleFavorite(book);
  };

  return (
    <Box>
      {/* Breadcrumbs Navigation */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          component="button"
          variant="body1"
          onClick={() => navigate('/')}
          underline="hover"
          color="inherit"
        >
          Home
        </Link>
        <Typography color="text.primary">{title}</Typography>
      </Breadcrumbs>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Grid container spacing={4}>
          {/* Book Cover */}
          <Grid item xs={12} sm={4} md={3}>
            {!imageError ? (
              <Box
                component="img"
                src={imageLinks.thumbnail || imageLinks.smallThumbnail || '/default-book-cover.svg'}
                alt={title}
                onError={() => setImageError(true)}
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'contain',
                  borderRadius: 1,
                  boxShadow: 3,
                  backgroundColor: 'grey.50',
                  p: 2
                }}
              />
            ) : (
              <Paper
                elevation={1}
                sx={{
                  width: '100%',
                  height: 400,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'grey.50',
                  borderRadius: 1,
                  p: 3
                }}
              >
                <ImageIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ opacity: 0.8, color: 'text.secondary' }}>
                  Cover image not available
                </Typography>
              </Paper>
            )}
          </Grid>

          {/* Book Information */}
          <Grid item xs={12} sm={8} md={9}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start">
              <Typography variant="h4" component="h1" gutterBottom>
                {title}
              </Typography>
              <IconButton
                onClick={handleFavoriteClick}
                color="secondary"
                aria-label={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
                sx={{ ml: 2 }}
              >
                {isFavorite(id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
            </Box>

            <Typography variant="h6" color="text.secondary" gutterBottom>
              by {authors.join(', ')}
            </Typography>

            {averageRating && (
              <Box display="flex" alignItems="center" mb={2}>
                <Rating value={averageRating} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary" ml={1}>
                  ({averageRating}/5)
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {description}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              {publisher && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Publisher</Typography>
                  <Typography color="text.secondary">{publisher}</Typography>
                </Grid>
              )}
              {publishedDate && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Published Date</Typography>
                  <Typography color="text.secondary">
                    {new Date(publishedDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              )}
              {pageCount && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Pages</Typography>
                  <Typography color="text.secondary">{pageCount}</Typography>
                </Grid>
              )}
              {language && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Language</Typography>
                  <Typography color="text.secondary">
                    {language.toUpperCase()}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Box sx={{ mt: 3 }}>
              {categories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  sx={{ mr: 1, mb: 1 }}
                  variant="outlined"
                />
              ))}
            </Box>

            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
              {infoLink && (
                <Button
                  variant="contained"
                  startIcon={<LanguageIcon />}
                  href={infoLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View on Google Books
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default BookDetails;