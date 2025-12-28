import {
  Links,
  Meta,
  Outlet,
  Scripts,
} from "@remix-run/react";
import "./styles/variables.css";

/**
 * Added suppressHydrationWarning to the <html> element. This tells React to ignore hydration mismatches for this element, which is safe because:
 * - The script intentionally sets the attribute before hydration to prevent Flash of Unstyled Content
 * - The attribute is for styling only and doesn't affect React rendering
 * - The useTheme hook syncs it after hydration
 */
export default function App() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          href="data:image/x-icon;base64,AA"
        />
        <Meta />
        <Links />
        <script src="/theme-init.js" />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

