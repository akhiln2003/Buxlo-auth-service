import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { NextFunction, Request, Response } from "express";

export class singOutController {
  singOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie("userAccessToken");
      res.clearCookie("userRefreshToken");
      res.status(HttpStatusCode.OK).json({ message: "LogOut successfully" });
    } catch (error) {
      console.error(error);
      next(error);
    }
  };
}
