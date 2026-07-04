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
  post<T>(url: string) {
    return ky.post(url, requestOptions).json<T>();
  },
};
