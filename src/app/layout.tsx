
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/components/providers/query-provider";
import { SITE_URL } from "@/lib/site-url";


// Pages set their own title and description; the template adds the club name.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Malabar Challengers Football Club",
    template: "%s | Malabar Challengers FC",
  },
  description:
    "Malabar Challengers FC, run by the Malabar Sports & Recreation Foundation, develops professional footballers in Keralam.",
  authors: [{ name: "Malabar Sports & Recreation Foundation" }],
  openGraph: {
    siteName: "Malabar Challengers Football Club",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

const themeScript = `(function(){try{var s=localStorage.getItem("mcfc-theme");if(s!=="light"){document.documentElement.classList.add("dark")}}catch(e){document.documentElement.classList.add("dark")}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700;800;900&family=Manrope:wght@400;500;600;700&display=swap"
        />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsOrganization",
              name: "Malabar Challengers Football Club",
              alternateName: "MCFC",
              sport: "Football",
              parentOrganization: { "@type": "Organization", name: "Malabar Sports & Recreation Foundation" },
              telephone: "+91 77 36 32 91 11",
              email: "coo@msrf.co.in",
              address: { "@type": "PostalAddress", addressRegion: "Keralam", addressCountry: "IN" },
            }),
          }}
        />
      </head>
      <body id="top">
        <QueryProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
