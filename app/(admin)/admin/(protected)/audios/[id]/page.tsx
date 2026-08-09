import { getAudioDetailAction } from "@/actions/admin.actions";
import AudioDetail from "@/components/audio/AudioDetail";

// Next.js 15+: `params` la mot Promise, phai await truoc khi doc field ben trong.
export default async function AdminAudioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const audio = await getAudioDetailAction(id);

  return <AudioDetail audio={audio} backHref="/admin/audios" />;
}
