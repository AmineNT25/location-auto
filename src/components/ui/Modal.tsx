"use client";
import { useEffect, useRef, useId } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
export default function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    ref.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab") {
        const elements = Array.from(
          ref.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]',
          ) ?? [],
        );
        const first = elements[0];
        const last = elements.at(-1);
        const outside = !ref.current?.contains(document.activeElement);
        if (
          event.shiftKey &&
          (outside ||
            document.activeElement === first ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (outside ||
            document.activeElement === last ||
            document.activeElement === ref.current)
        ) {
          event.preventDefault();
          first?.focus();
        }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", keydown);
      previous?.focus();
    };
  }, [onClose]);
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/65 p-3 backdrop-blur-sm sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ y: 24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.98 }}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 py-5">
          <h2 id={titleId} className="text-xl font-semibold">
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            title="Close"
            onClick={onClose}
            className="rounded-md p-2 hover:bg-paper"
          >
            <X className="size-5" />
          </button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}
