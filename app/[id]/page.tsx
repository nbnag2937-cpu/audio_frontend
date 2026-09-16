// app/[id]/page.tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AudioPageClient from "./AudioPageClient";
import { fetchAudioById } from "@/services/audio.service";
import { formatListenCount, formatVietnameseDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

const SITE_NAME = "Audio Không Quảng Cáo";
const SITE_URL = "https://www.audiokhongquangcao.site";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const audio = await fetchAudioById(id);

  if (!audio) {
    return { title: `Không tìm thấy audio - ${SITE_NAME}` };
  }

  const title = `${audio.title} - ${SITE_NAME}`;
  const description = `${audio.title}. ${formatListenCount(
    audio.currentListeners,
  )} lượt nghe. Cập nhật ${formatVietnameseDate(
    audio.createdAt,
  )}. Nghe miễn phí, không cần tài khoản, không quảng cáo.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/${id}`,
    },
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      type: "music.song",
      url: `${SITE_URL}/${id}`,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  const audio = await fetchAudioById(id);

  const jsonLd = audio
    ? {
        "@context": "https://schema.org",
        "@type": "AudioObject",
        name: audio.title,
        datePublished: audio.createdAt,
        description: `${audio.title} - nghe miễn phí không quảng cáo`,
        url: `${SITE_URL}/${id}`,
      }
    : null;

  return (
    <div>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <Header />
      <AudioPageClient />
      <Footer />
    </div>
  );
}

export default Page;
