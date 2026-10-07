import axios, { AxiosError } from "axios";
import { API_TIMEOUT_MS } from "@/constants/api";
import { ApiError, type ApiErrorBody } from "@/types/api";

/** One axios instance for the whole app. Base URL is baked in at build time (NEXT_PUBLIC_*). */
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080",
  timeout: API_TIMEOUT_MS,
  headers: { "Content-Type": "application/json" },
});

/** Shown when the request never got an answer: offline, API asleep (free host) or stopped. */
export const NETWORK_ERROR_MESSAGE =
  "We could not reach the DevShelf server. Check your connection and try again. The demo server can take up to a minute to wake up.";

/** Shown for a server answer that is not in our error format (proxy page, crash before our handler). */
export const UNKNOWN_ERROR_MESSAGE = "Something went wrong on our side. Please try again in a moment.";

const isApiErrorBody = (value: unknown): value is ApiErrorBody =>
  typeof value === "object" &&
  value !== null &&
  typeof (value as ApiErrorBody).message === "string" &&
  typeof (value as ApiErrorBody).code === "string";

/** Turn whatever axios threw into an ApiError with a message a user can read. */
export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof AxiosError) {
    const body: unknown = error.response?.data;
    if (error.response && isApiErrorBody(body)) {
      return new ApiError({
        status: error.response.status,
        code: body.code,
        message: body.message,
        fieldErrors: body.fieldErrors ?? {},
      });
    }
    if (!error.response) {
      return new ApiError({ status: 0, code: "NETWORK_ERROR", message: NETWORK_ERROR_MESSAGE, fieldErrors: {} });
    }
    return new ApiError({
      status: error.response.status,
      code: "UNKNOWN_ERROR",
      message: UNKNOWN_ERROR_MESSAGE,
      fieldErrors: {},
    });
  }

  return new ApiError({ status: 0, code: "UNKNOWN_ERROR", message: UNKNOWN_ERROR_MESSAGE, fieldErrors: {} });
}

/** 404 from the API: the book is gone. Retrying will not bring it back. */
export const isNotFoundError = (error: unknown): boolean => error instanceof ApiError && error.status === 404;
