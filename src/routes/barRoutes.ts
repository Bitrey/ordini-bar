import { Request, Response, Router } from "express";
import { BAD_REQUEST, UNAUTHORIZED } from "http-status";
import { Document, isValidObjectId } from "mongoose";
import { findAllAndSend, validateAndSave } from "../functions";
import { RequestWithUser } from "../interfaces";
import Bar from "../models/Bar";
const router = Router();

router.get("/", async (req: Request, res: Response) => {
    // DEBUG: FIRST CHECK AUTH!
    findAllAndSend(Bar, req, res);
});

const isInOrganization = (
    _id: string,
    req: RequestWithUser,
    res: Response
): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!(req?.user instanceof Document)) return resolve(false);
            const userOrganizations = req.user.organizations;
            if (!Array.isArray(userOrganizations)) return reject();
            // Loop over user organizations and find if he's in the specified one
            for (const organizationId of <any>userOrganizations) {
                if (organizationId.equals(_id)) {
                    return resolve(true);
                }
            }
            res.status(UNAUTHORIZED).send(
                "You are not part of that organization"
            );
            return resolve(false);
        } catch (err) {
            reject(err);
        }
    });
};

router.post("/new", async (req: Request, res: Response) => {
    const { name, picture, organization } = req.body;

    if (typeof organization !== "string" || !isValidObjectId(organization))
        return res
            .status(BAD_REQUEST)
            .send("Please provide an organization param with a valid ObjectId");

    if (!(await isInOrganization(organization, <RequestWithUser>req, res)))
        return res
            .status(UNAUTHORIZED)
            .send("You're not into that organization");

    const bar = new Bar({
        name,
        categories: [],
        picture,
        openingTimes: [],
        organization
    });

    if (!(await validateAndSave(bar, res))) return;
});

export default router;
