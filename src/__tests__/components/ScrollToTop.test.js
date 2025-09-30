import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from '@mui/material/styles';
import { createTheme } from '@mui/material/styles';
import ScrollToTop from '../../components/ScrollToTop';

// Configure fake timers
beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

// Create a theme instance
const theme = createTheme();

describe('ScrollToTop', () => {
  const renderWithTheme = (component) => {
    return render(
      <ThemeProvider theme={theme}>
        {component}
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    // Mock window.scrollTo
    window.scrollTo = jest.fn();
    
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 0
    });

    // Reset timers
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Reset scroll position
    Object.defineProperty(window, 'pageYOffset', {
      configurable: true,
      value: 0
    });
  });

  it('is hidden by default', async () => {
    await act(async () => {
      renderWithTheme(<ScrollToTop />);
    });
    
    const button = screen.getByRole('button', { name: /scroll back to top/i, hidden: true });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeVisible();
  });

  it('becomes visible when scrolled down', async () => {
    await act(async () => {
      renderWithTheme(<ScrollToTop />);
    });
    
    // Initial state check
    const button = screen.getByRole('button', { name: /scroll back to top/i, hidden: true });
    expect(button).not.toBeVisible();

    // Simulate scroll
    await act(async () => {
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: 400
      });
      fireEvent.scroll(window);
      // Allow animations to complete
      jest.runAllTimers();
    });

    expect(button).toBeVisible();
  });

  it('scrolls to top when clicked', async () => {
    await act(async () => {
      renderWithTheme(<ScrollToTop />);
    });
    
    // Make button visible
    await act(async () => {
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: 400
      });
      fireEvent.scroll(window);
      jest.runAllTimers();
    });

    const button = screen.getByRole('button', { name: /scroll back to top/i, hidden: true });
    expect(button).toBeVisible();

    // Click the button
    await act(async () => {
      fireEvent.click(button);
      jest.runAllTimers();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth'
    });
  });

  it('adds and removes scroll event listener', async () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    let unmount;
    await act(async () => {
      const result = renderWithTheme(<ScrollToTop />);
      unmount = result.unmount;
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));

    await act(async () => {
      unmount();
      jest.runAllTimers();
    });

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('has correct styles', async () => {
    await act(async () => {
      renderWithTheme(<ScrollToTop />);
    });
    
    // Make button visible
    await act(async () => {
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: 400
      });
      fireEvent.scroll(window);
      jest.runAllTimers();
    });

    const button = screen.getByRole('button', { name: /scroll back to top/i, hidden: true });
    expect(button).toHaveStyle({
      position: 'fixed',
      bottom: '16px',
      right: '16px',
      zIndex: 1000
    });
  });

  it('handles multiple scroll events correctly', async () => {
    await act(async () => {
      renderWithTheme(<ScrollToTop />);
    });
    
    const button = screen.getByRole('button', { name: /scroll back to top/i, hidden: true });

    // Scroll down
    await act(async () => {
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: 400
      });
      fireEvent.scroll(window);
      jest.runAllTimers();
    });

    expect(button).toBeVisible();

    // Scroll back up
    await act(async () => {
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: 200
      });
      fireEvent.scroll(window);
      jest.runAllTimers();
    });

    expect(button).not.toBeVisible();
  });

  it('renders KeyboardArrowUpIcon', () => {
    renderWithTheme(<ScrollToTop />);
    
    // Make button visible
    act(() => {
      Object.defineProperty(window, 'pageYOffset', {
        configurable: true,
        value: 400
      });
      fireEvent.scroll(window);
    });

    const icon = screen.getByTestId('KeyboardArrowUpIcon');
    expect(icon).toBeInTheDocument();
  });
});