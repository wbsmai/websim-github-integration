import { env } from "cloudflare:workers";
import type { APIRoute } from "astro";
import { Octokit } from "octokit";

const GITHUB_PRIVATE_KEY = atob(env.GITHUB_PRIVATE_KEY_BASE_64);

function createInstallationSelector(
  installations: Array<{ id: number; account: { login: string } | null }>,
  redirectUri: string,
): string {
  const options = installations
    .map(
      (inst) =>
        `<option value="${inst.id}">${inst.account?.login || "Unknown"}</option>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <title>Select Installation</title>
</head>
<body>
  <h2>Select a GitHub account or organization</h2>
  <p>You have the Websim GitHub app installed on multiple accounts. Please select which one to use:</p>
  <form id="selectForm">
    <select id="installation" style="padding: 8px; font-size: 16px; width: 300px;">
      ${options}
    </select>
    <button type="submit" style="padding: 8px 16px; font-size: 16px; margin-left: 8px;">Continue</button>
  </form>
  <script>
    document.getElementById("selectForm").addEventListener("submit", function(e) {
      e.preventDefault();
      const installationId = document.getElementById("installation").value;
      window.location.href = "${redirectUri}" + "?installation_id=" + installationId;
    });
  </script>
</body>
</html>`;
}

export const GET: APIRoute = async ({ url, redirect }) => {
  const redirectUri = `${url.origin}/api/auth/callback`;
  const state = crypto.randomUUID();

  const octokit = new Octokit({
    auth: {
      clientId: env.GITHUB_CLIENT_ID,
      privateKey: GITHUB_PRIVATE_KEY,
    },
  });

  try {
    const { data: installations } = await octokit.request(
      "GET /app/installations",
    );

    if (installations.length === 0) {
      const authUrl = new URL(
        "https://github.com/apps/websim-github-integration/installations/new",
      );
      authUrl.searchParams.set("state", state);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      return redirect(authUrl.toString(), 302);
    }

    if (installations.length === 1) {
      const authUrl = new URL(redirectUri);
      authUrl.searchParams.set(
        "installation_id",
        installations[0]!.id.toString(),
      );
      authUrl.searchParams.set("state", state);
      return redirect(authUrl.toString(), 302);
    }

    return new Response(
      createInstallationSelector(installations, redirectUri),
      {
        headers: { "Content-Type": "text/html" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Failed to fetch installations:", error);
    const authUrl = new URL(
      "https://github.com/apps/websim-github-integration/installations/new",
    );
    authUrl.searchParams.set("state", state);
    authUrl.searchParams.set("redirect_uri", redirectUri);
    return redirect(authUrl.toString(), 302);
  }
};
