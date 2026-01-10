import { render } from "solid-js/web";

function main() {
  const bottomSidebarSection = document.querySelector<HTMLDivElement>(
    'div > [aria-label*="profile menu"]',
  )?.parentElement;

  if (!(bottomSidebarSection instanceof HTMLDivElement)) {
    return;
  }

  const buttonEntryPoint = document.createElement("div");
  bottomSidebarSection.prepend(buttonEntryPoint);

  const myButton = <button>My Button</button>;

  render(() => myButton, bottomSidebarSection);
}

main();
