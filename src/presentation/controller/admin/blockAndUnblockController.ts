import { NextFunction, Request, Response } from "express";
import { IblockAndUnblockUseCase } from "../../../application/interfaces/IblockAndUnblockUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class BlockAndUnblockController {
  constructor(private blockAndUnblockUseCase: IblockAndUnblockUseCase) {}

  action = async (req: Request, res: Response , next: NextFunction) => {
    try {
      const { id, isBlocked } = req.body;
      const data = await this.blockAndUnblockUseCase.execute(id, isBlocked);
      console.log(data);
      
      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      console.error(error);
     next(error);
    }
  };
}
