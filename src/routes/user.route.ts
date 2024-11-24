import { Router } from "express";
import { userController } from "~/controllers";

const userRoute = Router();

userRoute.post("/login", userController.login);
userRoute.post("/login/google", userController.loginWithGoogle);
userRoute.post("/signup", userController.signUp);
userRoute.get("/profile", userController.getUserInfo);
userRoute.put("/profile", userController.updateUserInfo);

export default userRoute;
