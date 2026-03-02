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
  borrowdate: string;
  returndate: string;
}

export type Tab = 'authors' | 'libraries' | 'members' | 'books' | 'borrows';