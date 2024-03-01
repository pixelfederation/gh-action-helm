import { getCommonInputs } from "../input-helper";
import { getHelmVersion, helm, helmList } from "../helm-helper";
import { ICommonInputs } from "../ICommonInputs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function helmCleanup(): Promise<void> {
  const ci = await getCommonInputs();
  let helmVersion: number = await getHelmVersion();
  const regexp = core.getInput("regexp", { required: true });
  const excludes: string[] = core.getMultilineInput("excludes", {
    required: false,
  });

  let helmListArgs: string[] = [
    helmVersion > 2 ? "--filter" : "",
    regexp,
    "--short",
    "--namespace",
    ci.namespace,
  ].filter(Boolean);

  let deploys: string[] = await helmList(helmListArgs);

  for (let exclude of excludes) {
    const regExp = new RegExp(exclude.trim());
    console.log("EXCLUDE", regExp);
    deploys = deploys.filter((deploy) => {
      return !regExp.test(deploy);
    });
  }

  const promises: Array<Promise> = [];
  let helmArgs: string[];
  for (let deploy of deploys) {
    helmArgs = [helmVersion > 2 ? "uninstall" : "delete", deploy].concat([
      helmVersion == 2 ? "--purge" : "",
      ci.dryrun ? "--dry-run" : "",
    ]);
    if (helmVersion > 2) {
      helmArgs = helmArgs.concat(["--namespace", ci.namespace]);
    }
    promises.push(helm(helmArgs.filter(Boolean)));
  }
  await Promise.all(promises);
}
