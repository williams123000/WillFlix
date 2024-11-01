"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { MovieVideoProps } from "./MovieVideo.types";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export function MovieVideo(props: MovieVideoProps) {
  const { currentMovie } = props;
  const [videoUrl, setVideoUrl] = useState<string>(currentMovie);

  useEffect(() => {
    const convertGoogleDriveUrl = (url: string) => {
      if (url.includes('drive.google.com')) {
        // Extraer el ID del archivo de la URL de Google Drive
        const fileId = url.match(/\/d\/([^/]+)/)?.[1];
        if (fileId) {
          // Construir la URL de visualización directa
          return `https://drive.google.com/file/d/${fileId}/preview`;
        }
      }
      return url;
    };

    setVideoUrl(convertGoogleDriveUrl(currentMovie));
  }, [currentMovie]);

  return (
    <div className="relative w-full h-full">
      {videoUrl.includes('drive.google.com') ? (
        <iframe
          src={videoUrl}
          width="100%"
          height="100%"
          allow="autoplay"
          allowFullScreen
          style={{ border: 'none' }}
        />
      ) : (
        <ReactPlayer
          url={videoUrl}
          loop={true}
          width="100%"
          height="100%"
          playing={true}
          muted={false}
          controls={true}
        />
      )}
    </div>
  );
}