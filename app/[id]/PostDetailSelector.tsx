"use client";

import { useEffect } from "react";
import { useAppState } from "@/context/AppStateContext";

type PostDetailSelectorProps = {
  postId: number;
};

export default function PostDetailSelector({
  postId,
}: PostDetailSelectorProps) {
  const { selectProject } = useAppState();

  useEffect(() => {
    selectProject(postId);
  }, [postId, selectProject]);

  return null;
}
