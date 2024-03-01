import { getCommonInputs } from "../input-helper";
import { getHelmVersion, helm } from "../helm-helper";
import { ICommonInputs } from "../ICommonInputs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function helmUpgrade(): Promise<void> {
  const ci: ICommonInputs = await getCommonInputs();

  let helmVersion: number = await getHelmVersion();

  const release: string = core.getInput("release", { required: true });
  const chart: string = core.getInput("chart", { required: true });
  const version: string = core.getInput("version", { required: true });
  const files: string[] = core.getMultilineInput("files", { required: false });
  const set: string[] = core.getMultilineInput("set", { required: false });
  let timeout: string = core.getInput("timeout", { required: false });
  const atomic: boolean = core.getBooleanInput("atomic", { required: false });
  const wait: boolean = core.getBooleanInput("wait", { required: false });
  const install: boolean = core.getBooleanInput("install", { required: false });

  const setString: string = set
    .map((item) => {
      return item
        .split("|")
        .map((it) => {
          return it.trim();
        })
        .join("=");
    })
    .join(",");

  let filesList = files
    .map((item) => {
      return ["-f", item.trim()];
    })
    .flat();

  if (helmVersion > 2) {
    timeout = timeout + "s";
  }
  let helmArgs: string[] = [
    "upgrade",
    release,
    chart,
    "--version",
    version,
  ].concat(filesList);
  if (setString.length > 0) {
    helmArgs = helmArgs.concat(["--set", setString]);
  }
  helmArgs = helmArgs
    .concat(["--namespace", ci.namespace, "--timeout", timeout])
    .concat([
      atomic ? "--atomic" : "",
      install ? "--install" : "",
      wait ? "--wait" : "",
      ci.dryrun ? "--dry-run" : "",
    ])
    .filter(Boolean);

  await helm(helmArgs);
}
