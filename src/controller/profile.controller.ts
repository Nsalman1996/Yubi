import { Router, Request, Response } from "express";
import { IProfile } from '../model/profile.model';
import { ProfileRepositery } from "../repositery/profile.repositery";
import { server_config } from "../config/server.config";


export class ProfileController {
    router: Router;

    constructor() {
        this.router = Router();
    }
    getRoutes() {
        this.routes();
        return this.router;
    }

    routes() {
        this.router.post("/api/profile/createUser", this.createUser);
        this.router.post("/api/profile/updateUser", this.updateUser);
        this.router.post("/api/profile/deleteUser", this.deleteUser);
        this.router.get("/api/profile/getAllUser", this.getAllUser);
        this.router.get("/api/profile/getOtp", this.getOtp);
        this.router.post("/api/profile/verifyOtp", this.verifyOtp);
    }
    async createUser(req: Request, res: Response) {
        let param: IProfile = req.body;
        let repo = ProfileRepositery.getInstance();
        try {
            let result = await repo.createUser(param);
            console.log(result);
            if (result.status) {
                res.status(200).send({ error: false, message: result.record });
            } else {
                res.status(409).send({ "error": true, "message": "User Already Exists" });
            }
        } catch (error) {
            res.status(500).send();
            throw (error);
        }
    }
    async updateUser(req: Request, res: Response) {
        let param: IProfile = req.body;
        let repo = ProfileRepositery.getInstance();
        try {
            let result = await repo.updateUser(param);
            console.log(result);
            if (result.status) {
                res.status(200).send({ error: false, message: result.record });
            } else {
                res.status(409).send({ "error": true, "message": "User Already Exists" });
            }
        } catch (error) {
            res.status(500).send();
            throw (error);
        }
    }
    async deleteUser(req: Request, res: Response) {
        let param = req.body;
        let repo = ProfileRepositery.getInstance();
        try {
            let result = await repo.deleteRecord(param);
            if (result.status) {
                res.status(200).send({ error: false, message: result.record });
            } else {
                res.status(500).send(result.error);
            }
        } catch (error) {
            res.status(500).send(error);
            throw (error)
        }
    }

    async getAllUser(req: Request, res: Response) {
        let repo = ProfileRepositery.getInstance();
        try {
            let result = await repo.getAllRecords();
            if (result.status) {
                res.status(200).send({ error: false, message: result.record });
            } else {
                res.status(500).send(result.error);
            }
        } catch (error) {
            res.status(500).send(error);
            throw (error)
        }
    }

    async verifyOtp(req: Request, res: Response) {
        let param = req.body;

        try {
            if (server_config.OTP == param.otp) {
                res.status(200).send({ error: false, message: "Otp Verified" });
            }
            else {
                res.status(401).send({ "error": true, "message": "Wrong Otp" });
            }
        } catch (error) {
            res.status(500).send(error);
            throw (error);
        }

    }

    async getOtp(req: Request, res: Response) {
        try {
            let otp = {
                "otp": server_config.OTP
            }
            res.status(200).send({ error: false, message: otp });
        } catch (error) {
            res.status(500).send(error);
            throw (error);
        }
    }
}