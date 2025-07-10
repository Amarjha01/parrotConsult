import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoutes';
import App from '../App';

// Pages & Components

import AdminLoginForm from '../forms/adminRegistrationLogin';
import UserDashboard from '../pages/ClientDashboard';


import Home from '../pages/Home';
import HowItWorksPage from '../pages/HowitWorks';
import PopularCategoriesPage from '../pages/Categories';
import AboutUsPage from '../pages/AboutUs';
import ConsultantForm from '../components/global/ConsultantForm';
import ConsultantDetailView from '../components/ConsultantProfile/consultantDetailView';
import ConsultantProfile from '../pages/ConsultantProfile';
import ViewAllConsultants from '../components/ConsultantProfile/ViewAllConsultant';
import AdminDashboard from '../pages/AdminDashboard';
import ConsultantDashboard from '../pages/ConsultantDashboard';
import LoginSignupModal from '../forms/loginSignup';
import MeetingRoom from '../videoroom/meeting';
import ConsultantApplicationForm from '../forms/ConsultantApplicationform';
import ConsultantSignupForm from '../forms/ConsultantSignupForm';
import AuthModal from '../forms/AuthModal';
import ChatBot from '../pages/chatbot';
import ConsultantQuiz from '../forms/recomendform';
import ConsultantSignup from '../forms/ConsultantSignup';

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This contains <Navbar />, <Outlet />, and <Footer />
    children: [
      { path: '', element: <Home /> },
      { path: 'adminsecuredlogin', element: <AdminLoginForm /> },
      { path: 'howitworks', element: <HowItWorksPage /> },
      { path: 'categories', element: <PopularCategoriesPage /> },
      { path: 'aboutus', element: <AboutUsPage /> },
      { path: 'consultantform', element: <ConsultantForm /> },
      { path: 'consultantprofile/:id/:name', element: <ConsultantDetailView /> },
      { path: 'consultant/profile', element: <ConsultantProfile /> },
      { path: 'application-form', element: <ConsultantApplicationForm /> },
      { path: 'ViewAllConsultants', element: <ViewAllConsultants /> },
      { path: 'AuthModal', element: <AuthModal /> },
      { path: 'chatbot', element: <ChatBot /> },
      { path: 'consultant-quiz', element: <ConsultantQuiz /> },
    ]
  },
  {
        path: 'admindashboard',
        element: (
          <ProtectedRoute allowedRole="admin">
            <AdminDashboard />
          </ProtectedRoute>
        )
      },

        {
        path: 'userdashboard',
        element: (
          <ProtectedRoute allowedRole="user">
            <UserDashboard />
          </ProtectedRoute>
        )
      },
       {
        path: 'ConsultantDashboard',
        element: (
          <ProtectedRoute allowedRole="consultant">
            <ConsultantDashboard />
          </ProtectedRoute>
        )
      },
      { path: 'login&signup', element: <LoginSignupModal /> },
      { path: '/meeting/:bookingId', element: <MeetingRoom /> },
      { path: '/consultantApplicationForm', element: <ConsultantApplicationForm /> },
      { path: '/ConsultantSignupForm', element: <ConsultantSignupForm /> },
      { path: '/ConsultantSignup', element: <ConsultantSignup /> },

]);

export default routes;
