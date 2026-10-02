import type { Metadata } from "next";
import { NotesBoard } from "@/components/app/NotesBoard";

export const metadata: Metadata = { title: "Notes" };

export default function NotesPage() {
  return <NotesBoard />;
}
