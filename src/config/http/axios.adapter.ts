import axios, { AxiosInstance } from "axios";
import { HttpAdapter } from "./http.adapter";

interface Options {
  baseURL: string;
  params?: Record<string, string>;
}

export class AxiosAdapter implements HttpAdapter {
  private axiosInstance: AxiosInstance;

  constructor(options: Options) {
    this.axiosInstance = axios.create({
      baseURL: options.baseURL,
      params: options.params,
    });

    this.axiosInstance.interceptors.request.use(
      (config) => {
        // Ya no necesitas agregar el token manualmente
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.get<T>(url, options);
    return data;
  }

  async post<T>(
    url: string,
    content: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<T> {
    const { data } = await this.axiosInstance.post<T>(url, content, options);
    return data;
  }

  async patch<T>(
    url: string,
    content: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<T> {
    const { data } = await this.axiosInstance.patch<T>(url, content, options);
    return data;
  }

  async put<T>(
    url: string,
    content: Record<string, unknown>,
    options?: Record<string, unknown>
  ): Promise<T> {
    const { data } = await this.axiosInstance.put<T>(url, content, options);
    return data;
  }

  async delete<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    const { data } = await this.axiosInstance.delete<T>(url, options);
    return data;
  }
}
