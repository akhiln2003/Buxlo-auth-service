import { Request, Response } from "express";
import { IfetchUserUseCase } from "../../../application/interfaces/IfetchUserUseCase";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { USER_ROLE } from "../../../shared/enums/role";

export class FetchMentorController {
  constructor(private fetchUserUseCase: IfetchUserUseCase) {}

  fetchUsers = async (req: Request, res: Response) => {
    try {
      const  role  = USER_ROLE.MENTOR;
      const data = await this.fetchUserUseCase.execute(role);
      
      res.status(HttpStatusCode.OK).json({ data });
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ error: "Somthing when wrong please try again laiter" });
    }
  };
}
