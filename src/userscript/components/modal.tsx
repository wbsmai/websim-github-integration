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
            <h2 style={{ margin: "0 0 1.25rem" }}>Modal</h2>

            <button
              style={{
                "margin-top": "1.75rem",
                border: "none",
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
