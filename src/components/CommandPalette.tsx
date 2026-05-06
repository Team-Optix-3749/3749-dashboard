import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { Kbd, Modal, ModalBody, ModalHeader, Input, ListBox, ListBoxItem } from "@heroui/react";

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
};

export function CommandPalette({ isOpen, onClose, onOpen }: CommandPaletteProps) {
  const router = useRouter();

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isMod = isMac ? event.metaKey : event.ctrlKey;
      if (isMod && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) onClose();
        else onOpen();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, onOpen]);

  const handleAction = (key: string) => {
    if (key.startsWith("/")) {
      void router.navigate({ to: key });
      onClose();
      return;
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onClose}>
      <ModalHeader className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">Command Palette</p>
          <Kbd className="text-[10px]">⌘K</Kbd>
        </div>
      </ModalHeader>
      <ModalBody className="gap-3">
        <Input
          autoFocus
          placeholder="Search pages and quick actions..."
          variant="secondary"
          className="bg-surface"
        />
        <div className="rounded-lg border border-separator/80 bg-surface-secondary/80">
          <ListBox
            aria-label="Navigation shortcuts"
            onAction={(key: unknown) => handleAction(String(key))}
            className="max-h-72 overflow-y-auto py-1"
          >
            <ListBoxItem key="/dashboard">Go to dashboard</ListBoxItem>
            <ListBoxItem key="/build-hours">Go to build hours</ListBoxItem>
            <ListBoxItem key="/outreach">Go to outreach</ListBoxItem>
            <ListBoxItem key="/opi">Go to OPI</ListBoxItem>
            <ListBoxItem key="/members">Go to members</ListBoxItem>
          </ListBox>
        </div>
      </ModalBody>
    </Modal>
  );
}

