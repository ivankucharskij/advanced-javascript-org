export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BAD_GATEWAY: 502,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

type SuccessHttpResult<T, TStatus extends HttpStatusCode> = {
  ok: true;
  data: T;
  status: TStatus;
};

export type DataHttpBody<T> = {
  data: T;
};

export type ErrorHttpResult<TStatus extends HttpStatusCode> = {
  ok: false;
  message: string;
  status: TStatus;
};

export type HttpResult<
  T,
  TErrorStatus extends HttpStatusCode = HttpStatusCode,
  TSuccessStatus extends HttpStatusCode = HttpStatusCode,
> =
  | SuccessHttpResult<T, TSuccessStatus>
  | ErrorHttpResult<TErrorStatus>;

export type MessageHttpBody = {
  message: string;
};

export const isSuccessfulHttpStatus = (status: HttpStatusCode) => {
  return status >= 200 && status < 300;
};

export const createHttpResult = <
  T,
  TErrorStatus extends HttpStatusCode,
  TSuccessStatus extends HttpStatusCode,
>(
  result:
    | { status: TSuccessStatus; data: T }
    | { status: TErrorStatus; message: string },
): HttpResult<T, TErrorStatus, TSuccessStatus> => {
  return {
    ...result,
    ok: isSuccessfulHttpStatus(result.status),
  } as HttpResult<T, TErrorStatus, TSuccessStatus>;
};

export const jsonContent = <T>(schema: T) => ({
  "application/json": {
    schema,
  },
});
