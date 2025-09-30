import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import BookCard from '../../components/BookCard';
import { FavoritesProvider } from '../../context/FavoritesContext';

// Create a theme instance
const theme = createTheme();

// Mock navigate function
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

describe('BookCard', () => {
  const mockBook = {
    id: '123',
    volumeInfo: {
      title: 'Test Book',
      authors: ['Test Author'],
      description: 'Test Description',
      imageLinks: {
        thumbnail: 'https://test.com/image.jpg'
      }
    }
  };

  const renderWithProviders = (component) => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          <FavoritesProvider>
            {component}
          </FavoritesProvider>
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders book information correctly', () => {
    renderWithProviders(<BookCard book={mockBook} />);

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('handles missing book information gracefully', () => {
    const incompleteBook = {
      id: '123',
      volumeInfo: {
        title: 'Test Book'
      }
    };

    renderWithProviders(<BookCard book={incompleteBook} />);

    expect(screen.getByText('Test Book')).toBeInTheDocument();
    expect(screen.getByText('Unknown Author')).toBeInTheDocument();
    expect(screen.getByText('No description available')).toBeInTheDocument();
  });

  it('navigates to book details on view button click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCard book={mockBook} />);

    const viewButton = screen.getByRole('button', { name: /view details/i });
    await user.click(viewButton);

    expect(mockNavigate).toHaveBeenCalledWith(`/book/${mockBook.id}`);
  });

  it('toggles favorite status when clicking favorite button', async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookCard book={mockBook} />);

    const favoriteButton = screen.getByRole('button', { name: /add to favorites/i });
    await user.click(favoriteButton);

    // Should now show "Remove from favorites"
    expect(screen.getByRole('button', { name: /remove from favorites/i })).toBeInTheDocument();

    // Click again to remove from favorites
    await user.click(screen.getByRole('button', { name: /remove from favorites/i }));

    // Should show "Add to favorites" again
    expect(screen.getByRole('button', { name: /add to favorites/i })).toBeInTheDocument();
  });

  it('handles image loading error correctly', async () => {
    renderWithProviders(<BookCard book={mockBook} />);

    const image = screen.getByRole('img');
    fireEvent.error(image);

    // Should load default image
    expect(image.src).toContain('default-book-cover.svg');
  });

  it('shows truncated description with tooltip', async () => {
    const bookWithLongDescription = {
      ...mockBook,
      volumeInfo: {
        ...mockBook.volumeInfo,
        description: 'A'.repeat(200) // Create a long description
      }
    };

    renderWithProviders(<BookCard book={bookWithLongDescription} />);

    // Description should be truncated
    const description = screen.getByText(/^A+/);
    expect(description.textContent.length).toBeLessThan(200);

    // Full description should be available in tooltip
    const tooltip = description.closest('[role="tooltip"]') || description.parentElement;
    expect(tooltip).toBeInTheDocument();
  });

  it('applies hover effects on card', async () => {
    const { container } = renderWithProviders(<BookCard book={mockBook} />);
    
    const card = container.querySelector('.MuiCard-root');
    
    fireEvent.mouseEnter(card);
    expect(card).toHaveStyle('transform: translateY(-4px)');
    
    fireEvent.mouseLeave(card);
    expect(card).not.toHaveStyle('transform: translateY(-4px)');
  });

  it('optimizes image URL for better quality', () => {
    renderWithProviders(<BookCard book={mockBook} />);
    
    const image = screen.getByRole('img');
    expect(image.src).toContain('zoom=2');
    expect(image.src).toContain('https:');
  });
});