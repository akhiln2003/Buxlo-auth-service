import { Request, Response } from "express";
import { IblockAndUnblockUseCase } from "../../../application/interfaces/IblockAndUnblockUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";

export class BlockAndUnblockController {
  constructor(private blockAndUnblockUseCase: IblockAndUnblockUseCase) {}

  action = async (req: Request, res: Response) => {
    try {
      const { id, isBlocked } = req.body;
      const data = this.blockAndUnblockUseCase.execute(id, isBlocked);
      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Sonthing when wrong please try again laiter" });
    }
  };
}
