import { Loader2 } from "lucide-react";

/** The pending state every route falls back to while it loads. */
export function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Loader2 className="animate-spin" />
    </div>
  );
}
