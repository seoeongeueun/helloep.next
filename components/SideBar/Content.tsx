"use client";
import Caption from "@/components/Caption";
import Figures from "@/components/Figures";
import { useAppState } from "@/context/AppStateContext";

export default function Content() {
  const { selectedProjectId } = useAppState();

  if (selectedProjectId)
    return (
      <>
        <Figures />
        <Caption />
      </>
    );
}
