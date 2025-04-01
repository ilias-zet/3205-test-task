import { useRef, useState } from "react";
import { Timer } from "../types";

const TIMEOUT = 3000;

type UseCopyReturnType = [string, (linkId: string, url: string) => Promise<void>];

export default function useCopy(): UseCopyReturnType {
  const [copiedLinkId, setCopiedLinkId] = useState<string>('');
  const copiedTimerRef = useRef<Timer>(0);

  const copyLink = async (linkId: string, url: string) => {
    await navigator.clipboard.writeText(url);
    if (copiedTimerRef.current) {
      clearTimeout(copiedTimerRef.current);
    }
    setCopiedLinkId(linkId);
    copiedTimerRef.current = setTimeout(() => {
      setCopiedLinkId('');
    }, TIMEOUT);
  }

  return [copiedLinkId, copyLink];
}
