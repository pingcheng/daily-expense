import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { apiConfig } from "@/base/api/apiConfig";
import { AuthTokenService } from "@/services/auth/AuthTokenService";
import { EventBus } from "@/event-bus.ts";
import { hasKey } from "@/helpers/helpers.ts";
import { AuthTokenDto } from "@/models/auth/AuthToken.ts";
import moment from "moment";

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

        this.api.interceptors.request.use((config) => {

            // If the token need to be refresh, then add the header to request a new one.
            if (AuthTokenService.get()?.needRefresh()) {
                config.headers["X-Refresh-Token"] = "1";
            }

            return config;
        });

        this.api.interceptors.response.use(
            (response) => {

                // If found the new token and expires time, then replace the local one.
                if (hasKey(response.headers, 'x-new-token') && hasKey(response.headers, 'x-new-token-expires')) {
                    const authToken = new AuthTokenDto();
                    authToken.accessToken = response.headers["x-new-token"];
                    authToken.expiresAt = moment(response.headers["x-new-token-expires"]);
                    AuthTokenService.persist(authToken);
                }

                return response;
            },
            error => {
                if (error.response) {

                    // If status is 401, then log out the app.
                    if (error.response.status === 401) {
                        AuthTokenService.destroy();
                        EventBus.$emit("logout");
                    }

                    return Promise.resolve(error.response);
                } else {
                    return Promise.reject(error);
                }
            }
        );

        this.get = this.get.bind(this);
        this.post = this.post.bind(this);
        this.put = this.put.bind(this);
        this.delete = this.delete.bind(this);
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

    /**
     * HTTP PUT method.
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
    public put<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
        return this.api.put(url, data, config);
    }

    /**
     * HTTP DELETE method, `statusCode`: 204 No Content.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {AxiosRequestConfig} [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     */
    public delete<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.delete(url, config);
    }
}

export interface ApiResponse<B> {
    statusCode: number;
    payload: B;
    message: string;
}