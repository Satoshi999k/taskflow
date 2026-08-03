import { Router } from "express";

const router = Router();

router.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

export default router;
