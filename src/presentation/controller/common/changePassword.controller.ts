import { NextFunction, Request, Response } from "express";
import { IChangePasswordUseCase } from "../../../application/interfaces/IChangePasswordUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class ChangePasswordController {
  constructor(private _changePasswordUseCase: IChangePasswordUseCase) {}
  change = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      const result = await this._changePasswordUseCase.execute(
        userId,
        currentPassword,
        newPassword
      );
      res.status(HttpStatusCode.OK).json({ result });
    } catch (error) {
      next(error);
    }
  };
}
