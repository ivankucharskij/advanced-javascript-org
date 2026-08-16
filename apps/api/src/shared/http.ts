export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

export type SuccessHttpResult<
  T,
  TMeta = unknown,
  TStatus extends HttpStatusCode = HttpStatusCode,
> = {
  ok: true;
  data: T;
  meta?: TMeta;
  status: TStatus;
};

export type DataHttpBody<T, TMeta = unknown> = {
  data: T;
  meta?: TMeta;
};

export type ErrorHttpResult<TStatus extends HttpStatusCode> = {
  ok: false;
  message: string;
  status: TStatus;
};

export type HttpResult<
  T,
  TMeta = unknown,
  TErrorStatus extends HttpStatusCode = HttpStatusCode,
  TSuccessStatus extends HttpStatusCode = HttpStatusCode,
> =
  | SuccessHttpResult<T, TMeta, TSuccessStatus>
  | ErrorHttpResult<TErrorStatus>;

export type MessageHttpBody = {
  message: string;
};

export const isSuccessfulHttpStatus = (status: HttpStatusCode) => {
  return status >= 200 && status < 300;
};

export function createHttpResult<
  T,
  TSuccessStatus extends HttpStatusCode,
  TMeta = unknown,
>(result: {
  data: T;
  meta?: TMeta;
  status: TSuccessStatus;
}): SuccessHttpResult<T, TMeta, TSuccessStatus>;
export function createHttpResult<TErrorStatus extends HttpStatusCode>(result: {
  status: TErrorStatus;
  message: string;
}): ErrorHttpResult<TErrorStatus>;
export function createHttpResult<
  T,
  TMeta,
  TErrorStatus extends HttpStatusCode,
  TSuccessStatus extends HttpStatusCode,
>(
  result:
    | { data: T; meta?: TMeta; status: TSuccessStatus }
    | { status: TErrorStatus; message: string },
): HttpResult<T, TMeta, TErrorStatus, TSuccessStatus> {
  return {
    ...result,
    ok: isSuccessfulHttpStatus(result.status),
  } as HttpResult<T, TMeta, TErrorStatus, TSuccessStatus>;
}

export const jsonContent = <T>(schema: T) => ({
  "application/json": {
    schema,
  },
});
