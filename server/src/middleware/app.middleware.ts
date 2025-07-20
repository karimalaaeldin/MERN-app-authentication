import { Request, Response, NextFunction } from "express";
import { catchErrors } from "../utils/CatchErrors";
import userModel from "../model/user.model";

export const verifyUser = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.method === "GET" ? req.query : req.body;

    const existingUser = await userModel.findOne({ username });
    if (!existingUser) {
      res.status(404).json({ error: "User not found!" });
      return;
    }

    next();
  }
);
