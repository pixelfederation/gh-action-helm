import { getCommonInputs } from "../input-helper";
import { getHelmVersion, getExecOpts } from "../helm-helper";
import { ICommonInputs } from "../ICommonInputs";
import * as core from "@actions/core";
import * as exec from "@actions/exec";

export async function helmUpgrade(): Promise<void> {

  const ci: ICommonInputs = await getCommonInputs();

  let helmVersion: number = await getHelmVersion();

  const release = core.getInput('release', { required: true });
  const chart:string = core.getInput('chart', { required: true });
  const version:string = core.getInput('version', { required: true });
  const files: string[] = core.getMultilineInput('files', { required: false });
  const set: string[] = core.getMultilineInput('set', { required: false });
  let timeout: string = core.getInput('timeout', { required: false });
  const atomic: boolean = core.getBooleanInput('atomic', { required: false });
  const wait: boolean = core.getBooleanInput('wait', { required: false });
  const install: boolean = core.getBooleanInput('install', { required: false });
  const opts = getExecOpts({cwd: ci.dir, env: {'KUBECONFIG': ci.kubeconfig}});

  const setString: string = set.map(item=> { return item.split('|')
    .map(it=> { return it.trim() })
    .join('=')})
    .join(',');

  let filesList = files.map(item=> {return ['-f', item.trim()]}).flat();

  if (helmVersion > 2) {
    timeout = timeout + 's'
  }
  const helmArgs: string[] = ['upgrade', release, chart, '--version', version]
    .concat(filesList)
    .concat(['--set', setString.length > 0 ? setString : ''])
    .concat(['--namespace', ci.namespace, '--timeout', timeout])
    .concat([
      atomic ? '--atomic' : '',
      install ? '--install' : '',
      wait ? '--wait' : '',
      ci.dryrun ? '--dry-run' : '',
    ])
    .filter(Boolean);

  await exec.exec("helm", helmArgs, opts.options);
}
