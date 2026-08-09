// Nem ra khi chua dang nhap - UI/page nen bat loi nay va dieu huong ve trang login
export class AdminNotAuthenticatedError extends Error {
  constructor() {
    super("Ban chua dang nhap voi tai khoan Admin");
    this.name = "AdminNotAuthenticatedError";
  }
}

// Nem ra khi chua dang nhap - UI/page nen bat loi nay va dieu huong ve trang login
export class SuperAdminNotAuthenticatedError extends Error {
  constructor() {
    super("Ban chua dang nhap voi tai khoan Super Admin");
    this.name = "SuperAdminNotAuthenticatedError";
  }
}
