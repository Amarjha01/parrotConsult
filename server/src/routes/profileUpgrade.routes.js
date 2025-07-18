import{Router} from 'express';
import { aadharVerify } from '../controllers/UserController';
const profileUpgradeRoute = Router();


profileUpgradeRoute.post('/aadharVerify' , aadharVerify);
