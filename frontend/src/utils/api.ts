import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/v1/',
  headers: { 'Content-Type': 'application/json' },
});

// Authors
export const getAuthors = () => API.get('authors/');
export const createAuthor = (data: any) => API.post('authors/', data);
export const updateAuthor = (id: number, data: any) => API.patch(`authors/${id}/`, data);
export const deleteAuthor = (id: number) => API.delete(`authors/${id}/`);

// Libraries
export const getLibraries = () => API.get('libraries/');
export const createLibrary = (data: any) => API.post('libraries/', data);
export const updateLibrary = (id: number, data: any) => API.patch(`libraries/${id}/`, data);
export const deleteLibrary = (id: number) => API.delete(`libraries/${id}/`);

// Members
export const getMembers = () => API.get('members/');
export const createMember = (data: any) => API.post('members/', data);
export const updateMember = (id: number, data: any) => API.patch(`members/${id}/`, data);
export const deleteMember = (id: number) => API.delete(`members/${id}/`);

// Books
export const getBooks = () => API.get('books/');
export const createBook = (data: any) => API.post('books/', data);
export const updateBook = (id: number, data: any) => API.patch(`books/${id}/`, data);
export const deleteBook = (id: number) => API.delete(`books/${id}/`);

// Borrows
export const getBorrows = () => API.get('borrows/');
export const createBorrow = (data: any) => API.post('borrows/', data);
export const updateBorrow = (id: number, data: any) => API.patch(`borrows/${id}/`, data);
export const deleteBorrow = (id: number) => API.delete(`borrows/${id}/`);

export default API;