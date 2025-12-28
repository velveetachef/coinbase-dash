import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

/**
 * Resource route to handle Chrome DevTools request for app-specific configuration.
 * Returns a 404 response to suppress the error in the console.
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return json({}, { status: 404 });
}

