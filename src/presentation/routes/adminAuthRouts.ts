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
import { validateReqBody, validateReqQueryParams } from "@buxlo/common";
import { fetchUsersAndMentorDto } from "../../zodSchemaDto/user/fetchUsersAndMentorDto";

export class AdminRouter {
  private router: Router;
  private diContainer: DIContainer;

  // Controllers
  private signInController!: SignInController;
  private listUserController!: ListUserController;
  private signOutController!: singOutController;
  private fetchUsersController!: FetchUserController;
  private fetchMentorsController!: FetchMentorController;
  private blockAndUnblockController!: BlockAndUnblockController;

  constructor() {
    this.router = Router();
    this.diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();
  }

  private initializeControllers(): void {
    this.signInController = new SignInController(
      this.diContainer.signInUserUseCase(),
      this.diContainer.setTokensUseCase()
    );

    this.listUserController = new ListUserController(
      this.diContainer.listUserUseCase()
    );

    this.signOutController = new singOutController();

    this.fetchUsersController = new FetchUserController(
      this.diContainer.fetchUsersUseCase()
    );

    this.fetchMentorsController = new FetchMentorController(
      this.diContainer.fetchUsersUseCase()
    );

    this.blockAndUnblockController = new BlockAndUnblockController(
      this.diContainer.blockAndUnBlockUseCase()
    );
  }

  private initializeRoutes(): void {
    this.router.post(
      "/signin",
      validateReqBody(signInDto),
      this.signInController.signIn
    );
    this.router.get("/profile/userlist", this.listUserController.listUser);
    this.router.post("/signout", this.signOutController.singOut);
    this.router.get(
      "/profile/fetchusers",
      validateReqQueryParams(fetchUsersAndMentorDto),
      this.fetchUsersController.fetchUsers
    );
    this.router.get(
      "/profile/fetchmentor",
      validateReqQueryParams(fetchUsersAndMentorDto),
      this.fetchMentorsController.fetchMentors
    );
    this.router.put(
      "/profile/blockandunblock",
      validateReqBody(blockAndUnblockDto),
      this.blockAndUnblockController.action
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
