import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Modal } from "./components/modal";
import { SidebarButton } from "./components/sidebar-button";
import { handleCallback } from "./services/github-auth";

const PROFILE_MENU_DIV_SELECTOR = 'div > [aria-label*="profile menu"]';
const ENTRYPOINT_ID = "button-entrypoint";

function injectButton() {
  console.log("Injecting Button");

  if (document.getElementById(ENTRYPOINT_ID)) {
    console.log("Button already exists");
    return;
  }

  const bottomSidebarSection = document.querySelector<HTMLDivElement>(
    PROFILE_MENU_DIV_SELECTOR,
  )?.parentElement;

  if (!(bottomSidebarSection instanceof HTMLDivElement)) {
    return;
  }

  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);
  const [_selectedRepo, setSelectedRepo] = createSignal<{
    fullName: string;
    name: string;
    isPrivate: boolean;
  } | null>(null);

  const entry = document.createElement("div");
  entry.id = ENTRYPOINT_ID;
  bottomSidebarSection.prepend(entry);

  const App = () => (
    <>
      <SidebarButton onClick={() => setIsModalOpen(true)} />
      <Modal
        isOpen={isModalOpen()}
        setIsOpen={setIsModalOpen}
        selectedRepo={setSelectedRepo}
      />
    </>
  );

  render(App, entry);
}

setInterval(injectButton, 5000);

window.addEventListener("urlchange", injectButton);

injectButton();

handleCallback();
