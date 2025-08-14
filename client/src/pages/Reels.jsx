import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';

const videoUrls = [
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830221/AQOyYVQD5-B7u3WDqNXMTC3R_j2wrVkXFEYVZW2r-xcnOUlgpe09Yea3T1iI3q8JhtP-oI2rgQaUhNcriH3SN-t8toADpgaam1eDzMk_ppoedp.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830218/AQNVB61Qrynm5Jlj0XS0FrUxfrdvSZwuDz4aBSHEFwXACDfFh5id50LWmQ7577Agk2yJOekJ-7XPAcLFzrPV4UR0EHR8grlPLF0oEpg_puo7tq.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830212/AQMYeig7BuHcNTlAhCfKle68AgSlEmViPv5itmqeQAXWfv5iWtKa1rTl5sF1HTBF_N2QZmphmvESh-_oFMdib0_UmSne9c-RcA1WD4s_ljiytt.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830191/AQMMgN7uvKV6wW5BKaC_-LiFwpLwHKWCASEbfXrZymB-ga1zU0VDqWDAAVNU8SjXY_brw0SLKcQhra97GhNvP2dsjcQBIMCPiIWs_ak_ttdwbj.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830188/AQNpvT1mYTEEAZ447ojoTQMffNxyPrvfPXi1P1V1AWWdN51nZDIK-VMBAGb9epQlDwn9W4yHi_PKpm9QY1-rjIdvm_QYvfoX8k3kLaA_iwyphf.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830186/AQNRGKh92JwkJgmiVcPREuuQ-xTOsDO8NjSygaFIhtK4CvAamq7mo52W9VuGzAfIVeUQLdntMUZ9Gs2F_dUXu9kV8CpcYJkOoAdfDOQ_dq8zxy.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830166/AQPC-Fgvfy5mAjPd8Skv2Ypk-MM8y0-5ZcMhWf7cSbKBb7t5b03OseqglesT1TdGOA9Ggam3Qy-9Pbsaz6KHEn6rEv3fWZUYnGAQ3lQ_nkdgf4.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830166/AQOY1BrPMwHtax16BqXqGguStnzjeb646AO-qtFMbOG_G7rDsH6GFBx7xNjGm2GkPxhGahAPQEyT0csXMd_U65YaaoRlY7Dl5MUa3qQ_bcut9u.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830165/AQNQIZ1RyT75DABEDbxVs-yKj9T4S4oifkwCQ1I7BDobjiS_i99nhfmw9-52WyCsHFZ4uldLMAYZc7QzA9T_x9EWzDvMm8hXD83eEwE_b346m5.mp4',
  'https://res.cloudinary.com/dbnticsz8/video/upload/v1752830164/AQPB8wbOscXId3op5zBCASGcWkgBrx-cp9wRjmZnzATn12JEL8hjfUMu8YDhFLmeWJVarXqLccbC6rbwRIdpoJQdLeKEXNLIhNKCnwQ_ngt0uo.mp4'
];

// Generate unique IDs more efficiently
let reelIdCounter = 0;
const generateReelId = () => `reel-${++reelIdCounter}`;

const generateDummyReels = (count = 5) => {
  return Array.from({ length: count }, () => ({
    id: generateReelId(),
    video: videoUrls[Math.floor(Math.random() * videoUrls.length)],
    likes: Math.floor(Math.random() * 10000) + 100,
    comments: Math.floor(Math.random() * 500) + 10,
    shares: Math.floor(Math.random() * 1000) + 5,
    isLiked: false,
    username: `user_${Math.floor(Math.random() * 1000)}`,
    caption: `Amazing content! #reel #viral #content${Math.floor(Math.random() * 100)}`,
  }));
};

const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

const Reel = React.memo(({ reel, isActive }) => {
  const { video, likes, comments, shares, isLiked: initialLiked, username, caption } = reel;
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(likes);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  
  const { ref, inView } = useInView({ 
    threshold: 0.7,
    triggerOnce: false 
  });

  // Handle video play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = async () => {
      try {
        if (inView && !hasError) {
          await video.play();
        } else {
          video.pause();
        }
      } catch (error) {
        console.warn('Video play failed:', error);
      }
    };

    handlePlay();
  }, [inView, hasError]);

  // Handle video loading states
  const handleLoadStart = useCallback(() => {
    setIsLoading(true);
    setHasError(false);
  }, []);

  const handleLoadedData = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
  }, []);

  // Toggle mute/unmute
  const toggleMute = useCallback((e) => {
    e.stopPropagation();
    if (videoRef.current) {
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      videoRef.current.muted = newMutedState;
    }
  }, [isMuted]);

  // Handle like action
  const handleLike = useCallback((e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    
    if (!isLiked) {
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 1000);
    }
  }, [isLiked]);

  // Handle share action
  const handleShare = useCallback((e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Check out this reel by ${username}`,
        text: caption,
        url: window.location.href,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, [username, caption]);

  // Handle comment action
  const handleComment = useCallback((e) => {
    e.stopPropagation();
    // In a real app, this would open a comment modal or navigate to comments
    console.log('Open comments for reel:', reel.id);
  }, [reel.id]);

  // Handle double tap to like
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    if (!isLiked) {
      handleLike(e);
    }
  }, [isLiked, handleLike]);

  // Preload video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
    }
  }, []);

  return (
    <div
      ref={ref}
      className="h-[85vh] md:h-screen w-full snap-start flex justify-center items-center bg-black relative"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-black text-white z-10">
          <div className="text-center">
            <div className="text-2xl mb-2">⚠️</div>
            <p>Failed to load video</p>
          </div>
        </div>
      ) : (
        <video
          ref={videoRef}
          src={video}
          className="h-full w-full object-cover"
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onError={handleError}
          onDoubleClick={handleDoubleClick}
        />
      )}

      {/* Heart animation overlay */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="animate-ping">
            <svg className="w-20 h-20 text-red-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        </div>
      )}
      
      {/* Mute/Unmute button - Top Right */}
      <button
        onClick={toggleMute}
        className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-70 transition-all"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}
      </button>

      {/* Action buttons - Right side */}
      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-4 z-20">
        {/* Like Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleLike}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
            aria-label={isLiked ? 'Unlike video' : 'Like video'}
          >
            <svg 
              className={`w-6 h-6 ${isLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
              fill={isLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">{formatCount(likeCount)}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleComment}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
            aria-label="View comments"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">{formatCount(comments)}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleShare}
            className="bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110"
            aria-label="Share video"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">{formatCount(shares)}</span>
        </div>
      </div>

      {/* Bottom overlay with user info and caption */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4 z-20">
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3">
            <span className="text-white text-sm font-bold">{username.charAt(0).toUpperCase()}</span>
          </div>
          <span className="text-white font-semibold">{username}</span>
        </div>
        <p className="text-white text-sm leading-relaxed">{caption}</p>
      </div>
    </div>
  );
});

Reel.displayName = 'Reel';

const Reels = () => {
  const [reels, setReels] = useState(() => generateDummyReels(5));
  const [isLoading, setIsLoading] = useState(false);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const maxReels = 50; // Limit to prevent memory issues
  
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Memoize the current active reel for better performance
  const activeReelIndex = useMemo(() => {
    // This would ideally be determined by scroll position
    // For now, we'll use a simple approach
    return Math.floor(reels.length / 2);
  }, [reels.length]);

  // Debounced load more function
  const loadMoreReels = useCallback(async () => {
    if (isLoading || hasReachedEnd) return;
    
    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setReels(prev => {
      const newReels = [...prev, ...generateDummyReels(5)];
      
      // Check if we've reached the maximum
      if (newReels.length >= maxReels) {
        setHasReachedEnd(true);
        return newReels.slice(0, maxReels);
      }
      
      return newReels;
    });
    
    setIsLoading(false);
  }, [isLoading, hasReachedEnd]);

  // Load more reels when sentinel is in view
  useEffect(() => {
    if (loadMoreInView && !isLoading && !hasReachedEnd) {
      loadMoreReels();
    }
  }, [loadMoreInView, loadMoreReels, isLoading, hasReachedEnd]);

  // Cleanup videos when component unmounts
  useEffect(() => {
    return () => {
      // Pause all videos to prevent memory leaks
      document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.src = '';
      });
    };
  }, []);

  return (
    <div className="h-[84vh] md:h-screen bg-white w-full md:w-[690px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      {reels.map((reel, index) => (
        <Reel 
          key={reel.id} 
          reel={reel} 
          isActive={index === activeReelIndex}
        />
      ))}

      {/* Loading/End indicator */}
      {!hasReachedEnd && (
        <div
          ref={loadMoreRef}
          className="h-screen w-full flex justify-center items-center bg-black text-white"
        >
          {isLoading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
              <p>Loading more reels...</p>
            </div>
          ) : (
            <p>Scroll for more.</p>
          )}
        </div>
      )}
      
      {hasReachedEnd && (
        <div className="h-screen w-full flex justify-center items-center bg-black text-white">
          <div className="text-center">
            <div className="text-2xl mb-2">🎉</div>
            <p>You've reached the end!</p>
            <p className="text-sm text-gray-400 mt-2">
              {reels.length} reels loaded
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reels;