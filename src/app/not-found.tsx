import { display, sans, serif } from "@/lib/fonts";
import { contacts } from "@/content/profile";

// Global 404 (exported as out/404.html). Bilingual because no locale is known here.
export default function NotFound() {
  return (
    <html lang="pt-BR" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <body className="surface-dark min-h-dvh font-sans">
        <main className="page-grid min-h-dvh content-center gap-y-6 py-24">
          <p className="text-note col-span-full text-[1.375rem] text-gray-500">Erro 404. Error 404.</p>
          <h1 className="col-span-full font-display text-headline-l font-bold md:col-span-8">
            Página não encontrada. <span lang="en">Page not found.</span>
          </h1>
          {/* Full-page navigation on purpose: this page owns its own <html>, outside the locale layout. */}
          {/* eslint-disable @next/next/no-html-link-for-pages */}
          <p className="col-span-full flex gap-6 text-ui font-medium">
            <a className="underline underline-offset-4" href="/pt">Voltar ao início →</a>
            <a className="underline underline-offset-4" href="/en" lang="en">Back to home →</a>
          </p>
          {/* eslint-enable @next/next/no-html-link-for-pages */}
          {/* A way to talk, even here. */}
          {contacts.find((c) => c.kind === "email" && c.publish) && (
            <p className="col-span-full text-ui text-gray-500">
              Fale comigo · <span lang="en">Get in touch</span>:{" "}
              <a className="text-paper underline underline-offset-4" href={contacts.find((c) => c.kind === "email")?.href}>
                {contacts.find((c) => c.kind === "email")?.label}
              </a>
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
