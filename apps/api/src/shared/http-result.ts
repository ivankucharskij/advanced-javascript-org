import { type HttpStatusCode, isSuccessfulHttpStatus } from "./http-status.js";

type SuccessHttpResult<T, TStatus extends HttpStatusCode> = {
  ok: true;
  data: T;
  status: TStatus;
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
