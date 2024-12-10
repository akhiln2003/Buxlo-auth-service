import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { Request, Response } from "express";

export class singOutController {
  singOut = async (req: Request, res: Response) => {
    try {
      res.clearCookie("userAccessToken");
      res.clearCookie("userRefreshToken");
      res.status(HttpStatusCode.OK).json({ message: "LogOut successfully" });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Somthing when wrong plese try again laiter" });
    }
  };
}
