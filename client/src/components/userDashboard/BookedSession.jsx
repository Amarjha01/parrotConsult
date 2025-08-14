import React, { useEffect, useState } from 'react';
import { CalendarDays, Clock3, Video, ChevronRight, Play, CheckCircle, Zap } from 'lucide-react';
import { getBookingsByConsultantId } from '../../apis/bookingApi';

const BookedSession = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredSession, setHoveredSession] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await getBookingsByConsultantId();
        setSessions(response || []);
      } catch (error) {
        console.error('Failed to fetch booked sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const getStatusConfig = (status) => {
    switch (status) {
      case 'scheduled':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          text: 'text-white',
          icon: <Zap size={14} />,
          glow: 'shadow-emerald-500/25'
        };
      case 'completed':
        return {
          bg: 'bg-gradient-to-r from-slate-600 to-slate-700',
          text: 'text-white',
          icon: <CheckCircle size={14} />,
          glow: 'shadow-slate-500/25'
        };
      default:
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
          text: 'text-white',
          icon: <Clock3 size={14} />,
          glow: 'shadow-amber-500/25'
        };
    }
  };

  const getAvatarColors = (name = '') => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="w-full px-6 py-8 bg-gradient-to-br from-slate-50 to-white">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Video className="text-white" size={18} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Booked Sessions
          </h2>
        </div>
        <p className="text-slate-600 ml-11">Sessions where others have booked you</p>
      </div>

      {loading ? (
        <p className="text-center text-slate-500">Loading...</p>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-500 text-lg">No sessions booked with you yet</p>
          <p className="text-slate-400 text-sm mt-1">Once users book you, they will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sessions.map((session) => {
            const statusConfig = getStatusConfig(session.status);
            const isHovered = hoveredSession === session._id;
            const userName = session?.user?.fullName || 'Unknown';
            const userInitials = userName.split(' ').map(n => n[0]).join('').toUpperCase();
            const bookingDate = new Date(session.bookingDateTime);

            return (
              <div
                key={session._id}
                className={`group  bg-white rounded-2xl border border-slate-200 overflow-hidden  duration-300 hover:shadow-2xl hover:shadow-slate-200/50  ${
                  isHovered ? 'ring-2 ring-emerald-500/20' : ''
                }`}
                onMouseEnter={() => setHoveredSession(session._id)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                <div className="absolute  bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-lg ${statusConfig.glow}`}>
                      {statusConfig.icon}
                      <span className="capitalize">{session.status}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${statusConfig.bg} animate-pulse`} />
                  </div>

                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getAvatarColors(userName)} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                    <img src={session.user.profileImage || 'https://i.postimg.cc/bryMmCQB/profile-image.jpg'} alt="" />

                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">
                        {userName}
                      </h3>
                      <p className="text-slate-500 text-sm">Booked You</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <CalendarDays size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">{bookingDate.toLocaleDateString()}</span>
                    </div>

                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Clock3 size={16} className="text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">{bookingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <a
                    href={session.meetingLink && session.status === 'scheduled' ? `/joinMeeting/${session.meetingLink}` : '' || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn cursor-pointer z-30 inline-flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
                      {session.status === 'scheduled' ? <Play size={16} className="ml-0.5" /> : <Video size={16} />}
                    </div>
                    <span className="flex-1 text-left">
                      {session.status === 'scheduled' ? 'Join Meeting' : 'View Recording'}
                    </span>
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>

               
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookedSession;