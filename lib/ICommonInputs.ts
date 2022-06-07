export interface ICommonInputs {
    /**
     * K8s namespace to use
     */
    namespace: string;
    /**
     * Helm release name
     */
    release: string;
    /**
     * Kubeconfig path
     */
    kubeconfig: string;
    /**
     * Working directory
     */
    dir: string;
}
