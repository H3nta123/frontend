/**
 * API Service - базовый клиент для работы с бэкендом
 */

const API_BASE_URL = '/api/v1';

interface ApiResponse<T> {
    data: T;
    message?: string;
}

interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

class ApiService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getToken(): string | null {
        return localStorage.getItem('jwt_token');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        return headers;
    }

    async get<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'GET',
            headers: this.getHeaders(),
            credentials: 'include', // для http-only cookies
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Ошибка запроса');
        }

        return response.json();
    }

    async post<T>(endpoint: string, data?: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'POST',
            headers: this.getHeaders(),
            credentials: 'include',
            body: data ? JSON.stringify(data) : undefined,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Ошибка запроса');
        }

        const text = await response.text();
        return text ? JSON.parse(text) : {};
    }

    async patch<T>(endpoint: string, data: unknown): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'PATCH',
            headers: this.getHeaders(),
            credentials: 'include',
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Ошибка запроса');
        }

        return response.json();
    }

    async delete<T>(endpoint: string): Promise<T> {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            method: 'DELETE',
            headers: this.getHeaders(),
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.detail || error.message || 'Ошибка запроса');
        }

        return response.json();
    }
}

export const api = new ApiService(API_BASE_URL);
export type { ApiResponse, PaginatedResponse };
