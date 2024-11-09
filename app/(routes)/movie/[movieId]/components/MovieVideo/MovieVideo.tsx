"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { MovieVideoProps } from "./MovieVideo.types";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
});

export function MovieVideo(props: MovieVideoProps) {
  const { currentMovie } = props;
  const [videoUrl, setVideoUrl] = useState<string>(currentMovie);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const convertGoogleDriveUrl = (url: string) => {
      if (url.includes('drive.google.com')) {
        const fileId = url.match(/\/d\/([^/]+)/)?.[1];
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview?usp=drivesdk&modestbranding=1&rel=0&showinfo=0`;
        }
      }
      return url;
    };

    setVideoUrl(convertGoogleDriveUrl(currentMovie));
  }, [currentMovie]);

  // Función para detectar el soporte de pantalla completa
  const checkFullscreenSupport = useCallback(() => {
    const elem = document.documentElement;
    return !!(
      elem.requestFullscreen ||
      (elem as any).webkitRequestFullscreen ||
      (elem as any).mozRequestFullScreen ||
      (elem as any).msRequestFullscreen
    );
  }, []);

  // Función para entrar/salir de pantalla completa
  const toggleFullscreen = useCallback(async () => {
    const container = document.querySelector('.video-container');
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).mozRequestFullScreen) {
          await (container as any).mozRequestFullScreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).mozCancelFullScreen) {
          await (document as any).mozCancelFullScreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  }, [isFullscreen]);

  // Listener para cambios en el estado de pantalla completa
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
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
                onContextMenu: (e: any) => e.preventDefault(),
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