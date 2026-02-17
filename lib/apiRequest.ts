export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type ApiResponse<T> = {
  data: T;
  headers: Headers;
};

type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
};

export async function apiRequest<T>(
  url: string,
  {
    method = "GET",
    data,
    headers,
    credentials,
    signal,
  }: ApiRequestOptions = {},
): Promise<T> {
  const init: RequestInit = {
    method,
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...headers,
    },
    ...(credentials ? { credentials } : {}),
    signal,
  };

  if (data !== undefined) {
    init.body = JSON.stringify(data);
  }

  const res = await fetch(url, init);

  // 응답이 JSON인지 안전하게 파싱
  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const body = isJson
    ? await res.json().catch(() => undefined)
    : await res.text().catch(() => undefined);

  if (!res.ok) {
    console.error("API Request Failed:", body?.message);
    throw new ApiError("Request failed", res.status, body);
  }

  return body as T;
}

// apiRequest와 동일하지만 응답 헤더도 함께 반환하는 함수
// wp는 pagination 정보를 헤더로 반환하기 때문에 header 정보가 필요하다
export async function apiRequestWithHeaders<T>(
  url: string,
  options: ApiRequestOptions = {},
): Promise<ApiResponse<T>> {
  const init: RequestInit = {
    method: options.method ?? "GET",
    headers: {
      ...(options.data ? { "Content-Type": "application/json" } : {}),
      ...(options.headers ?? {}),
    },
    ...(options.credentials ? { credentials: options.credentials } : {}),
    signal: options.signal,
  };

  if (options.data !== undefined) {
    init.body = JSON.stringify(options.data);
  }

  const res = await fetch(url, init);

  const contentType = res.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  const body = isJson
    ? await res.json().catch(() => undefined)
    : await res.text().catch(() => undefined);

  if (!res.ok) {
    console.error("API Request Failed:", body?.message);
    throw new ApiError("Request failed", res.status, body);
  }

  return { data: body as T, headers: res.headers };
}
