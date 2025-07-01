import { NextFunction, Request, Response } from "express";
import { IchangePasswordUseCase } from "../../../application/interfaces/IchangePasswordUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class ChangePasswordController {
  constructor(private changePasswordUseCase: IchangePasswordUseCase) {}
  change = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId, currentPassword, newPassword } = req.body;
      const result = await this.changePasswordUseCase.execute(
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
