import * as core from "@actions/core";
import {ICommonInputs} from "./ICommonInputs";


const DEFAULT_KUBECONFIG_PATH = process.env.HOME + "/.kube/config";

export async function getCommonInputs(): Promise<ICommonInputs> {
    const result = ({} as unknown) as ICommonInputs;
    result.kubeconfig = core.getInput('kubeconfig', { required: false }) || DEFAULT_KUBECONFIG_PATH;
    result.namespace = core.getInput('namespace', { required: true });
    result.dir = core.getInput('directory', { required: false });
    result.dryrun = core.getBooleanInput('dryrun', { required: false });
    return result;
}
