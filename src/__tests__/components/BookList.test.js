import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MemoryRouter } from 'react-router-dom';
import BookList from '../../components/BookList';
import { FavoritesProvider } from '../../context/FavoritesContext';

// Create a theme instance
const theme = createTheme();

// Mock framer-motion to avoid animation-related issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('BookList', () => {
  const mockBooks = [
    {
      id: '1',
      volumeInfo: {
        title: 'Book 1',
        authors: ['Author 1'],
        description: 'Description 1',
        imageLinks: { thumbnail: 'image1.jpg' }
      }
    },
    {
      id: '2',
      volumeInfo: {
        title: 'Book 2',
        authors: ['Author 2'],
        description: 'Description 2',
        imageLinks: { thumbnail: 'image2.jpg' }
      }
    }
  ];

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

  it('renders loading skeletons when loading is true', () => {
    renderWithProviders(<BookList loading={true} />);
    
    const skeletons = screen.getAllByTestId('book-skeleton');
    expect(skeletons).toHaveLength(6);
  });

  it('renders empty message when no books are provided', () => {
    renderWithProviders(<BookList books={[]} />);
    
    expect(screen.getByText(/No books available/i)).toBeInTheDocument();
  });

  it('renders list of books when provided', () => {
    renderWithProviders(<BookList books={mockBooks} />);
    
    expect(screen.getByText('Book 1')).toBeInTheDocument();
    expect(screen.getByText('Book 2')).toBeInTheDocument();
    expect(screen.getByText('Author 1')).toBeInTheDocument();
    expect(screen.getByText('Author 2')).toBeInTheDocument();
  });

  it('renders correct number of book cards', () => {
    renderWithProviders(<BookList books={mockBooks} />);
    
    const bookCards = screen.getAllByRole('article');
    expect(bookCards).toHaveLength(mockBooks.length);
  });

  it('applies responsive grid layout', () => {
    const { container } = renderWithProviders(<BookList books={mockBooks} />);
    
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toHaveStyle({
      display: 'grid',
    });
  });

  it('handles undefined books prop gracefully', () => {
    renderWithProviders(<BookList />);
    
    expect(screen.getByText(/No books available/i)).toBeInTheDocument();
  });

  it('maintains consistent spacing between book cards', () => {
    const { container } = renderWithProviders(<BookList books={mockBooks} />);
    
    const gridContainer = container.querySelector('.MuiGrid-container');
    expect(gridContainer).toHaveStyle({
      gap: expect.any(String)
    });
  });

  it('renders book cards with proper animation setup', () => {
    const { container } = renderWithProviders(<BookList books={mockBooks} />);
    
    const bookCards = container.querySelectorAll('[data-testid="book-card"]');
    bookCards.forEach((card, index) => {
      expect(card).toHaveAttribute('initial');
      expect(card).toHaveAttribute('animate');
      expect(card).toHaveAttribute('exit');
    });
  });
});