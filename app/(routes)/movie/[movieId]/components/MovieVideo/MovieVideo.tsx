"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { MovieVideoProps } from "./MovieVideo.types";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

// Definición de tipos para las APIs de pantalla completa
interface FullscreenElement extends Element {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

interface FullscreenDocument extends Document {
  webkitFullscreenElement?: Element | null;
  mozFullScreenElement?: Element | null;
  msFullscreenElement?: Element | null;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

// Tipo para el evento del menú contextual
interface VideoContextMenuEvent extends Event {
  preventDefault(): void;
}

export function MovieVideo(props: MovieVideoProps) {
  const { currentMovie } = props;
  const [videoUrl, setVideoUrl] = useState<string>(currentMovie);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const convertGoogleDriveUrl = (url: string) => {
      if (url.includes('drive.google.com')) {
        const fileId = url.match(/\/d\/([^/]+)/)?.[1];
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview?usp=drivesdk&embedded=true&modestbranding=1&rel=0&showinfo=0`;
        }
      }
      return url;
    };

    setVideoUrl(convertGoogleDriveUrl(currentMovie));
  }, [currentMovie]);

  const checkFullscreenSupport = useCallback(() => {
    const elem = document.documentElement as FullscreenElement;
    return !!(
      elem.requestFullscreen ||
      elem.webkitRequestFullscreen ||
      elem.mozRequestFullScreen ||
      elem.msRequestFullscreen
    );
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = document.querySelector('.video-container') as FullscreenElement;
    const doc = document as FullscreenDocument;
    
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.mozRequestFullScreen) {
          await container.mozRequestFullScreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [isFullscreen]);

  useEffect(() => {
    const doc = document as FullscreenDocument;
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return (
    <div className="video-container relative w-full h-full">
      {videoUrl.includes('drive.google.com') ? (
        <div className="relative w-full h-full overflow-hidden">
          <iframe 
            src={videoUrl}
            width="100%"
            height="100%"
            allow="autoplay; fullscreen"
            allowFullScreen
            style={{ 
              border: 'none',
              position: 'absolute',
              top: '-50px',
              left: 0,
              width: '100%',
              height: 'calc(100% + 50px)'
            }}
          />
        </div>
      ) : (
        <ReactPlayer
          url={videoUrl}
          loop={true}
          width="100%"
          height="100%"
          playing={true}
          muted={false}
          controls={true}
          config={{
            file: {
              attributes: {
                controlsList: 'nodownload',
                playsInline: true,
                webkitPlaysInline: true,
                onContextMenu: (e: VideoContextMenuEvent) => e.preventDefault(),
              },
            },
          }}
        />
      )}
      {checkFullscreenSupport() && (
        <button
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-opacity"
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? "Exit" : "Fullscreen"}
        </button>
      )}
    </div>
  );
}