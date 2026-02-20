// =============================================================================
// theme-provider.tsx -- Wraps the app with dark mode support
// =============================================================================
//
// WHAT IS A PROVIDER?
// -------------------
// A "Provider" is a component that makes data available to all its children
// via React Context. By wrapping our app with ThemeProvider, ANY component
// can access and change the theme (light/dark) without passing props.
//
// "use client" DIRECTIVE:
// -----------------------
// Next.js App Router renders components on the server by default.
// But theme detection needs access to the browser (window, localStorage),
// so we mark this as a Client Component with "use client".
// =============================================================================

"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
