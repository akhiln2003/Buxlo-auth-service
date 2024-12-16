import { Request, Response } from "express";
import HttpStatusCode from "@buxlo/common/build/common/httpStatusCode";
import { IsignInUserUseCase } from "../../../application/interfaces/IsignInUserUseCase";
import { USER_ROLE } from "../../../shared/enums/role";

export class SignInController {
  constructor(private signInUserUseCase: IsignInUserUseCase) {}

  signIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const role = USER_ROLE.ADMIN , isAdmin = true;
      const user = await this.signInUserUseCase.execute(email, password , role , isAdmin);

      // if the user not existing in db return response ( status code and message )
      if (user.notfount) {
        res
          .status(HttpStatusCode.NotFound)
          .json({ error: "This email is invalid" });
          return;
      }
      // if the user password  nto matching db return response ( status code and message )
      if (user.passwordNotMatch) {
        res.status(HttpStatusCode.Unauthorized).json({
          error:
            "Invalid credentials. Please check your password and try again.",
        });
        return;
      }
      res.cookie("userAccessToken", user.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 15 * 60 * 1000, // 15 minutes
      });
      res.cookie("userRefreshToken", user.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      res
        .status(HttpStatusCode.OK)
        .json({ message: "Login successful.", user: user.user });

      // await
    } catch (error) {
      console.error("Error in OTP verification controller:", error);
      res
        .status(HttpStatusCode.InternalServerError)
        .json({ message: "Internal server error", error: error });
    }
  };
}
