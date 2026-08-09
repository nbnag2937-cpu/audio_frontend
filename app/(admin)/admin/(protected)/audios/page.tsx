import {
  createAudioAction,
  deleteAudioAction,
  getMyAudiosAction,
  updateAudioAction,
} from "@/actions/admin.actions";
import AudioManager from "@/components/audio/AudioManager";

export default async function AdminAudiosPage() {
  const audios = await getMyAudiosAction();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white">Audio của tôi</h1>
      <p className="mt-1 text-sm text-zinc-400">
        Tạo, chỉnh sửa và quản lý audio bạn đã tải lên
      </p>

      <div className="mt-6">
        <AudioManager
          audios={audios}
          detailBasePath="/admin/audios"
          createAction={createAudioAction}
          updateAction={updateAudioAction}
          deleteAction={deleteAudioAction}
        />
      </div>
    </div>
  );
}
