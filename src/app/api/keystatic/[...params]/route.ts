import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// On the live site the editor saves to GitHub and needs the GitHub App's keys
// (see docs/content-editor.md). Until they are set in Vercel, the editor stays
// off instead of failing the whole deployment.
const ready =
  process.env.NODE_ENV !== "production" ||
  Boolean(
    process.env.KEYSTATIC_GITHUB_CLIENT_ID &&
      process.env.KEYSTATIC_GITHUB_CLIENT_SECRET &&
      process.env.KEYSTATIC_SECRET,
  );

const notSetUp = () =>
  new Response("The content editor is not set up yet.", { status: 503 });

export const { GET, POST } = ready
  ? makeRouteHandler({ config })
  : { GET: notSetUp, POST: notSetUp };
