const GITHUB_TOKEN_KEY = "github_token";
const GITHUB_INSTALLATION_ID_KEY = "github_installation_id";

export async function getStoredToken(): Promise<string | null> {
  return await GM.getValue(GITHUB_TOKEN_KEY, null);
}

export async function setStoredToken(token: string): Promise<void> {
  await GM.setValue(GITHUB_TOKEN_KEY, token);
}

export async function getStoredInstallationId(): Promise<string | null> {
  return await GM.getValue(GITHUB_INSTALLATION_ID_KEY, null);
}

export async function setStoredInstallationId(id: string): Promise<void> {
  await GM.setValue(GITHUB_INSTALLATION_ID_KEY, id);
}

export async function clearStoredToken(): Promise<void> {
  await GM.deleteValue(GITHUB_TOKEN_KEY);
  await GM.deleteValue(GITHUB_INSTALLATION_ID_KEY);
}

export function login(): void {
  const width = 600;
  const height = 700;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  const popup = window.open(
    "https://websim.rman.dev/api/auth/login",
    "GitHub Auth",
    `width=${width},height=${height},left=${left},top=${top}`,
  );

  if (!popup) {
    alert("Please allow popups to authenticate with GitHub");
    return;
  }

  const handleMessage = (event: MessageEvent) => {
    if (event.origin !== window.location.origin) return;

    const { type, token, installationId } = event.data;
    if (type === "github-token") {
      setStoredToken(token);
      if (installationId) {
        setStoredInstallationId(installationId);
      }
      window.removeEventListener("message", handleMessage);
      popup.close();
    }
  };

  window.addEventListener("message", handleMessage);
}

export function handleCallback(): boolean {
  const url = new URL(window.location.href);
  const token = url.searchParams.get("token");

  if (token) {
    setStoredToken(token);
    url.searchParams.delete("token");
    window.history.replaceState({}, "", url.toString());

    if (window.opener) {
      window.opener.postMessage(
        { type: "github-token", token },
        window.location.origin,
      );
    }
    return true;
  }

  return false;
}
