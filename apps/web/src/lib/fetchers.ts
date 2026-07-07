import ky from "ky";

const requestOptions = {
  credentials: "include",
} as const;

export const fetchers = {
  delete<T>(url: string) {
    return ky.delete(url, requestOptions).json<T>();
  },
  get<T>(url: string) {
    return ky.get(url, requestOptions).json<T>();
  },
  post<T, TJson = unknown>(url: string, json?: TJson) {
    return ky
      .post(url, {
        ...requestOptions,
        ...(json === undefined ? {} : { json }),
      })
      .json<T>();
  },
};
