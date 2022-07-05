import * as core from "@actions/core";
import { helmCleanup } from "./index";

(async () => {
  try {
    await helmCleanup();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();