import { redirect } from "@remix-run/node";

export function loader() {
  return redirect("/crypto-dash", { status: 301 });
}
