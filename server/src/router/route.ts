import { Router, Request, Response } from "express";
import * as controller from "../controllers/app.controller";
import * as middleware from "../middleware/app.middleware";
import * as authMiddleware from "../middleware/auth.middleware";
import { registerMail } from "../controllers/mailer.controller";

const router = Router();

// POST METHOD
router.route("/register").post(controller.register);
router.route("/registerMail").post(registerMail);
router
  .route("/authenticate")
  .post(middleware.verifyUser, (req: Request, res: Response) => {
    res.end();
  });
router.route("/login").post(middleware.verifyUser, controller.login);

// GET METHOD
router.route("/user/:username").get(controller.getUser);
router
  .route("/generateOTP")
  .get(
    middleware.verifyUser,
    authMiddleware.localVariables,
    controller.generateOTP
  );
router.route("/verifyOTP").get(middleware.verifyUser, controller.verifyOTP);
router.route("/createResetSession").get(controller.createResetSession);

// PUT METHOD
router.route("/updateUser").put(authMiddleware.Auth, controller.updateUser);
router
  .route("/resetPassword")
  .put(middleware.verifyUser, controller.resetPassword);

export default router;
