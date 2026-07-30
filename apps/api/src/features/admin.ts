import { Router } from "express";
import { GetEnvConfig } from "../utils";
const config = GetEnvConfig();

const router = Router();


export { router as AdminRouter };

