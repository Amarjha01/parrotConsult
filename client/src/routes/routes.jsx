import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../routes/ProtectedRoutes';
import App from '../App';

// Pages & Components

import AdminLoginForm from '../forms/adminRegistrationLogin';
import UserDashboard from '../pages/ClientDashboard';


import Home from '../pages/Home'; 
import ConsultantDetailView from '../components/Home/ConsultantProfile/consultantDetailView.jsx';
import ViewAllConsultants from '../components/Home/ConsultantProfile/ViewAllConsultant.jsx';
import AdminDashboard from '../pages/AdminDashboard';
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
import Inbox from '../pages/Inbox.jsx';
import ChatPageWrapper from '../components/p2pChat/ChatPageWrapper.jsx';
import VideoCall from '../components/VideoCall.jsx';
import ReelsController from '../components/userDashboard/reelsController/reelsController.jsx';

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
      { path: 'ViewAllConsultants', element: <ViewAllConsultants /> },
      
      { path: 'chatbot', element: <ChatBot /> },
      { path: 'chat', element: <ChatPageWrapper /> },
      { path: 'inbox', element: <Inbox /> },
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
          {path:'reelscontroller' , element: (
            <ProtectedRoute allowedRole="consultant">
              <ReelsController />
            </ProtectedRoute>
          )},
         
        ]
      },
       
     
      
      { path: '/joinMeeting/:meetingRoomId', element: <VideoCall /> },
      
      { path: '*', element: <Modern404Page /> },

]);

export default routes;
