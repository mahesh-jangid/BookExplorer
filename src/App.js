import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { FavoritesProvider } from './context/FavoritesContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import Loading from './components/Loading';
import theme from './theme';

// Lazy load routes for better performance
const BookDetails = React.lazy(() => import('./pages/BookDetails'));
const Favorites = React.lazy(() => import('./pages/Favorites'));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <FavoritesProvider>
        <Router>
          <Layout>
            <Suspense fallback={<Loading />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </Suspense>
          </Layout>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
