import Link from "next/link";
import { buttonVariants } from "@/components/buttonStyles";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-status-page-mobile w-full max-w-page flex-col items-center justify-center gap-md px-lg text-center lg:min-h-status-page lg:gap-roomy lg:px-4xl">
      <p
        aria-hidden="true"
        className="font-heading text-status-code-mobile text-accent italic lg:text-status-code"
      >
        404
      </p>
      <h1 className="font-heading text-status-title-mobile font-semibold text-text-primary lg:text-status-title">
        Esta página se perdió entre las hojas
      </h1>
      <p className="font-body text-excerpt text-text-secondary lg:text-body-lg">
        Puede que el enlace esté viejo o que la historia haya cambiado de lugar.
      </p>
      <div className="flex w-full flex-col gap-sm pt-sm lg:w-auto lg:flex-row lg:pt-md">
        <Link href="/" className={`${buttonVariants.primary} w-full lg:w-auto`}>
          Volver al inicio
        </Link>
        <Link
          href="/historias"
          className={`${buttonVariants.secondary} w-full lg:w-auto`}
        >
          Ver historias
          <ArrowRightIcon className="size-icon-sm" />
        </Link>
      </div>
    </div>
  );
}
