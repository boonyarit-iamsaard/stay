import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import { config } from "dotenv";
import * as Config from "effect/Config";
import * as Effect from "effect/Effect";

config({ path: "./.env" });
config({ path: "../../apps/staff/.env" });

export default Alchemy.Stack(
  "stay",
  {
    providers: Cloudflare.providers(),
    state: Cloudflare.state(),
  },
  Effect.gen(function* () {
    const staffWorker = yield* Cloudflare.Website.Vite("staff", {
      rootDir: "../../apps/staff",
      assets: {
        htmlHandling: "auto-trailing-slash",
        notFoundHandling: "single-page-application",
      },
      env: {
        VITE_SERVER_URL: Config.string("VITE_SERVER_URL"),
      },
      dev: {
        port: 3000,
      },
    });

    return {
      staff: staffWorker.url,
    };
  }),
);
