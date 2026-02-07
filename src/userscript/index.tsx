import { createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Modal } from "./modal";

function main() {
  const bottomSidebarSection = document.querySelector<HTMLDivElement>(
    'div > [aria-label*="profile menu"]',
  )?.parentElement;

  if (!(bottomSidebarSection instanceof HTMLDivElement)) {
    return;
  }

  const [isModalOpen, setIsModalOpen] = createSignal<boolean>(false);

  render(
    () => <Modal isOpen={isModalOpen()} setIsOpen={setIsModalOpen} />,
    document.body,
  );

  const buttonEntryPoint = document.createElement("div");
  bottomSidebarSection.prepend(buttonEntryPoint);

  const showModalButton = (
    <button onclick={() => setIsModalOpen(true)}>Show modal</button>
  );

  render(() => showModalButton, bottomSidebarSection);
}

main();
