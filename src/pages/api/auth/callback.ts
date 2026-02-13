import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { Octokit } from "octokit";

const GITHUB_PRIVATE_KEY = atob(env.GITHUB_PRIVATE_KEY_BASE_64);

export const GET: APIRoute = async ({ url, redirect }) => {
  const installationId = url.searchParams.get("installation_id");
  const code = url.searchParams.get("code");

  if (installationId) {
    const octokit = new Octokit({
      auth: {
        clientId: env.GITHUB_CLIENT_ID,
        privateKey: GITHUB_PRIVATE_KEY,
      },
    });

    try {
      const { data } = await octokit.request(
        "POST /app/installations/{installation_id}/access_tokens",
        {
          installation_id: parseInt(installationId, 10),
          permissions: {
            contents: "write",
          },
        },
      );

      const token = data.token;

      return redirect(`/api/auth/callback?token=${token}`, 302);
    } catch (error) {
      console.error("Failed to create installation token:", error);
      return new Response("Failed to authenticate with GitHub", {
        status: 500,
      });
    }
  }

  if (code) {
    const octokit = new Octokit();

    try {
      const { data } = await octokit.request("POST /login/oauth/access_token", {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      });

      if (data.access_token) {
        return redirect(`/api/auth/callback?token=${data.access_token}`, 302);
      }

      return new Response("No access token received", { status: 400 });
    } catch (error) {
      console.error("Failed to exchange code for token:", error);
      return new Response("Failed to authenticate with GitHub", {
        status: 500,
      });
    }
  }

  return new Response("Missing installation_id or code", { status: 400 });
};
