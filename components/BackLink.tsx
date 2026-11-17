import Link from "next/link";
import { textLinkClass } from "@/components/buttonStyles";

/** "← Volver a Historias" (en mobile, "← Historias"). */
export function BackLink() {
  return (
    <div className="mx-auto w-full max-w-page px-lg pt-md lg:px-4xl lg:pt-xl">
      <Link href="/historias" className={textLinkClass}>
        ← <span className="hidden lg:inline">Volver a</span> Historias
      </Link>
    </div>
  );
}
