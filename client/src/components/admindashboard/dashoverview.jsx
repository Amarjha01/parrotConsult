import {
  Users,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
} from "lucide-react";
import { useState } from "react";

const formatTimeAgo = (timestamp) => {
  const time = new Date(timestamp);
  const now = new Date();
  const diffMinutes = Math.floor((now - time) / (1000 * 60));

  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60)
    return `${diffMinutes} min${diffMinutes > 1 ? "s" : ""} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
};

const DashboardOverview = ({ consultants, bookings }) => {
  const [showAllActivities, setShowAllActivities] = useState(false);
console.log('dashboard ' , consultants);

  // Combine bookings and consultants into one array
  const combinedActivity = [
    ...bookings.map((b) => ({
      type: "booking",
      time: b.datetime,
      name: b?.user?.name || "Unknown",
      details: `For consultant: ${b?.consultant?.name || "N/A"}`,
    })),
    ...consultants.map((c) => ({
      type: "consultant",
      time: c?.createdAt || new Date().toISOString(),
      name: c?.name || "Unnamed",
      details: `Expertise: ${
        c?.specializedServices?.join(", ") || "Not specified"
      }`,
    })),
  ];

  const rejectedCount = consultants.filter(
    (c) => c.status === "rejected"
  ).length;

  const pendingCount = consultants.filter(
    (c) => c.consultantRequest.status === "pending"
  ).length;

  // Sort activities by latest time
  const sortedActivity = combinedActivity.sort(
    (a, b) => new Date(b.time) - new Date(a.time)
  );

  if (!consultants || !bookings) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-lg text-green-700">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <WarmStatsCard
          title="Pending Applications"
          value={pendingCount}
          icon={Users}
          color="yellow"
          trend="+12%"
          description="New applications"
        />
        <WarmStatsCard
          title="Total Bookings"
          value={bookings?.length || 0}
          icon={CheckCircle}
          color="green"
          trend="+8%"
          description="Total booking requests"
        />
        <WarmStatsCard
          title="Approved This Week"
          value="45"
          icon={TrendingUp}
          color="emerald"
          trend="+15%"
          description="Success rate: 85%"
        />
        <WarmStatsCard
          title="Rejected Consultants"
          value={rejectedCount}
          icon={XCircle}
          color="red"
          trend="-5%"
          description="Quality maintained"
        />
      </div>

      {/* Recent Activity Section */}
      <div className="bg-gradient-to-br from-white via-green-50/30 to-yellow-50/30 rounded-3xl shadow-xl border border-green-200/50 p-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-yellow-100 rounded-2xl flex items-center justify-center border border-green-200 shadow-sm">
              <Activity className="w-6 h-6 text-green-700" />
            </div>
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-700 to-green-800 bg-clip-text text-transparent">
                Recent Activity
              </h3>
              <p className="text-green-600 text-sm">
                Latest consultant reviews
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-green-600">Last updated</p>
            <p className="text-xs text-green-500">2 minutes ago</p>
          </div>
        </div>

        <div className="space-y-4">
          {(showAllActivities
            ? sortedActivity
            : sortedActivity.slice(0, 5)
          ).map((item, index) => (
            <ActivityItem
              key={`activity-${index}`}
              type={item.type}
              action={
                item.type === "booking"
                  ? "New booking by"
                  : "Consultant request"
              }
              name={item.name}
              time={formatTimeAgo(item.time)}
              details={item.details}
            />
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowAllActivities((prev) => !prev)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-100 to-yellow-100 hover:from-green-200 hover:to-yellow-200 text-green-700 font-medium rounded-full transition-all duration-300 border border-green-200 hover:border-green-300 hover:shadow-md"
          >
            <span>{showAllActivities ? "Show Less" : "View All Activity"}</span>
            <svg
              className={`w-4 h-4 ml-2 transform transition-transform duration-300 ${
                showAllActivities ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <QuickActionCard
          title="Review Pending"
          description="You have consultants waiting for review"
          count={consultants?.length || 0}
          action="Review Now"
          icon="👥"
          gradient="from-green-100 to-yellow-100"
          textColor="text-green-700"
          borderColor="border-green-200"
        />
        <QuickActionCard
          title="Generate Report"
          description="Weekly consultant approval summary"
          count="Ready"
          action="Generate"
          icon="📊"
          gradient="from-yellow-100 to-green-100"
          textColor="text-green-700"
          borderColor="border-yellow-200"
        />
      </div>
    </div>
  );
};

// Warm Stats Card
const WarmStatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  trend,
  description,
}) => {
  const colorClasses = {
    yellow: {
      bg: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
      iconBg: "from-yellow-100 to-yellow-200",
      iconColor: "text-yellow-700",
      textColor: "text-yellow-800",
      valueColor: "text-yellow-900",
      shadowColor: "hover:shadow-yellow-100",
    },
    green: {
      bg: "from-green-50 to-green-100",
      border: "border-green-200",
      iconBg: "from-green-100 to-green-200",
      iconColor: "text-green-700",
      textColor: "text-green-800",
      valueColor: "text-green-900",
      shadowColor: "hover:shadow-green-100",
    },
    emerald: {
      bg: "from-emerald-50 to-emerald-100",
      border: "border-emerald-200",
      iconBg: "from-emerald-100 to-emerald-200",
      iconColor: "text-emerald-700",
      textColor: "text-emerald-800",
      valueColor: "text-emerald-900",
      shadowColor: "hover:shadow-emerald-100",
    },
    red: {
      bg: "from-red-50 to-red-100",
      border: "border-red-200",
      iconBg: "from-red-100 to-red-200",
      iconColor: "text-red-700",
      textColor: "text-red-800",
      valueColor: "text-red-900",
      shadowColor: "hover:shadow-red-100",
    },
  };

  const colors = colorClasses[color];

  return (
    <div
      className={`group relative bg-gradient-to-br ${colors.bg} rounded-2xl p-6 border ${colors.border} hover:shadow-xl ${colors.shadowColor} transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${colors.iconBg} rounded-xl flex items-center justify-center mb-4 border ${colors.border} group-hover:scale-110 transition-transform duration-300 shadow-sm`}
          >
            <Icon className={`w-6 h-6 ${colors.iconColor}`} />
          </div>
          <h3 className={`text-sm font-semibold ${colors.textColor} mb-1`}>
            {title}
          </h3>
          <p className={`text-3xl font-bold ${colors.valueColor} mb-2`}>
            {value}
          </p>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium ${colors.textColor}`}>
              {description}
            </span>
            {trend && (
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full shadow-sm ${
                  trend.startsWith("+")
                    ? "bg-green-200 text-green-800 border border-green-300"
                    : "bg-red-200 text-red-800 border border-red-300"
                }`}
              >
                {trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ActivityItem = ({ type = "new", action, name, time, details }) => {
  const typeStyles = {
    approved: {
      emoji: "✅",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      textColor: "text-green-800",
    },
    rejected: {
      emoji: "❌",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-red-200",
      textColor: "text-red-800",
    },
    new: {
      emoji: "📝",
      bgColor: "from-yellow-50 to-yellow-100",
      borderColor: "border-yellow-200",
      textColor: "text-yellow-800",
    },
    booking: {
      emoji: "📅",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
    },
    consultant: {
      emoji: "👤",
      bgColor: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200",
      textColor: "text-indigo-800",
    },
  };

  const style = typeStyles[type] || typeStyles["new"];

  return (
    <div
      className={`flex items-center space-x-4 p-4 rounded-2xl bg-gradient-to-r ${style.bgColor} border ${style.borderColor} hover:shadow-md transition-all duration-200 hover:scale-[1.01]`}
    >
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100">
          <span className="text-lg" role="img" aria-label="activity-icon">
            {style.emoji}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${style.textColor}`}>
            {action}:
          </span>
          <span className={`text-sm font-bold ${style.textColor}`}>{name}</span>
        </div>
        {details && (
          <p className={`text-xs ${style.textColor} opacity-75 mt-1`}>
            {details}
          </p>
        )}
      </div>
      <div className="flex-shrink-0">
        <span className="text-xs text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm font-medium whitespace-nowrap">
          {time}
        </span>
      </div>
    </div>
  );
};

const QuickActionCard = ({
  title,
  description,
  count,
  action,
  icon,
  gradient,
  textColor,
  borderColor,
}) => {
  return (
    <div
      className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 border ${borderColor} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] shadow-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl filter drop-shadow-sm">{icon}</div>
        <div
          className={`text-2xl font-bold ${textColor} bg-white px-3 py-1 rounded-xl shadow-sm border border-white/50`}
        >
          {count}
        </div>
      </div>
      <h4 className={`text-lg font-bold ${textColor} mb-2`}>{title}</h4>
      <p className={`text-sm ${textColor} opacity-80 mb-4 font-medium`}>
        {description}
      </p>
      <button
        className={`w-full py-3 px-4 bg-white ${textColor} font-semibold rounded-xl hover:shadow-lg transition-all duration-200 border border-white/50 hover:border-white/80 hover:scale-[1.02]`}
      >
        {action}
      </button>
    </div>
  );
};

export default DashboardOverview;
