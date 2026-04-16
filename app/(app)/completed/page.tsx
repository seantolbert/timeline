import type { Metadata } from "next";
import { CompletedClient } from "./CompletedClient";

export const metadata: Metadata = { title: "Completed" };

export default function CompletedPage() {
  return <CompletedClient />;
}
