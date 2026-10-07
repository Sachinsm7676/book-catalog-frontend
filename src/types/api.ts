/** Error body the DevShelf API returns for every non-2xx response. */
export interface ApiErrorBody {
  status: number;
  code: string;
  message: string;
  /** field name → the one message for that field; empty when the error is not about a field */
  fieldErrors: Record<string, string>;
}

/**
 * What every service method throws. Screens read `message` (always user-readable) and `fieldErrors`;
 * `status` 0 means the request never reached the API (offline, server asleep or down, CORS).
 */
export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fieldErrors: Record<string, string>;

  constructor({ status, code, message, fieldErrors }: ApiErrorBody) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.fieldErrors = fieldErrors;
  }
}
