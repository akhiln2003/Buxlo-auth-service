import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { SignInController } from "../controller/admin/signInController";
import { ListUserController } from "../controller/admin/listUserController";
import { singOutController } from "../controller/common/singOutController";
import { FetchUserController } from "../controller/admin/fetchUserController";
import { BlockAndUnblockController } from "../controller/admin/blockAndUnblockController";
import { FetchMentorController } from "../controller/admin/fetchmentorsController";
import { validateReqBody, validateReqQueryParams } from "@buxlo/common";
import { signInDto } from "../../domain/zodSchemaDto/input/user/signInDto";
import { fetchUsersAndMentorDto } from "../../domain/zodSchemaDto/input/user/fetchUsersAndMentorDto";
import { blockAndUnblockDto } from "../../domain/zodSchemaDto/input/user/blockAndUnblockDto";

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
