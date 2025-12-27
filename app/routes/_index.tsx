import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/crypto-dash", { status: 301 });
}
