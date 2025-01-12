import { Router } from "express";
import { homePage } from "../controllers/home.controller.js";

const homePageRouter = Router();

homePageRouter.get("/", homePage);

export default homePageRouter;
