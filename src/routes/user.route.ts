import { Router } from "express";
import { userController } from "~/controllers";
import { authenticateToken } from "~/middlewares";

const userRoute = Router();

userRoute.post("/login", userController.login);
userRoute.post("/login/google", userController.loginWithGoogle);
userRoute.post("/signup", userController.signUp);
userRoute.get("/profile", authenticateToken, userController.getUserInfo);
userRoute.put("/profile", authenticateToken, userController.updateUserInfo);
userRoute.put(
  "/profile/updatePassword",
  authenticateToken,
  userController.updatePassword
);

export default userRoute;
