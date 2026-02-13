import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ url, redirect }) => {
  const redirectUri = `${url.origin}/api/auth/callback`;

  const state = crypto.randomUUID();

  const authUrl = new URL(
    "https://github.com/apps/websim-github-integration/installations/new",
  );
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("redirect_uri", redirectUri);

  return redirect(authUrl.toString(), 302);
};
