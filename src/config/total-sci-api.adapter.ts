import { AxiosAdapter } from "./http/axios.adapter";

declare global {
  interface Window {
    env: {
      VITE_TOTAL_SCI_API_URL: string;
      // Add other environment variables as needed
      [key: string]: string;
    };
  }
}

export const totalSciApiFetcher = new AxiosAdapter({
  baseURL: process.env.NEXT_PUBLIC_TOTAL_SCI_API_URL as string,
});
