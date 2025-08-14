import React, { useState, useEffect } from "react";
import axios from "axios";

const ReelsController = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [description, setDescription] = useState("");
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const API_URL = `${import.meta.env.VITE_API_BASE_URL}/reel`;

  // Fetch user's reels
  const fetchMyReels = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming JWT token
      const { data } = await axios.get(`${API_URL}/my-reels`, {
        withCredentials: true
      });
      console.log('reels', data);
      
      setReels(data.data || []);
    } catch (error) {
      console.error("Error fetching reels:", error);
    }
  };

  // Upload reel
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!videoFile) {
      alert("Please select a video to upload.");
      return;
    }
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("video", videoFile);
      formData.append("description", description);

      await axios.post(`${API_URL}/upload`, formData, {
        withCredentials: true,
        "Content-Type": "multipart/form-data",
      });

      alert("Reel uploaded successfully!");
      setVideoFile(null);
      setDescription("");
      fetchMyReels(); // Refresh list
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload reel.");
    } finally {
      setLoading(false);
    }
  };

  // Delete reel
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this reel?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Reel deleted successfully!");
      fetchMyReels();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Failed to delete reel.");
    }
  };

  // Handle drag and drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0] && files[0].type.includes("video")) {
      setVideoFile(files[0]);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchMyReels();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Manage Your Reels
          </h1>
          <p className="text-slate-600">Create, upload, and manage your video content</p>
        </div>

        {/* Upload Form */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-purple-100/20 p-8 mb-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-100/30 to-purple-100/30 rounded-full -translate-y-16 translate-x-16"></div>
          
          <form onSubmit={handleUpload} className="relative space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-800">Upload New Reel</h2>
            </div>

            {/* File Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                dragActive 
                  ? 'border-pink-400 bg-pink-50/50' 
                  : 'border-slate-300 hover:border-pink-300 hover:bg-pink-50/20'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="text-center">
                {videoFile ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{videoFile.name}</p>
                      <p className="text-sm text-slate-500">{formatFileSize(videoFile.size)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoFile(null)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Remove file
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-purple-100 rounded-2xl flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-800 mb-2">Drop your video here</p>
                      <p className="text-slate-500 mb-4">or click to browse files</p>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        className="hidden"
                        id="video-upload"
                      />
                      <label
                        htmlFor="video-upload"
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-xl cursor-pointer hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Choose Video File
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700">Description</label>
              <textarea
                placeholder="Add a captivating description for your reel..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-300 bg-white/50 backdrop-blur-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !videoFile}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                loading || !videoFile
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Uploading...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <span>Upload Reel</span>
                </div>
              )}
            </button>
          </form>
        </div>

        {/* My Reels Section */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl shadow-xl shadow-indigo-100/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 border-b border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-slate-800">My Uploaded Reels</h2>
                <p className="text-slate-600">{reels.length} reel{reels.length !== 1 ? 's' : ''} uploaded</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {reels.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-slate-100 to-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">No reels uploaded yet</h3>
                <p className="text-slate-500">Upload your first reel to get started and share your creativity!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {reels.map((reel, index) => (
                  <div
                    key={reel._id}
                    className="group bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:shadow-purple-100/50 transition-all duration-300 transform hover:-translate-y-1"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Video */}
                    <div className="relative aspect-video bg-slate-100">
                      <video
                        src={reel.URL}
                        controls
                        className="w-full h-full object-cover rounded-t-2xl"
                        poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTggNUwxNiA5TDggMTNWNVoiIGZpbGw9IiM5Q0E3QkIiLz4KPHN2Zz4K"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-lg">
                          Reel
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-4">
                      {/* Description */}
                      <div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {reel.description || (
                            <span className="italic text-slate-400">No description provided</span>
                          )}
                        </p>
                      </div>

                      {/* Meta info */}
                      {reel.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>Uploaded {formatDate(reel.createdAt)}</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex justify-between items-center pt-2 border-t border-slate-200/50">
                        <div className="flex items-center gap-2 text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-xs">0 views</span>
                        </div>
                        
                        <button
                          onClick={() => handleDelete(reel._id)}
                          className="group/btn flex items-center gap-2 px-4 py-2 text-red-600 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          <span className="text-sm font-medium">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReelsController;