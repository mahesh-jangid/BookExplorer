import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  CardActions,
  Box,
  Tooltip,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useFavorites } from '../context/FavoritesContext';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const getImageUrl = () => {
    if (imageError || !imageLinks) {
      return '/default-book-cover.svg';
    }
    // Try to get the highest quality image available
    const zoom = 2; // Request 2x resolution for better quality
    const baseUrl = imageLinks.thumbnail || imageLinks.smallThumbnail;
    if (!baseUrl) return '/default-book-cover.svg';
    
    // Remove any zoom parameter if it exists and add our own
    return baseUrl.replace(/zoom=\d+/, '').replace('http:', 'https:') + '&zoom=' + zoom;
  };

  const {
    id,
    volumeInfo: {
      title,
      authors = ['Unknown Author'],
      description = 'No description available',
      imageLinks = {},
    } = {},
  } = book;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(book);
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        width: '100%',
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: (theme) => theme.shadows[8],
          '& .card-media': {
            transform: 'scale(1.05)'
          }
        },
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: (theme) => theme.palette.background.paper,
      }}
    >
      <Box sx={{ position: 'relative', paddingTop: '150%', bgcolor: 'grey.100' }}>
        {!imageError ? (
          <CardMedia
            component="img"
            className="card-media"
            image={getImageUrl()}
            alt={title}
            onError={handleImageError}
            loading="lazy"
            sx={{ 
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'all 0.3s ease',
              backgroundColor: 'grey.50',
              '&:hover': {
                objectFit: 'contain',
                backgroundColor: 'grey.100',
              }
            }}
          />
        ) : (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'grey.50',
              p: 3
            }}
          >
            <ImageIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5, color: 'text.secondary' }} />
            <Typography variant="caption" sx={{ opacity: 0.8, color: 'text.secondary' }}>
              Cover image not available
            </Typography>
          </Box>
        )}
      </Box>
      <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
        <Typography gutterBottom variant="h6" component="h2" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          lineHeight: 1.2,
          height: '2.4em'
        }}>
          {title}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {authors.join(', ')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}>
          {truncateText(description, 150)}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
        <Tooltip title="Add to favorites">
          <IconButton 
            onClick={handleFavoriteClick}
            color="secondary"
            aria-label={isFavorite(id) ? "Remove from favorites" : "Add to favorites"}
          >
            {isFavorite(id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="View details">
          <IconButton 
            onClick={() => navigate(`/book/${id}`)}
            color="primary"
            aria-label="View book details"
          >
            <VisibilityIcon />
          </IconButton>
        </Tooltip>
      </CardActions>
    </Card>
  );
};

export default BookCard;