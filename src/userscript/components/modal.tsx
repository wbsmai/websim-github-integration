import type { Setter } from "solid-js";
import { createSignal, onMount } from "solid-js";
import { Portal, Show } from "solid-js/web";
import { getStoredToken, login } from "../services/github-auth";

interface Repository {
  fullName: string;
  name: string;
  isPrivate: boolean;
}

export function Modal(props: {
  isOpen: boolean;
  setIsOpen: Setter<boolean>;
  selectedRepo: Setter<Repository | null>;
}) {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(true);

  onMount(async () => {
    const token = await getStoredToken();
    setIsAuthenticated(!!token);
    setIsLoading(false);
  });

  return (
    <Show when={props.isOpen}>
      <Portal useShadow={true}>
        <div
          style={{
            position: "fixed",
            inset: "0",
            "z-index": 100,
            display: "grid",
            "place-items": "center",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) props.setIsOpen(false);
          }}
        >
          <div
            style={{
              background: "#ffffff",
              padding: "2.5rem",
              "border-radius": "12px",
              "max-width": "min(90vw, 580px)",
              color: "#111",
              "font-family": "system-ui, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 1.25rem" }}>Export to GitHub</h2>

            <Show when={!isLoading()} fallback={<p>Loading...</p>}>
              <Show
                when={isAuthenticated()}
                fallback={
                  <button
                    style={{
                      "background-color": "#24292f",
                      color: "#ffffff",
                      border: "none",
                      padding: "0.75rem 1.5rem",
                      "border-radius": "8px",
                      "font-size": "1rem",
                      "font-weight": "600",
                      cursor: "pointer",
                      display: "flex",
                      "align-items": "center",
                      gap: "0.5rem",
                    }}
                    onClick={login}
                  >
                    <svg
                      height="20"
                      viewBox="0 0 16 16"
                      width="20"
                      fill="currentColor"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                    </svg>
                    Connect GitHub
                  </button>
                }
              >
                <p style={{ color: "#1a7f37", "margin-bottom": "1rem" }}>
                  Connected to GitHub
                </p>
              </Show>
            </Show>

            <button
              style={{
                "margin-top": "1.75rem",
                border: "none",
                "font-weight": "bold",
                cursor: "pointer",
                background: "transparent",
                color: "#666",
              }}
              onClick={() => props.setIsOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
