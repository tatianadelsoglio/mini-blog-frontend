/**
 * Script inline que corre antes de pintar (guía "Preventing flash before
 * hydration" de Next 16). En el cliente se marca text/plain para que React no
 * avise por renderizar <script>; suppressHydrationWarning cubre la diferencia.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
