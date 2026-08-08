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
  let profileId: string | null = null;
  try {
    if (data.user?.id) {
      const profileRes = await supabaseAdmin
        .from("users")
        .select("id,name,email")
        .eq("id", data.user.id)
        .maybeSingle();

      if (profileRes.data) {
        profileName = (profileRes.data as any).name || null;
        profileId = (profileRes.data as any).id || null;
      }
    }

    if (!profileName && email) {
      const profileResByEmail = await supabaseAdmin
        .from("users")
        .select("id,name,email")
        .eq("email", email)
        .maybeSingle();

      if (profileResByEmail.data) {
        profileName = (profileResByEmail.data as any).name || null;
        profileId = (profileResByEmail.data as any).id || null;
      }
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

  if (!profileName && authMetadataName && data.user?.id && email) {
    try {
      await supabaseAdmin.from("users").upsert(
        {
          id: data.user.id,
          email,
          name: authMetadataName,
          password_hash: null,
        },
        { onConflict: ["id"] }
      );
      profileName = authMetadataName;
    } catch (insertError) {
      console.warn("Failed to create missing profile row", insertError);
    }
  }

  const displayName =
    profileName || authMetadataName || deriveNameFromEmail(data.user?.email);

  let workspaceName: string | null = null;
  let membershipRole: string | null = null;
  try {
    if (data.user?.id) {
      const membershipRes = await supabaseAdmin
        .from("workspace_members")
        .select("workspace_id,role")
        .eq("user_id", data.user.id)
        .limit(1)
        .maybeSingle();

      const membership = membershipRes.data as any;
      const workspaceId = membership?.workspace_id;
      const role = membership?.role as string | null;

      if (!membership || !workspaceId) {
        return res.status(403).json({ error: "Access denied. User is not a member of any workspace." });
      }

      membershipRole = role || "MEMBER";

      const workspaceRes = await supabaseAdmin
        .from("workspaces")
        .select("name")
        .eq("id", workspaceId)
        .limit(1)
        .maybeSingle();

      workspaceName = (workspaceRes.data as any)?.name || null;
    }
  } catch (workspaceError) {
    console.warn("Failed to fetch workspace name", workspaceError);
  }

  return res.json({
    user: data.user,
    session: data.session,
    profile: { id: profileId, name: profileName, role: membershipRole },
    display_name: displayName,
    workspace: { name: workspaceName },
  });
});

router.post("/api/v1/register", async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const derivedName = name?.trim() ? String(name).trim() : deriveNameFromEmail(email);
  const requestedRole = String(role || "MEMBER").toUpperCase();
  const validRoles = ["OWNER", "ADMIN", "MEMBER", "VIEWER"];
  const normalizedRole = validRoles.includes(requestedRole) ? requestedRole : "MEMBER";

  const { data, error } = await supabaseAdmin.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: derivedName,
        role: normalizedRole,
      },
    },
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  return res.json({
    user: data.user,
    session: data.session,
    profile: { name: derivedName, role: normalizedRole },
  });
});

export default router;
