import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { validateReq } from "@buxlo/common";
import { signInDto } from "../../zodSchemaDto/user/signInDto";
import { SignInController } from "../controller/admin/signInController";
import { ListUserController } from "../controller/admin/listUserController";
import { singOutController } from "../controller/common/singOutController";
import { FetchUserController } from "../controller/admin/fetchUserController";
import { blockAndUnblockDto } from "../../zodSchemaDto/user/blockAndUnblockDto";
import { BlockAndUnblockController } from "../controller/admin/blockAndUnblockController";
import { FetchMentorController } from "../controller/admin/fetchmentorsController";
// import { fetchUserDto } from "../../zodSchemaDto/user/fetchUserDto";




const router = Router();
const diContainer = new DIContainer();

router.use((req,res,next)=> {
    console.log("admin",req.url , ' ' , req.method );
    next();
    
});

// Inject dependencies into the Controller

const signInController = new SignInController(
    diContainer.signInUserUseCase(),
    diContainer.setTokensUseCase()
);

const listusrUserController = new ListUserController(
    diContainer.listUserUseCase()
);

const signOutController = new singOutController();

const fetchUsersController = new FetchUserController(
    diContainer.fetchUsersUseCase()
);



const fetchmentorsController = new FetchMentorController(
    diContainer.fetchUsersUseCase()
);


const blockAndUnblockController = new BlockAndUnblockController(
    diContainer.blockAndUnBlockUseCase()
);


//////////////////////////////////////////


router.post('/signin', validateReq(signInDto), signInController.signIn);
router.get('/userlist', listusrUserController.listUser );
router.post('/signout' , signOutController.singOut );
router.get('/fetchusers' ,  fetchUsersController.fetchUsers);
router.get('/fetchmentor' , fetchmentorsController.fetchUsers);
router.put('/blockandunblock' ,  validateReq(blockAndUnblockDto) , blockAndUnblockController.action);








export { router as adminRoutes };

