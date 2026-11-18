import { notFound } from "next/navigation";

// Any address inside a language that has no page (e.g. /nl/oops)
// shows the friendly not-found page of that language.
export default function CatchAll() {
  notFound();
}
