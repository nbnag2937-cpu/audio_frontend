"use client";

import { useParams } from "next/navigation";
import AudioPageContent from "./AudioPageContent";

function AudioPageClient() {
  const params = useParams<{ id: string }>();
  const audioId = params.id;

  return <AudioPageContent key={audioId} audioId={audioId} />;
}

export default AudioPageClient;
