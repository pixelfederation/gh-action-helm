
import * as exec from "@actions/exec";
import { getCommonInputs } from "./input-helper";
import { ICommonInputs } from "./ICommonInputs";


export function getExecOpts(opt: object): object {

  const options = opt;
  const out = { data: ""};
  const err = { data: ""};
  options.listeners = {
    stdout: (data: Buffer) => {
      out.data += data.toString();
    },
    stderr: (data: Buffer) => {
      err.data += data.toString();
    },
  };
  return {out: out, err: err, options: options}
}

export async function getHelmVersion(): Promise<number> {
    const ci: ICommonInputs = await getCommonInputs();
    let version: number;

    const opts = getExecOpts({cwd: ci.dir, env: {'KUBECONFIG': ci.kubeconfig}});
    try {
        await exec.exec("helm", ["version", "--client"], opts.options);
        version = Number(opts.out.data.match(/v([0-9])[.]/)[1]);
    } catch (err) {
        throw new Error('Failed to parse helm version, err: ' + err.toString());
    }
    if(isNaN(version)) {
        throw new Error('Failed to parse helm version ' + version);
    }
    return version;
}