import { Router } from "express";
const router = Router();
import itemRoutes from "./itemRoutes";

router.use("/item", itemRoutes);

export default router;
