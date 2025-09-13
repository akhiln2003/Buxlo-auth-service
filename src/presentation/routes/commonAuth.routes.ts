import { Router } from "express";
import { DIContainer } from "../../infrastructure/di/DIContainer";
import { validateReqBody } from "@buxlo/common";
import { ChangePasswordController } from "../controller/common/changePassword.controller";
import { changePasswordDto } from "../dto/changePassword.dto";

export class CommonRouter {
  private _router: Router;
  private _diContainer: DIContainer;

  // Controllers
  private _changePasswordController!: ChangePasswordController;

  constructor() {
    this._router = Router();
    this._diContainer = new DIContainer();
    this._initializeControllers();
    this._initializeRoutes();
  }

  private _initializeControllers(): void {
    this._changePasswordController = new ChangePasswordController(
      this._diContainer.changePasswordUseCase()
    );
  }

  private _initializeRoutes(): void {
    this._router.patch(
      "/changepassword",
      validateReqBody(changePasswordDto),
      this._changePasswordController.change
    );
  }

  public getRouter(): Router {
    return this._router;
  }
}
