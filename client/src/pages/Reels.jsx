import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API functions
const api = {
  fetchReels: async (page = 1, limit = 5) => {
    const response = await axios.get(`${BASE_URL}/reel/feed?page=${page}&limit=${limit}`, {
      withCredentials: true
    });
    return response.data;
  },

  likeReel: async (reelId) => {
    const response = await axios.post(`${BASE_URL}/reel/${reelId}/like`, {}, {
      withCredentials: true
    });
    return response.data;
  },

  commentOnReel: async (reelId, comment) => {
    const response = await axios.post(`${BASE_URL}/reel/${reelId}/comment`, 
      { comment }, 
      { withCredentials: true }
    );
    return response.data;
  }
};

const formatCount = (count) => {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + 'M';
  } else if (count >= 1000) {
    return (count / 1000).toFixed(1) + 'K';
  }
  return count.toString();
};

// Check if user is logged in
const checkAuthUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Login prompt function
const promptLogin = (action = 'perform this action') => {
  const shouldLogin = window.confirm(`Please log in to ${action}. Would you like to go to login page?`);
  if (shouldLogin) {
    // Redirect to login page or open login modal
    window.location.href = '/login'; // Adjust this path as needed
  }
};

// Shuffle array function
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Reel = React.memo(({ reel, isActive, onUpdateReel }) => {
  const { 
    _id,
    URL: videoUrl, 
    likes = 0, 
    comments = [], 
    shares = 0, 
    user: reelOwner,
    description: caption,
    createdAt 
  } = reel;

  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(likes);
  const [isUserLiked, setIsUserLiked] = useState(false);
  
  const { ref, inView } = useInView({ 
    threshold: 0.7,
    triggerOnce: false 
  });

  const currentUser = checkAuthUser();

  // Check if current user has already liked this reel
  useEffect(() => {
    // You might need to implement a way to check if user has liked the reel
    // This could be done by adding a user's liked reels list or checking via API
    // For now, we'll assume the backend returns this information
    setIsUserLiked(false); // This should be updated based on your backend response
  }, [_id, currentUser]);

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

  // Handle like action with authentication check
  const handleLike = useCallback(async (e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      promptLogin('like this reel');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const response = await api.likeReel(_id);
      
      // Update local state immediately for better UX
      const newLikeState = !isUserLiked;
      setIsUserLiked(newLikeState);
      setCurrentLikes(prev => newLikeState ? prev + 1 : prev - 1);

      // Update the reel data in parent component
      onUpdateReel(_id, {
        ...reel,
        likes: response.likes || currentLikes + (newLikeState ? 1 : -1)
      });

      if (newLikeState) {
        setShowHeartAnimation(true);
        setTimeout(() => setShowHeartAnimation(false), 1000);
      }

    } catch (error) {
      console.error('Error liking reel:', error);
      // Revert optimistic update on error
      setIsUserLiked(!isUserLiked);
      setCurrentLikes(prev => isUserLiked ? prev + 1 : prev - 1);
      
      if (error.response?.status === 401) {
        promptLogin('like this reel');
      } else {
        alert('Failed to like reel. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [_id, currentUser, isUserLiked, isProcessing, reel, onUpdateReel, currentLikes]);

  // Handle share action
  const handleShare = useCallback((e) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: `Check out this reel by ${reelOwner?.fullName}`,
        text: caption,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }, [reelOwner, caption]);

  // Handle comment action with authentication check
  const handleComment = useCallback((e) => {
    e.stopPropagation();
    
    if (!currentUser) {
      promptLogin('comment on this reel');
      return;
    }

    // Simple prompt for now - in a real app, this would open a comment modal
    const commentText = prompt('Enter your comment:');
    if (!commentText?.trim()) return;

    const submitComment = async () => {
      try {
        setIsProcessing(true);
        const response = await api.commentOnReel(_id, commentText.trim());
        
        // Update the reel data
        onUpdateReel(_id, {
          ...reel,
          comments: response.comments || [...comments, { text: commentText.trim(), user: currentUser }]
        });

        alert('Comment added successfully!');
      } catch (error) {
        console.error('Error commenting on reel:', error);
        if (error.response?.status === 401) {
          promptLogin('comment on this reel');
        } else {
          alert('Failed to add comment. Please try again.');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    submitComment();
  }, [_id, currentUser, reel, onUpdateReel, comments]);

  // Handle double tap to like
  const handleDoubleClick = useCallback((e) => {
    e.preventDefault();
    if (currentUser && !isUserLiked) {
      handleLike(e);
    } else if (!currentUser) {
      promptLogin('like this reel');
    }
  }, [isUserLiked, currentUser, handleLike]);

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
      className="h-[90vh] md:h-screen w-full snap-start flex justify-center items-center bg-black relative"
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
          src={videoUrl}
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
            disabled={isProcessing}
            className={`bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label={isUserLiked ? 'Unlike video' : 'Like video'}
          >
            <svg 
              className={`w-6 h-6 ${isUserLiked ? 'text-red-500 fill-current' : 'text-white'}`} 
              fill={isUserLiked ? 'currentColor' : 'none'} 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">{formatCount(currentLikes)}</span>
        </div>

        {/* Comment Button */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleComment}
            disabled={isProcessing}
            className={`bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-70 transition-all transform hover:scale-110 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Add comment"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          <span className="text-white text-xs mt-1 font-medium">{formatCount(comments.length)}</span>
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
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 overflow-hidden">
            {reelOwner?.profileImage ? (
              <img 
                src={reelOwner.profileImage} 
                alt={reelOwner.fullName} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <span 
              className={`text-white text-sm font-bold ${reelOwner?.profileImage ? 'hidden' : 'flex'} items-center justify-center w-full h-full`}
            >
              {(reelOwner?.fullName || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white font-semibold">
            {reelOwner?.fullName || 'Unknown User'}
          </span>
        </div>
        <p className="text-white text-sm leading-relaxed">{caption || 'No description available'}</p>
      </div>
    </div>
  );
});

Reel.displayName = 'Reel';

const Reels = () => {
  const [reels, setReels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const [originalReels, setOriginalReels] = useState([]); // Store original reels for cycling
  const [hasLoadedAllReels, setHasLoadedAllReels] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  
  const { ref: loadMoreRef, inView: loadMoreInView } = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  // Memoize the current active reel for better performance
  const activeReelIndex = useMemo(() => {
    return Math.floor(reels.length / 2);
  }, [reels.length]);

  // Function to update a specific reel
  const updateReel = useCallback((reelId, updatedReel) => {
    setReels(prevReels => 
      prevReels.map(reel => 
        reel._id === reelId ? updatedReel : reel
      )
    );
    // Also update original reels if it exists there
    setOriginalReels(prevReels => 
      prevReels.map(reel => 
        reel._id === reelId ? updatedReel : reel
      )
    );
  }, []);

  // Generate unique IDs for cycled reels to avoid React key conflicts
  const generateCycledReels = useCallback((reels, cycleNumber) => {
    return shuffleArray(reels).map((reel, index) => ({
      ...reel,
      _id: `${reel._id}_cycle_${cycleNumber}_${index}`, // Unique ID for React keys
      originalId: reel._id, // Keep original ID for API calls
    }));
  }, []);

  // Load reels from API (no authentication required for viewing)
  const loadReels = useCallback(async (pageNum = 1, isInitial = false) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.fetchReels(pageNum, 5);
      const newReels = response.reels || response.data || response || [];
      
      if (isInitial) {
        setReels(newReels);
        setOriginalReels(newReels);
      } else {
        // Check if we got new reels from the server
        if (newReels.length > 0) {
          setReels(prev => [...prev, ...newReels]);
          setOriginalReels(prev => [...prev, ...newReels]);
        } else {
          // No new reels from server, start cycling through existing ones
          setHasLoadedAllReels(true);
        }
      }
      
    } catch (error) {
      console.error('Error fetching reels:', error);
      
      // If it's the first load and fails, show error
      if (isInitial) {
        setError('Failed to load reels. Please try again.');
      } else {
        // For subsequent loads, just start cycling if we have existing reels
        if (originalReels.length > 0) {
          setHasLoadedAllReels(true);
        } else {
          setError('Failed to load more reels.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, originalReels.length]);

  // Load more content (either new reels or cycled reels)
  const loadMoreContent = useCallback(() => {
    if (isLoading) return;

    if (!hasLoadedAllReels) {
      // Try to load more reels from the server
      const nextPage = page + 1;
      setPage(nextPage);
      loadReels(nextPage);
    } else if (originalReels.length > 0) {
      // Cycle through existing reels with shuffle
      const nextCycle = cycleCount + 1;
      setCycleCount(nextCycle);
      
      setIsLoading(true);
      
      // Simulate loading delay for better UX
      setTimeout(() => {
        const cycledReels = generateCycledReels(originalReels, nextCycle);
        setReels(prev => [...prev, ...cycledReels]);
        setIsLoading(false);
      }, 500);
    }
  }, [isLoading, hasLoadedAllReels, page, originalReels, cycleCount, loadReels, generateCycledReels]);

  // Initial load
  useEffect(() => {
    loadReels(1, true);
  }, []);

  // Load more content when sentinel is in view
  useEffect(() => {
    if (loadMoreInView && !isLoading && reels.length > 0) {
      loadMoreContent();
    }
  }, [loadMoreInView, isLoading, reels.length, loadMoreContent]);

  // Cleanup videos when component unmounts
  useEffect(() => {
    return () => {
      document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.src = '';
      });
    };
  }, []);

  if (error && reels.length === 0) {
    return (
      <div className="h-screen w-full flex justify-center items-center bg-black text-white">
        <div className="text-center">
          <div className="text-2xl mb-2">❌</div>
          <p>{error}</p>
          <button 
            onClick={() => loadReels(1, true)}
            className="mt-4 px-4 py-2 bg-white text-black rounded-md hover:bg-gray-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[89vh] md:h-screen bg-white w-full md:w-[690px] overflow-y-scroll snap-y snap-mandatory scrollbar-hide">
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
          key={reel._id} 
          reel={{...reel, _id: reel.originalId || reel._id}} // Use original ID for API calls
          isActive={index === activeReelIndex}
          onUpdateReel={updateReel}
        />
      ))}

      {/* Loading indicator - Always show, never show end */}
      <div
        ref={loadMoreRef}
        className="h-screen w-full flex justify-center items-center bg-black text-white"
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
            <p>
              {hasLoadedAllReels 
                ? 'Loading more awesome content...' 
                : 'Loading more reels...'
              }
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-2xl mb-2">🔄</div>
            <p>Keep scrolling for more!</p>
            {hasLoadedAllReels && (
              <p className="text-xs text-gray-400 mt-1">
                Cycling through {originalReels.length} reels
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reels;
