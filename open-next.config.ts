import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// `npm run build` runs the OpenNext build, which runs `next build` itself.
// buildCommand avoids it calling `npm run build` again (infinite loop).
export default { ...defineCloudflareConfig(), buildCommand: "npx next build" };
