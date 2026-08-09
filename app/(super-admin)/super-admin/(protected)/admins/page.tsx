import {
  createAdminAction,
  deleteAdminAction,
  listAdminsAction,
} from "@/actions/super-admin.actions";
import AdminManager from "@/components/admin/AdminManager";

export default async function SuperAdminAdminsPage() {
  const admins = await listAdminsAction();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Quản lý Admin</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Cấp và thu hồi tài khoản Admin
      </p>

      <div className="mt-6">
        <AdminManager
          admins={admins}
          createAction={createAdminAction}
          deleteAction={deleteAdminAction}
        />
      </div>
    </div>
  );
}
