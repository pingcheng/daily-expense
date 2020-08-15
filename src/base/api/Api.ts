import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "@/base/api/apiConfig";
import { AuthTokenService } from "@/services/auth/AuthTokenService";

export class Api {

    private readonly api: AxiosInstance;

    public static getInstance(config?: AxiosRequestConfig): Api {
        return new Api(config);
    }

    public constructor(config?: AxiosRequestConfig) {

        if (!config) {
            config = apiConfig;
        }

        const authToken = AuthTokenService.get();
        if (authToken) {
            config.headers.Authorization = authToken.getHeaderString();
        }

        // Create the api instance.
        this.api = axios.create(config);

        this.api.interceptors.response.use(
            (response) => response,
            error => {
                if (error.response) {
                    return Promise.resolve(error.response);
                } else {
                    return Promise.reject(error);
                }
            }
        );

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
    }

    /**
     * HTTP GET method
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} HTTP `axios` response payload.
     */
    public get<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.get(url, config);
    }

    /**
     * HTTP POST method
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param {AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     */
    public post<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
        return this.api.post(url, data, config);
    }

}

export interface ApiResponse<B> {
    statusCode: number;
    payload: B;
    message: string;
}