import axios from "axios";
import { Todo } from "./types";

const baseURL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api/v1/";

const API = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
});

API.interceptors.response.use(
  response => response,
  error => {
    throw new Error("Network error – check your connection / server status");
  }
);

export const getTodo = async (): Promise<Todo[]> => {
    const response = await API.get<Todo[]>("Todos/");
    return response.data;
};

export const createTodo = async (data: {
    title: string;
}): Promise<Todo> => {
    const response = await API.post<Todo>("Todos/", data);
    return response.data;
};

export const updateTodo = async ({
    id,
    data,
}: {
    id: number;
    data: { title: string };
}): Promise<Todo> => {
    const response = await API.patch<Todo>(`Todos/${id}/`, data);
    return response.data;
};