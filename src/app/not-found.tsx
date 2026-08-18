import Link from "next/link";
import { Compass } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <EmptyState
        icon={Compass}
        title="This page wandered off"
        description="The link may be old, or the product may have been removed. The deals are still here though."
      >
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </EmptyState>
    </div>
  );
}
