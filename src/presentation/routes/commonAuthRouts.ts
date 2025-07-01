import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { validateReqBody } from "@buxlo/common";
import { changePasswordDto } from "../../zodSchemaDto/user/changePasswordDto";
import { ChangePasswordController } from "../controller/common/changePasswordController";

export class CommonRouter {
  private router: Router;
  private diContainer: DIContainer;

  // Controllers
  private changePasswordController!: ChangePasswordController;

  constructor() {
    this.router = Router();
    this.diContainer = new DIContainer();
    this.initializeControllers();
    this.initializeRoutes();
  }

  private initializeControllers(): void {
    this.changePasswordController = new ChangePasswordController(
      this.diContainer.changePasswordUseCase()
    );
  }

  private initializeRoutes(): void {
    this.router.patch(
      "/changepassword",
      validateReqBody(changePasswordDto),
      this.changePasswordController.change
    );
  }

  public getRouter(): Router {
    return this.router;
  }
}
