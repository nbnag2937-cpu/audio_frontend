import {
  createAudioAction,
  deleteAudioAction,
  listAllAudiosAction,
  updateAudioAction,
} from "@/actions/super-admin.actions";
import AudioManager from "@/components/audio/AudioManager";

export default async function SuperAdminAudiosPage() {
  const audios = await listAllAudiosAction();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Toàn bộ Audio hệ thống</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Theo dõi và quản lý audio của mọi Admin
      </p>

      <div className="mt-6">
        <AudioManager
          audios={audios}
          detailBasePath="/super-admin/audios"
          createAction={createAudioAction}
          updateAction={updateAudioAction}
          deleteAction={deleteAudioAction}
        />
      </div>
    </div>
  );
}
