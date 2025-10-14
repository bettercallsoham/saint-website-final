import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
  videoSrc: string;
  title: string;
  description?: string;
  thumbnail?: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  title,
  description,
  thumbnail,
  autoPlay = false
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const videoRef = React.useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <>
      {/* Video Thumbnail/Preview */}
      <div 
        className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center group cursor-pointer hover-shadow smooth-transition relative"
        onClick={openModal}
      >
        {thumbnail ? (
          <div className="relative w-full h-full">
            <img 
              src={thumbnail} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 smooth-transition"></div>
            {/* Small play button at bottom */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 smooth-transition shadow-xl">
                <Play className="h-5 w-5 text-white ml-0.5" />
              </div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
            {/* Geometric pattern background */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
              <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>
              <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>
            </div>
            
            {/* Tech-inspired grid pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 grid-rows-6 h-full gap-4 p-4">
                {Array.from({ length: 48 }).map((_, i) => (
                  <div key={i} className="border border-white/20 rounded"></div>
                ))}
              </div>
            </div>
            
            {/* Small play button at bottom */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 smooth-transition shadow-xl border border-white/30">
                <Play className="h-5 w-5 text-white ml-0.5" />
              </div>
            </div>
            
            {/* Floating tech elements */}
            <div className="absolute top-16 left-16 w-4 h-4 border-2 border-white/40 rotate-45 animate-pulse"></div>
            <div className="absolute top-20 right-20 w-3 h-3 bg-blue-300 rounded-full animate-bounce delay-300"></div>
            <div className="absolute bottom-20 left-20 w-6 h-6 border-2 border-purple-300/60 rounded-full animate-pulse delay-700"></div>
            <div className="absolute bottom-16 right-16 w-2 h-8 bg-white/30 rounded animate-pulse delay-1000"></div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-full p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
            {description && (
              <p className="text-gray-600 mt-2">{description}</p>
            )}
          </DialogHeader>
          
          <div className="relative">
            <video
              ref={videoRef}
              src={videoSrc}
              className="w-full aspect-video"
              controls
              autoPlay={autoPlay}
              preload="metadata"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
            >
              Your browser does not support the video tag.
            </video>
            
            {/* Custom Controls Overlay (optional) */}
            <div className="absolute bottom-4 left-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={togglePlay}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                <Play className={`h-4 w-4 ${isPlaying ? 'hidden' : 'block'}`} />
                <span className={`${!isPlaying ? 'hidden' : 'block'}`}>⏸️</span>
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleMute}
                className="bg-black/50 text-white hover:bg-black/70"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={closeModal}
              className="absolute top-4 right-4 bg-black/50 text-white hover:bg-black/70"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface VideoHighlightsProps {
  videos: Array<{
    id: string;
    title: string;
    src: string;
    thumbnail?: string;
    description?: string;
  }>;
}

export const VideoHighlights: React.FC<VideoHighlightsProps> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return (
      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 group cursor-pointer hover-shadow smooth-transition relative">
        {/* Geometric pattern background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-600/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-blue-300/20 rounded-full blur-lg"></div>
        </div>
        
        {/* Tech-inspired grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-8 grid-rows-6 h-full gap-4 p-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div key={i} className="border border-white/20 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Small play button at bottom */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 smooth-transition shadow-xl border border-white/30">
            <Play className="h-5 w-5 text-white ml-0.5" />
          </div>
        </div>
        
        {/* Floating tech elements */}
        <div className="absolute top-16 left-16 w-4 h-4 border-2 border-white/40 rotate-45 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-3 h-3 bg-blue-300 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-20 left-20 w-6 h-6 border-2 border-purple-300/60 rounded-full animate-pulse delay-700"></div>
        <div className="absolute bottom-16 right-16 w-2 h-8 bg-white/30 rounded animate-pulse delay-1000"></div>
      </div>
    );
  }

  // For now, show the first video. In the future, this could be a carousel
  const featuredVideo = videos[0];

  return (
    <VideoPlayer
      videoSrc={featuredVideo.src}
      title={featuredVideo.title}
      description={featuredVideo.description}
      thumbnail={featuredVideo.thumbnail}
    />
  );
};

export default VideoPlayer;