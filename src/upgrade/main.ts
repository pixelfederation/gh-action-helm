import * as core from "@actions/core";
import { helmUpgrade } from "./index";

(async () => {
  try {
    await helmUpgrade();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
