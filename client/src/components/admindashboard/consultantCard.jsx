

import { useState } from 'react';

const ConsultantCard = ({ consultant, onApprove, onReject, loading }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {consultant.name}
            </h3>
            
            <div className="space-y-1 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                {consultant.email}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {consultant.phoneNumber}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                {consultant.experience} years experience
              </span>
              <span className="text-gray-500">
                Applied {new Date(consultant.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 ml-6">
            <button
              onClick={() => onApprove(consultant._id)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Approve
            </button>
            <button
              onClick={() => onReject(consultant._id)}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      {/* Toggle details button */}
      <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex items-center justify-center w-full text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200"
        >
          <span className="mr-2">{showDetails ? "Hide Details" : "View Details"}</span>
          <svg 
            className={`w-4 h-4 transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Expandable details */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        showDetails ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Basic Information
              </h4>
              <div className="space-y-3">
                <DetailItem label="Address" value={consultant.address} />
                <DetailItem 
                  label="Resume" 
                  value={<a href={consultant.resume} target="_blank" className="text-blue-600 hover:text-blue-800 underline font-medium">View Resume</a>} 
                />
                <DetailItem label="Primary Category" value={consultant.primaryCategory} />
                <DetailItem label="Hourly Rate" value={`₹${consultant.hourlyRate}`} />
              </div>
            </div>

            {/* Professional Details */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Professional Details
              </h4>
              <div className="space-y-3">
                <DetailItem label="Specialized Services" value={consultant.specializedServices?.join(', ')} />
                <DetailItem label="Key Skills" value={consultant.keySkills?.join(', ')} />
                <DetailItem label="Languages" value={consultant.languageProficiency?.join(', ')} />
                <DetailItem
  label="Weekly Availability"
  value={
    consultant.weeklyAvailability?.map(({ day, isActive, timeSlots }) => {
      if (!isActive || !timeSlots?.length) return `${day}: Not available`;

      const slots = timeSlots
        .map(({ start, end }) => `${start} - ${end}`)
        .join(', ');

      return `${day}: ${slots}`;
    }).join(' | ') || 'Not available'
  }
/>

                {/* <DetailItem label="Weekly Availability" value={consultant.weeklyAvailability?.join(', ')} /> */}
                {/* <DetailItem label="Availability/Week" value={consultant.availabilityPerWeek} /> */}
                {/* <DetailItem label="Preferred Hours" value={consultant.preferredWorkingHours} />
                <DetailItem label="Lead Time" value={consultant.bookingLeadTime} /> */}
              </div>
            </div>

            {/* Status & Settings */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Status & Settings
              </h4>
              <div className="space-y-3">
                <StatusItem label="Accepted Terms" status={consultant.acceptedTerms} />
                <StatusItem label="Visible on Platform" status={consultant.visibleOnPlatform} />
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                Documents
              </h4>
              <div className="space-y-2">
                <DocumentLink href={consultant.documents?.aadhaarCard} label="Aadhaar Card" />
                {consultant.documents?.panCard && <DocumentLink href={consultant.documents.panCard} label="PAN Card" />}
                {consultant.documents?.passport && <DocumentLink href={consultant.documents.passport} label="Passport" />}
              </div>
            </div>

            {/* Certificates */}
            {consultant.certificates?.length > 0 && (
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Certificates
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {consultant.certificates.map((cert, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <a href={cert.fileUrl} target="_blank" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                        {cert.name}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {consultant.education?.length > 0 && (
              <div className="lg:col-span-2 space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 pb-2 border-b border-gray-200">
                  Education
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {consultant.education.map((edu, idx) => (
                    <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="space-y-1">
                        <p className="font-semibold text-gray-900">{edu.qualification}</p>
                        <p className="text-gray-700">{edu.fieldOfStudy}</p>
                        <p className="text-gray-600 text-sm">{edu.university}</p>
                        <p className="text-gray-500 text-sm">Graduated {edu.graduationYear}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const DetailItem = ({ label, value }) => (
  <div className="flex flex-col space-y-1">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <div className="text-sm text-gray-900">{value || 'Not specified'}</div>
  </div>
);

const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      status 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {status ? 'Yes' : 'No'}
    </span>
  </div>
);

const DocumentLink = ({ href, label }) => (
  <div className="flex items-center space-x-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <a href={href} target="_blank" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
      {label}
    </a>
  </div>
);

export default ConsultantCard;