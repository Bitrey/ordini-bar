import { Router } from "express";
const router = Router();

import categoryRoutes from "./categoryRoutes";
import itemRoutes from "./itemRoutes";
import organizationRoutes from "./organizationRoutes";
import orderRoutes from "./orderRoutes";
import usersRoutes from "./usersRoutes";

import notFoundRoute from "./404";

router.use("/category", categoryRoutes);
router.use("/item", itemRoutes);
router.use("/organization", organizationRoutes);
router.use("/order", orderRoutes);
router.use("/user", usersRoutes);

router.use("/", notFoundRoute);

export default router;
