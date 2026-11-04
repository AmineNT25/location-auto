import { LoaderCircle } from "lucide-react";
export default function LoadingSpinner() {
  return (
    <span
      role="status"
      className="inline-flex items-center gap-2 text-sm text-muted"
    >
      <LoaderCircle className="size-4 animate-spin" /> Loading vehicles
      <span className="sr-only">, please wait</span>
    </span>
  );
}
