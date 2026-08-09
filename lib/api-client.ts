/**
 * api-client.ts
 * Helper fetch DUNG CHUNG cho ca 3 service (user/admin/super-admin).
 * File nay KHONG duoc dung cookie/localStorage - chi lo viec goi API va parse response.
 *
 * Quy uoc response tu backend (xem README backend):
 *   Thanh cong: { success: true, data: T }
 *   That bai:   { success: false, code: string, message: string }
 */

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

interface ApiSuccess<T> {
  success: true;
  data: T;
}

interface ApiFailure {
  success: false;
  code: string;
  message: string;
}

// Loi tuy chinh de UI/action de dang bat theo "code" (vd: UNLOCK_REQUIRED) thay vi parse message
export class ApiRequestError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  /** JWT token (ADMIN/SUPER_ADMIN) - se duoc gan vao header Authorization: Bearer <token> */
  token?: string;
  /** Object thuong (se JSON.stringify) hoac FormData (khi upload file) */
  body?: unknown;
}

/**
 * Goi API backend, tu dong:
 * - Gan Authorization header neu co token
 * - Tu nhan dien body la FormData (upload file) hay object thuong (JSON.stringify)
 * - Unwrap { success, data } hoac throw ApiRequestError neu that bai
 */
export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { token, headers, body, ...rest } = options;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    method: rest.method ?? (body !== undefined ? "POST" : "GET"),
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      // FormData: KHONG set Content-Type thu cong, de browser tu gan boundary
      ...(!isFormData && body !== undefined
        ? { "Content-Type": "application/json" }
        : {}),
      ...headers,
    },
    body: isFormData
      ? (body as FormData)
      : body !== undefined
        ? JSON.stringify(body)
        : undefined,
    // Du lieu audio/tai khoan thay doi thuong xuyen -> luon lay moi, khong cache
    cache: "no-store",
  });

  const json = (await response.json()) as ApiSuccess<T> | ApiFailure;

  if (!response.ok || !json.success) {
    const failure = json as ApiFailure;
    throw new ApiRequestError(
      response.status,
      failure.code ?? "UNKNOWN_ERROR",
      failure.message ?? "Da co loi xay ra, vui long thu lai",
    );
  }

  return json.data;
}
