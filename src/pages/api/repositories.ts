import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request }) => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.slice(7);

  try {
    const response = await fetch(
      "https://api.github.com/installation/repositories",
      {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );

    if (!response.ok) {
      const error = await response.text();
      return new Response(error, { status: response.status });
    }

    const data: {
      repositories: { full_name: string; name: string; private: boolean }[];
    } = await response.json();
    const repos = data.repositories.map(
      (repo: { full_name: string; name: string; private: boolean }) => ({
        fullName: repo.full_name,
        name: repo.name,
        isPrivate: repo.private,
      }),
    );

    return new Response(JSON.stringify(repos), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch repositories:", error);
    return new Response("Failed to fetch repositories", { status: 500 });
  }
};
