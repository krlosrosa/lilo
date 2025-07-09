import "../globals.css";
import { SidebarLayout } from "@/components/SidebarLayout";
import { SidebarProvider } from "@/contexts/SidebarContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
            <SidebarProvider>
              <SidebarLayout>
                {children}
              </SidebarLayout>
            </SidebarProvider>
      </body>
    </html>
  );
}
