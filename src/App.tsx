import { useIpcSubscriptions } from "@/hooks/useIpc";
import { Sidebar } from "@/components/sidebar/Sidebar";
import { Omnibox } from "@/components/omnibox/Omnibox";
import { useUIStore } from "@/stores/uiStore";
import { useEffect } from "react";

export default function App(): JSX.Element {
  useIpcSubscriptions();

  const omniboxOpen = useUIStore((s) => s.omniboxOpen);
  const setOmniboxOpen = useUIStore((s) => s.setOmniboxOpen);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const setCommandPaletteOpen = useUIStore((s) => s.setCommandPaletteOpen);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
      // Ctrl+L or Ctrl+K -> Omnibox
      if ((e.ctrlKey && e.key === "l") || (e.ctrlKey && e.key === "k")) {
        e.preventDefault();
        setOmniboxOpen(true);
      }
      // Ctrl+B -> Toggle sidebar
      if (e.ctrlKey && e.key === "b") {
        e.preventDefault();
        toggleSidebar();
      }
      // Ctrl+Shift+P -> Command palette
      if (e.ctrlKey && e.shiftKey && e.key === "P") {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      // Ctrl+T -> New tab
      if (e.ctrlKey && e.key === "t") {
        e.preventDefault();
        window.axle.createTab();
      }
      // Ctrl+W -> Close active tab
      if (e.ctrlKey && e.key === "w") {
        e.preventDefault();
        // Close logic handled via store
      }
      // Escape -> Close overlays
      if (e.key === "Escape") {
        setOmniboxOpen(false);
        setCommandPaletteOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setOmniboxOpen, toggleSidebar, setCommandPaletteOpen]);

  return (
    <div className="flex h-full w-full bg-bg-base">
      <Sidebar />
      {omniboxOpen && <Omnibox />}
    </div>
  );
}
