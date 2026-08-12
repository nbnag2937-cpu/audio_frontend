"use client";

import { useParams } from "next/navigation";
import AudioPageContent from "./AudioPageContent";
import TikTokChecker from "@/components/TikTokChecker";

function AudioPageClient() {
  const params = useParams<{ id: string }>();
  const audioId = params.id;

  return (
    <>
      <TikTokChecker />
      <AudioPageContent key={audioId} audioId={audioId} />
    </>
  );
}

export default AudioPageClient;
