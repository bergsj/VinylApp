"use client";

import { useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

export default function BarcodeScanner({ onDetected }: { onDetected: (code: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    const reader = new BrowserMultiFormatReader();
    readerRef.current = reader;

    reader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
      if (result) {
        onDetected(result.getText());
      }
    });

    return () => {
      reader.reset();
    };
  }, [onDetected]);

  return (
    <div className="relative rounded-xl overflow-hidden bg-zinc-900">
      <video ref={videoRef} className="w-full aspect-video object-cover" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-64 h-32 border-2 border-amber-400 rounded-lg opacity-80" />
      </div>
      <p className="text-center text-xs text-zinc-400 py-2">Point camera at barcode</p>
    </div>
  );
}
