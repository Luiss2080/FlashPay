import { Router } from "express";
import { getHomeData } from "../controllers/homeController";
import {
  transfer,
  topup,
  payService,
  deposit,
} from "../controllers/operationsController";
import {
  getServices,
  getContacts,
  addContact,
  getNotifications,
  resolveQR,
} from "../controllers/dataController";

const router = Router();

// Dashboard
router.get("/home_data", getHomeData); // Mapped to match PHP url somewhat or new standard? 'home_data.php' was the old one. Let's use clean URLs.

// We will map old PHP paths to new routes in Frontend, or update Frontend to use clean URLs.
// Plan said: "Update Frontend api.ts"
// So we can use clean URLs here.

router.get("/home-data", getHomeData);

// Operations
router.post("/transfer", transfer);
router.post("/topup", topup);
router.post("/deposit", deposit);
router.post("/services", payService); // POST to pay

// Data
router.get("/services", getServices); // GET list
router.get("/contacts", getContacts);
router.post("/contacts", addContact);
router.get("/notifications", getNotifications);
router.get("/resolve-qr", resolveQR);

// User Profile & Settings
import {
  updateProfile,
  updatePassword,
  getLimits,
  setLimits,
} from "../controllers/userController";
import { getPromos } from "../controllers/promosController";

router.post("/user/update", updateProfile);
router.post("/user/password", updatePassword);
router.get("/user/limits", getLimits);
router.post("/user/limits", setLimits);

// Promos
// Promos
router.get("/promos", getPromos);

// Metas
import {
  getMetas,
  createMeta,
  addFundsMeta,
} from "../controllers/metasController";

router.get("/metas", getMetas);
router.post("/metas", createMeta);
router.post("/metas/add", addFundsMeta);

export default router;
