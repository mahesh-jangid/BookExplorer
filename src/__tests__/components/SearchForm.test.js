import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import SearchForm from '../../components/SearchForm';
import { searchBooks } from '../../services/booksApi';

// Create a theme instance
const theme = createTheme();

// Mock the booksApi module
jest.mock('../../services/booksApi');

describe('SearchForm', () => {
  const mockOnSearchResults = jest.fn();
  const mockOnSearchStart = jest.fn();
  let user;

  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    user = userEvent.setup();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the search form with all fields', () => {
    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    expect(screen.getByText('Discover Your Next Book')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /title/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /author/i })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /genre\/keyword/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear all/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search books/i })).toBeInTheDocument();
  });

  it('handles input changes correctly', async () => {
    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    const authorField = screen.getByRole('textbox', { name: /author/i });
    const genreField = screen.getByRole('textbox', { name: /genre\/keyword/i });

    await user.type(titleField, 'Harry Potter');
    await user.type(authorField, 'J.K. Rowling');
    await user.type(genreField, 'Fantasy');

    expect(titleField).toHaveValue('Harry Potter');
    expect(authorField).toHaveValue('J.K. Rowling');
    expect(genreField).toHaveValue('Fantasy');
  });

  it('shows validation error when submitting empty form', async () => {
    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const submitButton = screen.getByRole('button', { name: /search books/i });
    await user.click(submitButton);

    expect(await screen.findByText('Please fill at least one search field')).toBeInTheDocument();
    expect(searchBooks).not.toHaveBeenCalled();
  });

  it('clears individual fields when clicking clear icons', async () => {
    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    // Fill all fields
    const titleField = screen.getByRole('textbox', { name: /title/i });
    const authorField = screen.getByRole('textbox', { name: /author/i });
    const genreField = screen.getByRole('textbox', { name: /genre\/keyword/i });

    // Type in all fields
    await act(async () => {
      await user.type(titleField, 'Harry Potter');
      await user.type(authorField, 'J.K. Rowling');
      await user.type(genreField, 'Fantasy');
    });

    // Find the clear button for the title field
    const clearButtons = screen.getAllByTestId('ClearIcon').map(icon => icon.closest('button'));
    const titleClearButton = clearButtons[0]; // First clear button is for the title field
    
    // Click the clear button
    await act(async () => {
      await user.click(titleClearButton);
    });

    // Wait for the state to update and verify
    await waitFor(() => {
      expect(titleField).toHaveValue('');
      expect(authorField).toHaveValue('J.K. Rowling');
      expect(genreField).toHaveValue('Fantasy');
    });
  });

  it('clears all fields when clicking Clear All button', async () => {
    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    const authorField = screen.getByRole('textbox', { name: /author/i });
    const genreField = screen.getByRole('textbox', { name: /genre\/keyword/i });

    // Type in all fields
    await act(async () => {
      await user.type(titleField, 'Harry Potter');
      await user.type(authorField, 'J.K. Rowling');
      await user.type(genreField, 'Fantasy');
    });

    const clearAllButton = screen.getByRole('button', { name: /clear all/i });
    
    // Click clear all button
    await act(async () => {
      await user.click(clearAllButton);
    });

    // Wait for the state to update and verify
    await waitFor(() => {
      expect(titleField).toHaveValue('');
      expect(authorField).toHaveValue('');
      expect(genreField).toHaveValue('');
    });
  });

  it('handles successful search submission', async () => {
    const mockResults = [{ id: 1, title: 'Test Book' }];
    searchBooks.mockResolvedValueOnce(mockResults);

    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    
    // Type in search field
    await act(async () => {
      await user.type(titleField, 'Test Book');
    });

    const submitButton = screen.getByRole('button', { name: /search books/i });
    
    // Click submit button
    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for all async operations to complete
    await waitFor(() => {
      expect(mockOnSearchStart).toHaveBeenCalled();
      expect(searchBooks).toHaveBeenCalledWith({
        title: 'Test Book',
        author: '',
        genre: ''
      });
      expect(mockOnSearchResults).toHaveBeenCalledWith(mockResults);
    }, { timeout: 10000 }); // Increase timeout for this specific check
  });

  it('handles search with no results', async () => {
    searchBooks.mockResolvedValueOnce([]);

    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    await user.type(titleField, 'Nonexistent Book');

    const submitButton = screen.getByRole('button', { name: /search books/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('No books found matching your criteria. Try different search terms.')).toBeInTheDocument();
      expect(mockOnSearchResults).toHaveBeenCalledWith([]);
    });
  });

  it('handles search error', async () => {
    searchBooks.mockRejectedValueOnce(new Error('API Error'));

    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    await user.type(titleField, 'Test Book');

    const submitButton = screen.getByRole('button', { name: /search books/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch books. Please try again.')).toBeInTheDocument();
      expect(mockOnSearchResults).toHaveBeenCalledWith([]);
    });
  });

  it('disables search button while loading', async () => {
    searchBooks.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)));

    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    await user.type(titleField, 'Test Book');

    const submitButton = screen.getByRole('button', { name: /search books/i });
    
    await user.click(submitButton);
    expect(submitButton).toBeDisabled();
    expect(screen.getByText('Searching...')).toBeInTheDocument();

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
      expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    });
  });

  it('properly handles form submission with multiple fields', async () => {
    const mockResults = [{ id: 1, title: 'Fantasy Book', author: 'Test Author' }];
    searchBooks.mockResolvedValueOnce(mockResults);

    renderWithTheme(<SearchForm onSearchResults={mockOnSearchResults} onSearchStart={mockOnSearchStart} />);
    
    const titleField = screen.getByRole('textbox', { name: /title/i });
    const authorField = screen.getByRole('textbox', { name: /author/i });
    const genreField = screen.getByRole('textbox', { name: /genre\/keyword/i });

    // Type in all fields
    await act(async () => {
      await user.type(titleField, 'Fantasy Book');
      await user.type(authorField, 'Test Author');
      await user.type(genreField, 'Fantasy');
    });

    const submitButton = screen.getByRole('button', { name: /search books/i });
    
    // Click submit button
    await act(async () => {
      await user.click(submitButton);
    });

    // Wait for all async operations to complete
    await waitFor(() => {
      expect(searchBooks).toHaveBeenCalledWith({
        title: 'Fantasy Book',
        author: 'Test Author',
        genre: 'Fantasy'
      });
      expect(mockOnSearchResults).toHaveBeenCalledWith(mockResults);
    }, { timeout: 10000 }); // Increase timeout for this specific check
  });
});