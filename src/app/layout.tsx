import Navbar from "@/components/Navbar";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/Toaster";
import Providers from "@/components/Providers";

export const metadata = {
  title: "Breadit",
  description: "A Reddit clone built with Next.js and TypeScript.",
};

// Initializing a font that is going to be used for the app
const inter = Inter({ subsets: ["latin"] });

// Note: The auth modal is used to intercept request and to show the content of the page in a modal
// The root layout and @authModal are at the same level so I can grab the authModal from the root layout props
// and render it here

// This is called parallel route we are showing the modal and the children (the content of the home page) at the same time

// By pressing F5 only the children will be rendered (the page that should be rendered based on the route)

export default function RootLayout({
  children,
  authModal,
}: {
  children: React.ReactNode;
  authModal: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "bg-white text-slate-900 antialiased light",
        inter.className
      )}
    >
      <body className="min-h-screen pt-12 bg-slate-50 antialiased">
        <Providers>
          {/* @ts-expect-error server component */}
          <Navbar />
          <div className="container max-w-7xl mx-auto h-full pt-12">
            {authModal}
            {children}
          </div>

          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
