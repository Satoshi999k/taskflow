import { Router } from "express";
import { supabaseAdmin } from "./supabaseClient";

const router = Router();

router.get("/api/v1/health", (req, res) => {
  res.json({ status: "ok" });
});

router.post("/api/v1/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabaseAdmin.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ error: error.message });
  }

  let profileName: string | null = null;
  try {
    const profileRes = await supabaseAdmin
      .from("users")
      .select("name")
      .eq("id", data.user?.id)
      .maybeSingle();

    if (profileRes.data && (profileRes.data as any).name) {
      profileName = (profileRes.data as any).name;
    }
  } catch (profileError) {
    console.warn("Failed to fetch app profile name", profileError);
  }

  return res.json({
    user: data.user,
    session: data.session,
    profile: { name: profileName },
  });
});

router.post("/api/v1/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ user: data.user, session: data.session });
});

export default router;
