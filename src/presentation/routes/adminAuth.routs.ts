import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { SignInController } from "../controller/admin/signIn.controller";
import { ListUserController } from "../controller/admin/listUser.controller";
import { singOutController } from "../controller/common/singOut.controller";
import { FetchUserController } from "../controller/admin/fetchUser.controller";
import { BlockAndUnblockController } from "../controller/admin/blockAndUnblock.controller";
import { FetchMentorController } from "../controller/admin/fetchmentors.controller";
import { validateReqBody, validateReqQueryParams } from "@buxlo/common";
import { signInDto } from "../../domain/zodSchemaDto/input/user/signIn.dto";
import { fetchUsersAndMentorDto } from "../../domain/zodSchemaDto/input/user/fetchUsersAndMentor.dto";
import { blockAndUnblockDto } from "../../domain/zodSchemaDto/input/user/blockAndUnblock.dto";

export class AdminRouter {
  private _router: Router;
  private _diContainer: DIContainer;

  // Controllers
  private _signInController!: SignInController;
  private _listUserController!: ListUserController;
  private _signOutController!: singOutController;
  private _fetchUsersController!: FetchUserController;
  private _fetchMentorsController!: FetchMentorController;
  private _blockAndUnblockController!: BlockAndUnblockController;

  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._signInController = new SignInController(
      this._diContainer.signInUserUseCase(),
      this._diContainer.setTokensUseCase()
    );

    this._listUserController = new ListUserController(
      this._diContainer.listUserUseCase()
    );

    this._signOutController = new singOutController();

    this._fetchUsersController = new FetchUserController(
      this._diContainer.fetchUsersUseCase()
    );

    this._fetchMentorsController = new FetchMentorController(
      this._diContainer.fetchUsersUseCase()
    );

    this._blockAndUnblockController = new BlockAndUnblockController(
      this._diContainer.blockAndUnBlockUseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.post(
      "/signin",
      validateReqBody(signInDto),
      this._signInController.signIn
    );
    this._router.get("/profile/userlist", this._listUserController.listUser);
    this._router.post("/signout", this._signOutController.singOut);
    this._router.get(
      "/profile/fetchusers",
      validateReqQueryParams(fetchUsersAndMentorDto),
      this._fetchUsersController.fetchUsers
    );
    this._router.get(
      "/profile/fetchmentor",
      validateReqQueryParams(fetchUsersAndMentorDto),
      this._fetchMentorsController.fetchMentors
    );
    this._router.put(
      "/profile/blockandunblock",
      validateReqBody(blockAndUnblockDto),
      this._blockAndUnblockController.action
    );
  }

  public getRouter(): Router {
    return this._router;
  }
}
