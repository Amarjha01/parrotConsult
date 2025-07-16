import React, { useState } from 'react'
import { CalendarDays, Clock3, Video, User, ChevronRight, Play, CheckCircle, Zap } from 'lucide-react'

const Sessions = ({ sessions = [] }) => {
  const [hoveredSession, setHoveredSession] = useState(null)

  // Sample data for demonstration
  const sampleSessions = sessions.length > 0 ? sessions : [
    {
      _id: '1',
      consultantName: 'Dr. Sarah Chen',
      date: 'Today, Dec 15',
      time: '2:00 PM - 3:00 PM',
      status: 'upcoming',
      meetingLink: '#',
      specialty: 'Business Strategy',
      avatar: 'SC'
    },
    {
      _id: '2',
      consultantName: 'Michael Rodriguez',
      date: 'Tomorrow, Dec 16',
      time: '10:00 AM - 11:00 AM',
      status: 'upcoming',
      meetingLink: '#',
      specialty: 'Tech Consulting',
      avatar: 'MR'
    },
    {
      _id: '3',
      consultantName: 'Emma Thompson',
      date: 'Dec 13, 2024',
      time: '3:30 PM - 4:30 PM',
      status: 'completed',
      meetingLink: '#',
      specialty: 'Marketing',
      avatar: 'ET'
    }
  ]

  const getStatusConfig = (status) => {
    switch (status) {
      case 'upcoming':
        return {
          bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
          text: 'text-white',
          icon: <Zap size={14} />,
          glow: 'shadow-emerald-500/25'
        }
      case 'completed':
        return {
          bg: 'bg-gradient-to-r from-slate-600 to-slate-700',
          text: 'text-white',
          icon: <CheckCircle size={14} />,
          glow: 'shadow-slate-500/25'
        }
      default:
        return {
          bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
          text: 'text-white',
          icon: <Clock3 size={14} />,
          glow: 'shadow-amber-500/25'
        }
    }
  }

  const getAvatarColors = (name) => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500'
    ]
    const index = name.length % colors.length
    return colors[index]
  }

  return (
    <div className="w-full px-6 py-8 bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
            <Video className="text-white" size={18} />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
            My Sessions
          </h2>
        </div>
        <p className="text-slate-600 ml-11">Manage your upcoming and completed consultations</p>
      </div>

      {sampleSessions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-500 text-lg">No sessions booked yet</p>
          <p className="text-slate-400 text-sm mt-1">Your upcoming sessions will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sampleSessions.map((session) => {
            const statusConfig = getStatusConfig(session.status)
            const isHovered = hoveredSession === session._id
            
            return (
              <div
                key={session._id}
                className={`group relative bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-1 ${
                  isHovered ? 'ring-2 ring-emerald-500/20' : ''
                }`}
                onMouseEnter={() => setHoveredSession(session._id)}
                onMouseLeave={() => setHoveredSession(null)}
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-slate-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} shadow-lg ${statusConfig.glow}`}>
                      {statusConfig.icon}
                      <span className="capitalize">{session.status}</span>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${statusConfig.bg} animate-pulse`} />
                  </div>

                  {/* Consultant Info */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getAvatarColors(session.consultantName)} rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg`}>
                      {session.avatar || session.consultantName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-800 text-lg group-hover:text-emerald-700 transition-colors">
                        {session.consultantName}
                      </h3>
                      <p className="text-slate-500 text-sm">{session.specialty || 'Consultant'}</p>
                    </div>
                  </div>

                  {/* Session Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg flex items-center justify-center">
                        <CalendarDays size={16} className="text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">{session.date}</span>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-600">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                        <Clock3 size={16} className="text-purple-600" />
                      </div>
                      <span className="text-sm font-medium">{session.time}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <a
                    href={session.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/btn inline-flex items-center gap-3 w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/25"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center group-hover/btn:bg-white/30 transition-colors">
                      {session.status === 'upcoming' ? (
                        <Play size={16} className="ml-0.5" />
                      ) : (
                        <Video size={16} />
                      )}
                    </div>
                    <span className="flex-1 text-left">
                      {session.status === 'upcoming' ? 'Join Meeting' : 'View Recording'}
                    </span>
                    <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </a>
                </div>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 animate-pulse" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Sessions