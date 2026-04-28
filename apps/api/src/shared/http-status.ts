export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
} as const;

export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];

export const isSuccessfulHttpStatus = (status: HttpStatusCode) => {
  return status >= 200 && status < 300;
};
