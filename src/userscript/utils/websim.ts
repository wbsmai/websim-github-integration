import { getProjectRevisionAssets, getUserProjectBySlug } from "websim";

export function getProjectInfo() {
  const parts = location.pathname.split("/");

  const username = parts[1];

  if (!username?.startsWith("@")) return null;

  const userId = username.slice(1);

  const slug = parts[2];

  if (!userId || !slug) {
    return null;
  }

  return { userId, slug };
}
