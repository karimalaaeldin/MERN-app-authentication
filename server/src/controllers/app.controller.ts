import { Request, Response } from "express";
import userModel from "../model/user.model";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { catchErrors } from "../utils/CatchErrors";
import otpGenerator from "otp-generator";
interface JWTPayload extends JwtPayload {
  userId: string;
  username: string;
}

interface AuthRequest extends Request {
  user?: JWTPayload;
}

export const register = catchErrors(async (req: Request, res: Response) => {
  const { username, email, password, profile } = req.body;
  const existingUsername = await userModel.findOne({ username });
  if (existingUsername) {
    res.status(400).send({ error: "Please use a unique username" });
    return;
  }

  const existingEmail = await userModel.findOne({ email });
  if (existingEmail) {
    res.status(400).send({ error: "Please use a unique email" });
    return;
  }

  Promise.all([existingUsername, existingEmail]).then(() => {
    if (password) {
      bcrypt
        .hash(password, 10)
        .then((hashedPassword) => {
          const user = new userModel({
            username,
            password: hashedPassword,
            profile: profile || "",
            email,
          });

          user
            .save()
            .then((result: any) =>
              res.status(201).send({ message: "User created successfully" })
            )
            .catch((error: any) => res.status(500).send({ error }));
        })
        .catch((error) => {
          return res.status(500).send({
            error: "Enable to hashedPassword",
          });
        });
    }
  });
});

export const login = catchErrors(async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const user = await userModel.findOne({ username });
  if (!user) {
    res.status(400).send({ error: "Invalid username or password" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    res.status(400).send({ error: "Invalid username or password" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).send({ error: "Server configuration error" });
    return;
  }

  const token = jwt.sign(
    { userId: user._id, username: user.username },
    secret,
    { expiresIn: "24h" }
  );

  res
    .status(200)
    .send({ message: "Login successful", username: user.username, token });
});

export const getUser = catchErrors(async (req: Request, res: Response) => {
  const { username } = req.params;

  if (!username) {
    res.status(404).json({ error: "Invalid username" });
    return;
  }

  const user = await userModel.findOne({ username });
  if (!user) {
    res.status(404).json({ error: "User not found!" });
    return;
  }

  const { password, ...rest } = Object.assign({}, user.toJSON());

  res.status(200).send(rest);
});

export const updateUser = catchErrors(
  async (req: AuthRequest, res: Response) => {
    const { userId } = req.user as JWTPayload;

    if (!userId) {
      res.status(404).send({ error: "User not found!" });
      return;
    }

    const body = req.body;
    const user = await userModel.updateOne({ _id: userId }, body);

    res.status(201).send({ message: "User updated successfully" });
    return;
  }
);

export const generateOTP = catchErrors(async (req: Request, res: Response) => {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res
    .status(201)
    .send({ message: "OTP generated successfully", code: req.app.locals.OTP });
});

export const verifyOTP = catchErrors(async (req: Request, res: Response) => {
  const { code } = req.query;
  const regex = /^\d+$/
  if (!code) {
    res.status(400).send({ error: "Missing OTP code" });
    return;
  }
  if (typeof code !== "string" || !regex.test(code)) {
    res.status(400).send({ error: "Invalid OTP code" });
    return;
  }
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null;
    req.app.locals.resetSession = true;
    res.status(201).send({ message: "OTP verified successfully" });
    return;
  }
  res.status(400).send({ error: "Invalid OTP" });
});

export const createResetSession = catchErrors(
  async (req: Request, res: Response) => {
    if (req.app.locals.resetSession) {
      res.status(201).send({ flag:req.app.locals.resetSession});
      return;
    }
    res.status(400).send({ error: "Session expired!" });
  }
);

export const resetPassword = catchErrors(
  async (req: Request, res: Response) => {
    if (!req.app.locals.resetSession) {
      res.status(440).send({ error: "Session expired!" });
      return;
    }
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(400).send({ error: "User not found!" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const updateUser = await userModel.updateOne(
      { username: user.username },
      { password: hashedPassword }
    );
    if (!updateUser) {
      res.status(400).send({ error: "Failed to reset password" });
      return;
    }
    req.app.locals.resetSession = false;
    res.status(201).send({ message: "Password reset successfully" });
  }
);
