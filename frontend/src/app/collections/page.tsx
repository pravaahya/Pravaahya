import { Suspense } from "react";
import { CollectionsClient } from "./CollectionsClient";

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background pt-2">
      <Suspense fallback={null}>
        <CollectionsClient />
      </Suspense>
    </div>
  );
}
