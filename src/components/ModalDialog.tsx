import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";

interface ModalDialogProps {
  onClose: () => void;
  children: ReactNode;
}

export function ModalDialog({ onClose, children }: ModalDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, []);

  function handleBackdrop(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  return (
    <dialog className="modal" ref={dialogRef} onCancel={onClose} onClick={handleBackdrop}>
      {children}
    </dialog>
  );
}
