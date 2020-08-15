import { AxiosRequestConfig } from "axios";

export const apiConfig: AxiosRequestConfig = {
    withCredentials: false,
    timeout: 30 * 1000,
    baseURL: 'http://localhost:18000/api/v1',
    headers: {
        common: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "Content-Type": "application/json",
            Accept: "application/json",
        }
    }
}