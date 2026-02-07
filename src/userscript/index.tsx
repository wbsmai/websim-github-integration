import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Modal } from "./modal";

const PROFILE_MENU_DIV_SELECTOR = 'div > [aria-label*="profile menu"]';
const ENTRYPOINT_ID = "button-entrypoint";

function injectButton() {
  if (document.getElementById(ENTRYPOINT_ID)) return;

  const bottomSidebarSection = document.querySelector<HTMLDivElement>(
    PROFILE_MENU_DIV_SELECTOR,
  )?.parentElement;

  if (!(bottomSidebarSection instanceof HTMLDivElement)) {
    return;
  }

  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);

  const entry = document.createElement("div");
  entry.id = ENTRYPOINT_ID;
  bottomSidebarSection.prepend(entry);

  const App = (
    <>
      <button onclick={() => setIsModalOpen(true)}>Show modal</button>
      <Modal isOpen={isModalOpen()} setIsOpen={setIsModalOpen} />
    </>
  );

  render(() => App, entry);
}

const observer = new MutationObserver(() => injectButton());

observer.observe(document.body, { childList: true, subtree: true });

injectButton();
