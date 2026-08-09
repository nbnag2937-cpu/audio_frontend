# FE Integration — Next.js (service → action → UI)

Luồng bắt buộc: **UI chỉ gọi `action`**, không bao giờ import thẳng `service`. `service` chỉ lo gọi API (thuần fetch), `action` lo phần cookie/localStorage rồi mới gọi `service`.

```
lib/api-client.ts              # fetch helper dùng chung (JSON + multipart, parse lỗi backend)
services/
  ├── user.service.ts          # fetch thuần cho USER — không đụng cookie/localStorage
  ├── admin.service.ts         # fetch thuần cho ADMIN — nhận token qua tham số
  └── super-admin.service.ts   # fetch thuần cho SUPER_ADMIN — nhận token qua tham số
actions/
  ├── user.actions.ts          # "use client" — quản lý deviceId trong localStorage
  ├── admin.actions.ts         # "use server" — quản lý JWT trong cookie httpOnly "admin_token"
  └── super-admin.actions.ts   # "use server" — quản lý JWT trong cookie httpOnly "super_admin_token"
```

## Cài đặt

Copy 2 thư mục `lib/`, `services/`, `actions/` vào project Next.js (App Router), giữ đúng alias `@/...` (đã có sẵn trong `tsconfig.json` mặc định khi tạo project bằng `create-next-app`).

Thêm vào `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

> Biến này có tiền tố `NEXT_PUBLIC_` vì `user.actions.ts` chạy ở **client** (cần đọc localStorage) nên phải là biến public. `admin.actions.ts`/`super-admin.actions.ts` chạy ở server vẫn đọc được biến `NEXT_PUBLIC_*` bình thường.

## Vì sao 3 role có cách quản lý phiên khác nhau?

| Role        | Nơi lưu                                                 | File action                    | Vì sao                                                                                                                                                              |
| ----------- | ------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| USER        | `localStorage` (`music_device_id`, `music_unlock_date`) | `"use client"`                 | `deviceId` không cần bảo mật, chỉ là định danh thiết bị để biết "hôm nay đã unlock chưa" — localStorage chỉ đọc được ở trình duyệt nên action này phải chạy client. |
| ADMIN       | Cookie `httpOnly` (`admin_token`)                       | `"use server"` (Server Action) | JWT nhạy cảm, để `httpOnly` giúp JS phía trình duyệt (kể cả bị XSS) không đọc được token.                                                                           |
| SUPER_ADMIN | Cookie `httpOnly` (`super_admin_token`)                 | `"use server"` (Server Action) | Giống ADMIN, nhưng dùng **tên cookie riêng** để không đụng độ nếu cùng 1 trình duyệt vừa đăng nhập Admin vừa đăng nhập Super Admin ở 2 tab khác nhau.               |

## `types/audio.ts` cần có (dựa theo file service FE bạn gửi trước đó)

```ts
export interface AudioPart {
  id: string;
  partNumber: number;
  title: string;
  durationSec: number;
  audioUrl?: string; // chỉ có khi được phép xem file thật
}

export type AudioStatus = "processing" | "ready" | "failed";

export interface AudioItem {
  id: string;
  title: string;
  description: string | null;
  totalListened: number;
  totalListening: number;
  createdAt: string;
  status: AudioStatus;
  parts: AudioPart[];
}
```

## Danh sách action — dùng để làm gì, gọi ở đâu

### `user.actions.ts` (Client Component)

| Action                                             | Việc nó làm                                                                                                                                                                                                        |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `getOrCreateDeviceId()`                            | Đọc `deviceId` trong localStorage, nếu chưa có thì tự tạo UUID mới rồi lưu lại. Các action khác tự gọi hàm này, UI thường không cần gọi trực tiếp.                                                                 |
| `listAudiosAction({search, page, pageSize, sort})` | Lấy danh sách audio public (trang chủ, tìm kiếm). `sort="newest"` (mặc định) hoặc `"updated"` (audio mới chỉnh sửa).                                                                                               |
| `getRankedAudiosAction({metric, period, limit})`   | Lấy bảng xếp hạng. `metric="listening"` (mặc định) = "đang nghe nhiều", `metric="listened"` = "top lượt nghe". `period`: `"today"` (mặc định) \| `"month"` \| `"year"` \| `"all"`. Mỗi item có thêm `listenCount`. |
| `getTrendingTodayAction(limit?)`                   | Tiện ích gọi nhanh: audio đang nghe nhiều **hôm nay** (mặc định `limit=10`).                                                                                                                                       |
| `getTopListenedThisMonthAction(limit?)`            | Tiện ích gọi nhanh: top lượt nghe **tháng này** (mặc định `limit=10`).                                                                                                                                             |
| `getAudioDetailAction(id)`                         | Lấy chi tiết 1 audio (chưa có `audioUrl`).                                                                                                                                                                         |
| `getAdLinkAction()`                                | Lấy link quảng cáo để hiện nút "Xem quảng cáo mở khóa".                                                                                                                                                            |
| `unlockTodayAction()`                              | Gọi **sau khi** người dùng đã bấm vào link quảng cáo — ghi nhận mở khóa hôm nay + cache vào localStorage.                                                                                                          |
| `checkUnlockStatusAction()`                        | Kiểm tra hôm nay đã mở khóa chưa (ưu tiên đọc cache localStorage trước, đỡ tốn API).                                                                                                                               |
| `playAudioAction(id)`                              | Lấy audio kèm `audioUrl` để phát. Nếu chưa unlock, ném lại lỗi `ApiRequestError` với `code === "UNLOCK_REQUIRED"` — bắt lỗi này để hiện lại nút quảng cáo.                                                         |
| `completeAudioAction(id)`                          | Báo đã nghe hết bài (gọi lúc bắt sự kiện `ended` của thẻ `<audio>`).                                                                                                                                               |

Ví dụ dùng trong component:

```tsx
"use client";
import { playAudioAction } from "@/actions/user.actions";
import { ApiRequestError } from "@/lib/api-client";

async function handlePlay(audioId: string) {
  try {
    const audio = await playAudioAction(audioId);
    setSrc(audio.parts[0].audioUrl!);
  } catch (err) {
    if (err instanceof ApiRequestError && err.code === "UNLOCK_REQUIRED") {
      setShowAdModal(true);
    }
  }
}
```

### `admin.actions.ts` (Server Action)

| Action                                          | Việc nó làm                                                                                                                      |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `loginAdminAction(email, password)`             | Đăng nhập, lưu JWT vào cookie `httpOnly` `admin_token`, trả về thông tin tài khoản.                                              |
| `logoutAdminAction()`                           | Xóa cookie `admin_token`.                                                                                                        |
| `getAdminProfileAction()`                       | Lấy thông tin admin đang đăng nhập (đọc token từ cookie).                                                                        |
| `getMyAudiosAction()`                           | Lấy danh sách audio của chính admin.                                                                                             |
| `getAudioDetailAction(id)`                      | Xem chi tiết 1 audio của mình (kèm `audioUrl` để preview).                                                                       |
| `createAudioAction(formData)`                   | Tạo audio mới — `formData` cần field `audioFile` (File), `title`, `description` (tùy chọn). Tự `revalidatePath` trang danh sách. |
| `updateAudioAction(id, {title?, description?})` | Cập nhật audio.                                                                                                                  |
| `deleteAudioAction(id)`                         | Xóa audio.                                                                                                                       |

Cả 2 action đọc/ghi dữ liệu đều tự `throw AdminNotAuthenticatedError` nếu chưa đăng nhập — bắt lỗi này ở page/layout để `redirect("/admin/login")`.

Ví dụ dùng trong form upload (Client Component gọi Server Action):

```tsx
"use client";
import { createAudioAction } from "@/actions/admin.actions";

async function handleSubmit(formEl: HTMLFormElement) {
  const formData = new FormData(formEl); // input name="audioFile", name="title", name="description"
  const audio = await createAudioAction(formData);
}
```

### `super-admin.actions.ts` (Server Action)

| Action                                       | Việc nó làm                                                   |
| -------------------------------------------- | ------------------------------------------------------------- |
| `loginSuperAdminAction(email, password)`     | Đăng nhập, lưu JWT vào cookie `httpOnly` `super_admin_token`. |
| `logoutSuperAdminAction()`                   | Xóa cookie `super_admin_token`.                               |
| `getSuperAdminProfileAction()`               | Lấy thông tin super admin đang đăng nhập.                     |
| `createAdminAction({email, password, name})` | Cấp tài khoản ADMIN mới.                                      |
| `listAdminsAction()`                         | Danh sách toàn bộ ADMIN kèm thống kê.                         |
| `deleteAdminAction(id)`                      | Xóa 1 tài khoản ADMIN.                                        |
| `listAllAudiosAction()`                      | Toàn bộ audio của toàn bộ ADMIN, kèm thông tin chủ sở hữu.    |
| `getSystemStatsAction()`                     | Thống kê tổng quan hệ thống (dashboard).                      |
| `getAudioDetailAction(id)`                   | Xem chi tiết audio của **bất kỳ** admin nào.                  |
| `createAudioAction(formData)`                | Super admin tự tạo audio cho chính mình.                      |
| `updateAudioAction(id, payload)`             | Sửa audio của **bất kỳ** admin nào.                           |
| `deleteAudioAction(id)`                      | Xóa audio của **bất kỳ** admin nào.                           |

Tương tự admin, các action này tự `throw SuperAdminNotAuthenticatedError` nếu chưa đăng nhập.

## Gọi Server Action trực tiếp từ Client Component

Các action trong `admin.actions.ts`/`super-admin.actions.ts` có `"use server"` ở đầu file nên **gọi được trực tiếp như hàm bình thường** từ Client Component (không bắt buộc phải gắn vào `<form action={...}>`):

```tsx
"use client";
import { loginAdminAction } from "@/actions/admin.actions";

async function handleLogin() {
  const account = await loginAdminAction(email, password);
  router.push("/admin/dashboard");
}
```
# audio_frontend
# audio_frontend
