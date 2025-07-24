import  { Router } from "express";
import { adminGetAllBookings, approveConsultant, approvedConsultants, getAdmin, loginAdmin, logoutAdmin, passupdate, registerAdmin, rejectConsultant, rejectedConsultants, unapprovedConsultants } from "../controllers/Admincontroller.js";
import { verifyAdmin } from "../middlewares/AdminAuthMiddleware.js";
const AdminRouter = Router();


AdminRouter.route("/registeradminsecuredonly").post(registerAdmin);
AdminRouter.route("/loginadminsecuredonly").post(loginAdmin);
AdminRouter.route("/logoutadmin").post( verifyAdmin  , logoutAdmin);
AdminRouter.route("/seeunapprovedconsultants").get( verifyAdmin  , unapprovedConsultants);
AdminRouter.route("/seeapprovedconsultants").get( verifyAdmin  , approvedConsultants);
AdminRouter.route("/adminapproveconsultant/:consultantId").post( verifyAdmin  , approveConsultant);
AdminRouter.route("/adminrejectconsultant/:consultantId").post( verifyAdmin  , rejectConsultant);
AdminRouter.route("/getallbookingsAdmin").get(verifyAdmin, adminGetAllBookings);
AdminRouter.route("/getAdmin").get(getAdmin);
AdminRouter.route("/passupdate").post(passupdate);

AdminRouter.post('/rejectedConsultants' , rejectedConsultants)




export default AdminRouter;