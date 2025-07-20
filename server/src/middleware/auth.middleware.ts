import { Request, Response, NextFunction } from "express";
import { catchErrors } from "../utils/CatchErrors";
import jwt, { JwtPayload } from "jsonwebtoken";

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

export const Auth = catchErrors(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send({ error: "Unauthorized" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).send({ error: "Server configuration error" });
      return;
    }

    const decodedToken = jwt.verify(token, secret);
    req.user = decodedToken;

    next();
  }
);

export const localVariables = catchErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    req.app.locals = {
      OTP: null,
      resetSession: false,
    };
    next();
  }
);
