# helm GitHub Actions

This repo provides a collection of helm related actions for use in your
workflows.

## Description

Helm upgrade

## Inputs

| parameter | description | required | default | type |
| - | - | - | - | - |
| namespace | K8s namespace to use | `true` |  | string |
| release | Helm relsese name | `true` |  | string |
| kubeconfig | Path to kubeconfig | `false` |  | string |
| dir | Working directory | `false` | . | string |
| chart | Helm chart | `true` |  | string |
| version | Helm chart version | `true` |  | string |
| files | Helm values files | `false` |  | list |
| set | Helm values set | `false` |  | map |
| timeout | Helm deploy timeout | `false` | 600 | int |
| atomic | Helm deploy atomic | `false` | true | bool |
| wait | Helm deploy wait | `false` | true | bool |
| install | Helm deploy install | `false` | true | bool |
| dryrun | Helm deploy with dry run | `false` | false | bool |


## Example
```yml
- name: Helm upgrade
  id: helm-upgrade
  uses: ./upgrade
  with:
    namespace: echoheaders
    release: "tombotest"
    chart: "tom"
    version: "0.0.1"
    wait: false # optional
    dryrun: true # optional
    atomic: false # optional
    kubeconfig: /root/.kube/config # optional
    files: | # list is defined as value per line
      foo.yaml
      bar.yaml
    set: | # map is defined as key,val pipe delimited for each line
      service.selector.app | projectName
      service.selector.appVersion | deploymentName 
      service.selector[0].release | deploymentName 
      buildLabels.jenkinsBuildJobName | ${{ steps.justvar.outputs.JUST_VARIABLE }}
      buildLabels.jenkinsBuildID | ${{ matrix.os }}
```

