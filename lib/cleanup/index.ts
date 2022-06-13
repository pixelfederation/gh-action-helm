import { getCommonInputs } from "../input-helper";
import { getHelmVersion, getExecOpts } from "../helm-helper";
import {ICommonInputs} from "../ICommonInputs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function helmCleanup(): Promise<void> {

  const ci = await getCommonInputs();
  let helmVersion: number = await getHelmVersion();
  const regexp = core.getInput('regexp', { required: true });
  const excludes: string[] = core.getMultilineInput('excludes', { required: false });
  const opts = getExecOpts({cwd: ci.dir, env: {'KUBECONFIG': ci.kubeconfig}});
  let helmArgs: string[] = ['list', (helmVersion > 2) ? '--filter' : '', regexp,
    '--short', '--namespace', ci.namespace]
    .filter(Boolean);

  await exec.exec("helm", helmArgs, opts.options);
  let deploys: string[] = opts.out.data.split('\n').filter(Boolean);
  for(let exclude of excludes) {
    const regExp = new RegExp(exclude);
    deploys = deploys.filter(deploy => { return  !regExp.test(deploy) });

  }
  const promises = [];
  for(let deploy of deploys) {
    helmArgs = [ helmVersion > 2 ? 'uninstall' : 'delete', deploy]
    .concat([helmVersion == 2 ? '--purge': '', ci.dryrun ? '--dry-run' : '']);
    if(helmVersion > 2) {
        helmArgs = helmArgs.concat(['--namespace', ci.namespace]);
    }
    promises.push(exec.exec("helm", helmArgs.filter(Boolean), opts.options));
  }
    await Promise.all(promises)
}