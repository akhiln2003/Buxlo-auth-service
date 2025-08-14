import { NextFunction, Request, Response } from "express";
import { IlistUser } from "../../../application/interfaces/IlistUserUsecase";
import { USER_ROLE } from "../../../shared/enums/role";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class ListUserController {
  constructor(private _listUserUseCase: IlistUser) {}

  listUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = this._listUserUseCase.execute(USER_ROLE.USER);
      res.send(HttpStatusCode.OK).json({ data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
