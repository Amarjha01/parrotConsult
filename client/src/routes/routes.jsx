import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoutes';
import App from '../App';

// Pages & Components

import AdminLoginForm from '../forms/adminRegistrationLogin';
import UserDashboard from '../pages/ClientDashboard';


import Home from '../pages/Home'; 
import ConsultantDetailView from '../components/ConsultantProfile/consultantDetailView';
import ConsultantProfile from '../pages/ConsultantProfile';
import ViewAllConsultants from '../components/ConsultantProfile/ViewAllConsultant';
import AdminDashboard from '../pages/AdminDashboard';
import ConsultantDashboard from '../pages/ConsultantDashboard';
import MeetingRoom from '../pages/MeetingRoom.jsx';
// import MeetingRoom from '../videoroom/meeting';
import ConsultantSignupForm from '../forms/ConsultantSignupForm';
import AuthModal from '../forms/AuthModal';
import ChatBot from '../pages/ChatBot.jsx';
import ConsultantQuiz from '../forms/recomendform';
import NewSignIn from '../forms/NewSignIn';
import NewSignUp from '../forms/NewSignUp';
import Profile from '../components/userDashboard/Profile';
import Sessions from '../components/userDashboard/Sessions';
import Dashboard from '../components/userDashboard/Dashboard';
import ConsultantForm from '../components/userDashboard/ConsultantForm';
import Modern404Page from '../components/global/Modern404Page';
import Reels from '../pages/Reels';
import Wallet from '../components/userDashboard/Wallet.jsx';
import BookedSession from '../components/userDashboard/BookedSession.jsx';

 const storedUser = localStorage.getItem("user");
  const userData = JSON.parse(storedUser)
const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />, // This contains <Asside />, <Outlet />, and <Footer />
    children: [
      { path: '', element: <Home /> },
      { path: '/reels', element: <Reels /> },

      { path: 'adminsecuredlogin', element: <AdminLoginForm /> },
      { path: 'consultantprofile/:id/:name', element: <ConsultantDetailView /> },
      { path: 'consultant/profile', element: <ConsultantProfile /> },
      { path: 'ViewAllConsultants', element: <ViewAllConsultants /> },
      { path: 'AuthModal', element: <AuthModal /> },
      { path: 'chatbot', element: <ChatBot /> },
      { path: 'consultant-quiz', element: <ConsultantQuiz /> },
      { path: '/newsignin', element: <NewSignIn /> },
      { path: '/newsignup', element: <NewSignUp /> },
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
        element: <UserDashboard />,
        children:[
          { path: 'dashboard', element: <Dashboard /> },
          {path:'profile' , element: <Profile userData={userData} />},
          
          
          {path:'sessions' , element: <Sessions />},
          {path:'consultantform' , element: <ConsultantForm />},
          {path:'wallet' , element: (
            <ProtectedRoute allowedRole="consultant">
              <Wallet />
            </ProtectedRoute>
          )},
          {path:'Bookedsessions' , element: (
            <ProtectedRoute allowedRole="consultant">
              <BookedSession />
            </ProtectedRoute>
          )},
         
        ]
      },
       {
        path: 'ConsultantDashboard',
        element: (
          <ProtectedRoute allowedRole="consultant">
            <ConsultantDashboard />
          </ProtectedRoute>
        )
      },
      { path: '/meeting/:bookingId', element: <MeetingRoom /> },
      { path: '/ConsultantSignupForm', element: <ConsultantSignupForm /> },
      
      { path: '*', element: <Modern404Page /> },

]);

export default routes;
