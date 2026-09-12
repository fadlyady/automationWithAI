import { APIRequestContext, APIResponse } from '@playwright/test';

export class BaseApiClient {
  readonly request: APIRequestContext;
  readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = '') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  async get(endpoint: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${endpoint}`, { headers });
  }

  async post(endpoint: string, data: unknown, headers: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${endpoint}`, {
      data,
      headers,
    });
  }

  async put(endpoint: string, data: unknown, headers: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${endpoint}`, {
      data,
      headers,
    });
  }

  async delete(endpoint: string, headers: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${endpoint}`, { headers });
  }
}
