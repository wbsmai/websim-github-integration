import type { Setter } from "solid-js";
import { Portal, Show } from "solid-js/web";

export function Modal(props: { isOpen: boolean; setIsOpen: Setter<boolean> }) {
  return (
    <Show when={props.isOpen}>
      <Portal useShadow={true}>
        <div
          style={{
            position: "fixed",
            inset: "0",
            "z-index": 9999999,
            display: "grid",
            "place-items": "center",
            background: "rgba(0,0,0,0.65)",
            "backdrop-filter": "blur(6px)",
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
              "box-shadow": "0 25px 50px -12px rgba(0,0,0,0.4)",
              color: "#111",
              "font-family": "system-ui, sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ margin: "0 0 1.25rem" }}>
              SolidJS Modal in Shadow DOM
            </h2>
            <p>
              This modal is completely isolated — no style conflicts with the
              page!
            </p>
            <p>Perfect for userscripts on Twitter/X, Reddit, etc.</p>

            <button
              style={{
                "margin-top": "1.75rem",
                padding: "0.8rem 1.8rem",
                background: "#1d9bf0",
                color: "white",
                border: "none",
                "border-radius": "9999px",
                "font-weight": "bold",
                cursor: "pointer",
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
