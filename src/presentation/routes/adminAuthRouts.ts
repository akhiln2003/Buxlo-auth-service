import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { signInDto } from "../../zodSchemaDto/user/signInDto";
import { SignInController } from "../controller/admin/signInController";
import { ListUserController } from "../controller/admin/listUserController";
import { singOutController } from "../controller/common/singOutController";
import { FetchUserController } from "../controller/admin/fetchUserController";
import { blockAndUnblockDto } from "../../zodSchemaDto/user/blockAndUnblockDto";
import { BlockAndUnblockController } from "../controller/admin/blockAndUnblockController";
import { FetchMentorController } from "../controller/admin/fetchmentorsController";
import { validateReqBody } from "@buxlo/common";
// import { fetchUserDto } from "../../zodSchemaDto/user/fetchUserDto";




const router = Router();
const diContainer = new DIContainer();


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


router.post('/signin', validateReqBody(signInDto), signInController.signIn);
router.get('/profile/userlist', listusrUserController.listUser );
router.post('/signout' , signOutController.singOut );
router.get('/profile/fetchusers' ,  fetchUsersController.fetchUsers);
router.get('/profile/fetchmentor' , fetchmentorsController.fetchUsers);
router.put('/profile/blockandunblock' ,  validateReqBody(blockAndUnblockDto) , blockAndUnblockController.action);








export { router as adminRoutes };

