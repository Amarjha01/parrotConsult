import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  DollarSign,
  FileText,
  Clock,
  AlertTriangle,
  Eye,
  RotateCcw,
  Download
} from 'lucide-react';
import { rejectedConsultants } from '../../apis/adminApi';

const RejectedConsultantCard = ({ consultant, onReactivate, onViewDetails, onDownloadResume }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return `₹${amount?.toLocaleString() || 'N/A'}`;
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" }
    },
    hover: { 
      y: -2,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };

  const expandVariants = {
    collapsed: { height: 0, opacity: 0 },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: { duration: 0.3, ease: "easeInOut" }
    }
  };

  return (
    <>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl border border-red-200 shadow-sm overflow-hidden"
      >
        {/* Header with rejection indicator */}
        <div className="bg-gradient-to-r from-red-50 to-red-100 px-6 py-4 border-b border-red-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  {consultant.profileImage ? (
                    <img 
                      src={consultant.profileImage} 
                      alt={consultant.fullName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{consultant.fullName}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Rejected
                  </span>
                  <span>•</span>
                  <span>{consultant.consultantRequest?.consultantProfile?.category || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowReactivateModal(true)}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm font-medium"
              >
                <RotateCcw className="w-4 h-4 mr-1 inline" />
                Reconsider
              </motion.button>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="w-4 h-4 text-red-500" />
              <span>{consultant.phone}</span>
            </div>
            {consultant.email && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Mail className="w-4 h-4 text-red-500" />
                <span className="truncate">{consultant.email}</span>
              </div>
            )}
            {/* <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>Rejected: {formatDate(consultant.consultantRequest?.reviewedAt)}</span>
            </div> */}
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4 text-red-500" />
              <span>Applied: {formatDate(consultant.consultantRequest?.requestedAt)}</span>
            </div>
          </div>
        </div>

        {/* Expandable Details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={expandVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              className="border-t border-gray-200 bg-gray-50"
            >
              <div className="px-6 py-4 space-y-4">
                {/* Professional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <Briefcase className="w-4 h-4 mr-2 text-red-500" />
                      Professional Info
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 pl-6">
                      <div>
                        <span className="font-medium">Experience:</span> {consultant.consultantRequest?.consultantProfile?.yearsOfExperience || 'N/A'} years
                      </div>
                      <div>
                        <span className="font-medium">Session Fee:</span> {formatCurrency(consultant.consultantRequest?.consultantProfile?.sessionFee)}
                      </div>
                      <div>
                        <span className="font-medium">Availability:</span> {consultant.consultantRequest?.consultantProfile?.daysPerWeek || 'N/A'} days/week
                      </div>
                      {consultant.location && (
                        <div className="flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span>{consultant.location}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-red-500" />
                      Education
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600 pl-6">
                      <div>
                        <span className="font-medium">Qualification:</span> {consultant.consultantRequest?.consultantProfile?.qualification || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Field:</span> {consultant.consultantRequest?.consultantProfile?.fieldOfStudy || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">University:</span> {consultant.consultantRequest?.consultantProfile?.university || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Graduation:</span> {consultant.consultantRequest?.consultantProfile?.graduationYear || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {consultant.consultantRequest?.consultantProfile?.shortBio && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Bio</h4>
                    <p className="text-sm text-gray-600 bg-white p-3 rounded-lg border">
                      {consultant.consultantRequest.consultantProfile.shortBio}
                    </p>
                  </div>
                )}

                {/* Languages */}
                {consultant.consultantRequest?.consultantProfile?.languages?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Languages</h4>
                    <div className="flex flex-wrap gap-2">
                      {consultant.consultantRequest.consultantProfile.languages.map((lang, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  {consultant.consultantRequest?.documents?.resume && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => onDownloadResume(consultant.consultantRequest.documents.resume)}
                      className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-lg transition-colors text-sm"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Resume
                    </motion.button>
                  )}
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onViewDetails(consultant)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Full Details
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Reactivate Modal */}
      <AnimatePresence>
        {showReactivateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowReactivateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RotateCcw className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Reconsider Application
                </h3>
                <p className="text-gray-600">
                  Are you sure you want to move {consultant.fullName}'s application back to pending for review?
                </p>
              </div>
              
              <div className="flex space-x-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowReactivateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onReactivate(consultant._id);
                    setShowReactivateModal(false);
                  }}
                  className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                >
                  Reconsider
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Main component that handles multiple rejected consultants
const RejectedConsultants = () => {

useEffect(()=>{
const getAllRejectedConsultant = async() =>{
  const response = await rejectedConsultants();
  if(response.status === 200){
    setAllRejectedConsultants(response?.data?.data);
  }
}
getAllRejectedConsultant()
},[])

const [allRejectedConsultants , setAllRejectedConsultants] = useState([]);


  const handleReactivate = (consultantId) => {
    console.log('Reactivating consultant:', consultantId);
    // Implement your reactivation logic here
  };

  const handleViewDetails = (consultant) => {
    console.log('Viewing details for:', consultant);
    // Implement your view details logic here
  };

  const handleDownloadResume = (resumeUrl) => {
    console.log('Downloading resume:', resumeUrl);
    // Implement your download logic here
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Rejected Consultants</h2>
          <p className="text-gray-600 mt-1">Manage and review rejected consultant applications</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <AlertTriangle className="w-4 h-4" />
          <span>{allRejectedConsultants.length} rejected applications</span>
        </div>
      </div>

      <div className="space-y-4">
        {allRejectedConsultants.map((consultant) => (
          <RejectedConsultantCard
            key={consultant._id}
            consultant={consultant}
            onReactivate={handleReactivate}
            onViewDetails={handleViewDetails}
            onDownloadResume={handleDownloadResume}
          />
        ))}
      </div>
    </div>
  );
};

export default RejectedConsultants;