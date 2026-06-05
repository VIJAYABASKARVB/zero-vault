import { Router } from "express";
import { getVault, addEntry, updateEntry, deleteEntry } from "../controllers/vault.controller.js";

const vaultRouter = Router();

vaultRouter.get("/", getVault);
vaultRouter.post("/", addEntry);
vaultRouter.put("/:entryId", updateEntry);
vaultRouter.delete("/:entryId", deleteEntry);

export default vaultRouter;