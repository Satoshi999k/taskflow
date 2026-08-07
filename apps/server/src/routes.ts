import { Router } from "express";
import { supabaseAdmin } from "./supabaseClient";

const router = Router();

const deriveNameFromEmail = (email: string | undefined | null) => {
  if (!email) return "User";
  const local = String(email).split("@")[0];
  const withoutDigits = local.replace(/\d+$/, "");
  const raw = withoutDigits || local;
  const parts = raw.split(/[^a-zA-Z0-9]+/).filter(Boolean);
  if (parts.length === 0) {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

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

  const authMetadata = (data.user as any)?.user_metadata || (data.user as any)?.raw_user_meta_data || {};
  const authMetadataName =
    authMetadata.full_name ||
    authMetadata.name ||
    authMetadata.display_name ||
    [authMetadata.first_name, authMetadata.last_name]
      .filter(Boolean)
      .join(" ") ||
    null;

  const displayName =
    profileName || authMetadataName || deriveNameFromEmail(data.user?.email);

  return res.json({
    user: data.user,
    session: data.session,
    profile: { name: profileName },
    display_name: displayName,
  });
});

router.post("/api/v1/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const derivedName = deriveNameFromEmail(email);
  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: derivedName,
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({ user: data.user, session: data.session });
});

export default router;
