// types.ts

export type Tab = 'authors' | 'libraries' | 'members' | 'books' | 'borrows';

export interface Author {
  id: number;
  fullname: string;
}

export interface Library {
  id: number;
  name: string;
}

export interface Member {
  id: number;
  fullname: string;
}

export interface Book {
  id: number;
  title: string;
  author: number;
  library: number;
}

export interface Borrow {
  id: number;
  member: number;
  book: number;
  borrowdate: string | null;
  returndate: string | null;
}

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}