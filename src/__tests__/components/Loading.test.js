import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import Loading from '../../components/Loading';

// Create a theme instance
const theme = createTheme();

describe('Loading', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  it('renders the loading spinner', () => {
    renderWithTheme(<Loading />);
    
    const spinner = screen.getByRole('progressbar');
    expect(spinner).toBeInTheDocument();
  });

  it('has correct minimum height', () => {
    const { container } = renderWithTheme(<Loading />);
    
    const box = container.firstChild;
    expect(box).toHaveStyle({ minHeight: '200px' });
  });

  it('has correct flex layout properties', () => {
    const { container } = renderWithTheme(<Loading />);
    
    const box = container.firstChild;
    expect(box).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    });
  });

  it('spinner is visible and centered', () => {
    renderWithTheme(<Loading />);
    
    const spinner = screen.getByRole('progressbar');
    const spinnerParent = spinner.parentElement;
    
    expect(spinnerParent).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    });
  });
});