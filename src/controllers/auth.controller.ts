import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IReqUser } from "../middlewares/auth.middleware";

type TRegister = {
    fullname: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
};

type TLogin = {
    identifier: string;
    password: string;
};

const registerValidationSchema = Yup.object({
    fullname: Yup.string().required(),
    username: Yup.string().required(),
    email: Yup.string().email().required(),
    password: Yup.string().min(6).required(),
    passwordConfirmation: Yup.string()
        .required()
        .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

export default {
    async register(req: Request, res: Response) {
        const { fullname, username, email, password, passwordConfirmation } = req.body as unknown as TRegister;

        const result = await UserModel.create({
            fullname,
            username,
            email,
            password,
        });

        try {
            await registerValidationSchema.validate({ fullname, username, email, password, passwordConfirmation });
            res.status(200).json({
                message: "Registration successful",
                data: result,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({ message: err.message, data: null });
        }
    },

    async login(req: Request, res: Response) {
        const { identifier, password } = req.body as unknown as TLogin;
        try {
            // ambil data user brdasarkan 'identifier' => email dan username
            const userByIdentifier = await UserModel.findOne({
                $or: [
                    {
                        email: identifier,
                    },
                    {
                        username: identifier,
                    },
                ],
            });

            if (!userByIdentifier) {
                return res.status(403).json({ message: "User not found", data: null });
            }
            // validasi password
            const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

            if (!validatePassword) {
                return res.status(403).json({ message: "Invalid password", data: null });
            }

            const token = generateToken({
                id: userByIdentifier._id,
                role: userByIdentifier.role,
            });

            res.status(200).json({
                message: "Login successful",
                data: token,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({ message: err.message, data: null });
        }
    },

    async me(req: IReqUser, res: Response) {
        try {
            const user = req.user;
            const result = await UserModel.findById(user?.id);

            res.status(200).json({
                message: "Success get user data",
                data: result,
            });
        } catch (error) {
            const err = error as unknown as Error;
            res.status(400).json({ message: err.message, data: null });
        }
    },
};
