import axios from 'axios';

const BASE_URL = 'https://www.googleapis.com/books/v1/volumes';

export const searchBooks = async ({ title, author, genre }) => {
  let query = [];
  if (title) query.push(`intitle:"${encodeURIComponent(title)}"`);
  if (author) query.push(`inauthor:"${encodeURIComponent(author)}"`);
  if (genre) query.push(encodeURIComponent(genre));

  const queryString = query.join('+');
  console.log('Search query:', queryString); // Debug log
  
  try {
    const response = await axios.get(`${BASE_URL}?q=${queryString}&maxResults=40`);
    console.log('API response:', response.data); // Debug log
    
    if (!response.data || !Array.isArray(response.data.items)) {
      console.warn('Invalid response format:', response.data);
      return [];
    }
    
    // Filter out items without essential information
    const validResults = response.data.items.filter(item => 
      item.volumeInfo && 
      item.volumeInfo.title &&
      item.id
    );

    return validResults;
  } catch (error) {
    console.error('Error fetching books:', error.response || error);
    throw error;
  }
};

export const getBookById = async (bookId) => {
  try {
    const response = await axios.get(`${BASE_URL}/${bookId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw error;
  }
};