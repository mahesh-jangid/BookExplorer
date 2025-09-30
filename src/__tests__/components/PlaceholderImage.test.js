import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import PlaceholderImage from '../../components/PlaceholderImage';

// Create a theme instance
const theme = createTheme();

describe('PlaceholderImage', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders the placeholder image', () => {
    renderWithTheme(<PlaceholderImage />);
    
    const image = screen.getByRole('img', { name: /book placeholder/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/placeholder-book.svg');
  });

  it('displays "Image not available" text', () => {
    renderWithTheme(<PlaceholderImage />);
    
    expect(screen.getByText('Image not available')).toBeInTheDocument();
  });

  it('has correct layout properties', () => {
    const { container } = renderWithTheme(<PlaceholderImage />);
    
    const mainBox = container.firstChild;
    expect(mainBox).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    });
  });

  it('applies grayscale filter to image', () => {
    renderWithTheme(<PlaceholderImage />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveStyle({
      filter: 'grayscale(1)'
    });
  });

  it('has responsive image width', () => {
    renderWithTheme(<PlaceholderImage />);
    
    const image = screen.getByRole('img');
    expect(image).toHaveStyle({
      width: '100%',
      height: 'auto'
    });
  });

  it('has proper text styling', () => {
    renderWithTheme(<PlaceholderImage />);
    
    const text = screen.getByText('Image not available');
    const textContainer = text.parentElement;
    expect(textContainer).toHaveStyle({
      textAlign: 'center'
    });
  });

  it('maintains proper spacing between image and text', () => {
    const { container } = renderWithTheme(<PlaceholderImage />);
    
    const imageContainer = container.querySelector('div > div');
    expect(imageContainer).toHaveStyle({
      marginBottom: expect.any(String)
    });
  });
});