import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import { MemoryRouter, useLocation } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useScrollDirection } from '../../hooks/animations';

// Mock the animations hook
jest.mock('../../hooks/animations', () => ({
  useScrollDirection: jest.fn()
}));

// Mock the router hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn()
}));

// Create a theme instance
const theme = createTheme();

describe('Layout', () => {
  const renderWithProviders = (component) => {
    return render(
      <MemoryRouter>
        <ThemeProvider theme={theme}>
          {component}
        </ThemeProvider>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    // Set default mock values
    useScrollDirection.mockReturnValue('up');
    useLocation.mockReturnValue({ pathname: '/' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders header with logo and navigation', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByRole('banner')).toBeInTheDocument(); // AppBar
    expect(screen.getByTestId('MenuBookIcon')).toBeInTheDocument(); // Logo
  });

  it('renders children content', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders navigation links correctly', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByRole('link', { name: /book explorer/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /favorites/i })).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const mainBox = container.firstChild;
    expect(mainBox).toHaveStyle({
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    });
  });

  it('shows AppBar when scrolling up', () => {
    useScrollDirection.mockReturnValue('up');
    
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const appBar = screen.getByRole('banner');
    expect(appBar).toBeVisible();
  });

  it('hides AppBar when scrolling down', () => {
    useScrollDirection.mockReturnValue('down');
    
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const appBar = screen.getByRole('banner');
    expect(appBar).toHaveStyle({ transform: expect.stringContaining('translateY') });
  });

  it('applies hover styles to AppBar', () => {
    const { container } = renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const appBar = screen.getByRole('banner');
    fireEvent.mouseEnter(appBar);
    
    // Check for hover styles
    expect(appBar).toHaveStyle({
      backgroundColor: expect.any(String),
      boxShadow: expect.any(String)
    });
  });

  it('applies responsive styles based on viewport', () => {
    // Mock mobile viewport
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query === '(max-width:599.95px)',
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const logo = screen.getByTestId('MenuBookIcon');
    expect(logo).toHaveStyle({
      fontSize: '1.5rem'
    });
  });

  it('handles navigation correctly', () => {
    renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    const homeLink = screen.getByRole('link', { name: /book explorer/i });
    const favoritesLink = screen.getByRole('link', { name: /favorites/i });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(favoritesLink).toHaveAttribute('href', '/favorites');
  });

  it('includes ScrollToTop component', () => {
    const { container } = renderWithProviders(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    // ScrollToTop is rendered but might be hidden initially
    expect(container.querySelector('[data-testid="scroll-to-top"]')).toBeInTheDocument();
  });
});