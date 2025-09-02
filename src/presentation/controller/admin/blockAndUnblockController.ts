import { NextFunction, Request, Response } from "express";
import { IBlockAndUnblockUseCase } from "../../../application/interfaces/IBlockAndUnblockUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class BlockAndUnblockController {
  constructor(private _blockAndUnblockUseCase: IBlockAndUnblockUseCase) {}

  action = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id, isBlocked } = req.body;
      const data = await this._blockAndUnblockUseCase.execute(id, isBlocked);

      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
