---
title: "Update Dependencies"
linkTitle: "Update Dependencies"
weight: 8
aliases: >
  /core/guides/update-dependencies
  /contribute/code/core/update-dependencies
---

{{< hextra/hero-subtitle >}}
  Process for updating dependencies
{{< /hextra/hero-subtitle >}}

Every minor release we update dependencies to get the latest fixes and improvements. We do this early in the release cycle so that we have some more time to find regressions and issues. This is done on all folders with a `package-lock.json`, including:

{{< filetree/container >}}
  {{< filetree/folder name="cht-core" >}}
    {{< filetree/file name="/(root)" >}}
    {{< filetree/folder name="admin" >}}
    {{< /filetree/folder >}}
    {{< filetree/folder name="webapp" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
{{< /filetree/container >}}

## Steps

1. Checkout and pull the latest default branch - get the latest code
2. Make a branch: `git checkout -b "<issue>-update-dependencies"`
3. Take a look at the current [list of dependencies related issues](https://github.com/medic/cht-core/issues?q=is%3Aopen+is%3Aissue+label%3ADependencies), where you can find the latest conversations and information. 

Then for each folder go through these steps.

1. `npm ci` - update your local node_modules to match expected
2. `npm outdated` - report on any dependencies which aren't at the latest
3. `npm install --save[-dev] package@version` - install the latest version (be careful and read the release notes if the new version is a major change from the current)
4. `npm dedupe` - remove duplicated dependencies
5. `npm audit fix` - automatically fix any nested dependencies with vulnerabilities
6. `npm audit` - get a report on any remaining vulnerabilities and manually scan it to see if there's anything else you can do

## Problems

- See [issue #9770](https://github.com/medic/cht-core/issues/9770) for a list of the known dependencies that cannot be upgraded further because their latest versions only support ES Modules.
- Don't update `bootstrap` to 4+ as it has many breaking changes. One day we will either raise an issue to upgrade it or migrate off it, but that is outside the scope of this change.
- Don't update `bootstrap-daterangepicker`.
- Don't update the `webapp` version of `jquery` to 3.6.0+ as the `select2` search input loses focus on click event, this is a [known issue](https://github.com/select2/select2/issues/5993) in their repository.
    - Note that the `webapp` webpack config is aliasing the `jquery` package to make sure we only bundle one version of jquery. Currently `enketo-core` is targeting `3.6.3`, but we cannot take that version because of this select2 issue.
    - This select2 issue is actually resolved by upgrading to jquery `3.7+`, but we cannot move to that version because it is not compatible with our current version of enketo-core (`7.2.5`).
- If you have trouble upgrading any other dependency and you think it'll be challenging to fix it then raise a new issue with `Dependencies` tag, to upgrade just that dependency. Don't hold up all the other upgrades you've made.

## Troubleshooting

{{% details title="Angular exception"  closed="true" %}}

When upgrading Webapp's Angular, you might get the following exception:
```
Running "exec:build-webapp" (exec) task
________________________________________
An unhandled exception occurred: Class extends value undefined is not a constructor or null
see "/private/var/folders/tx/lskdwi/T/ng-23kdi/angular-errors.log" for further details.
>> Exited with code: 127
```
This error is thrown by the Webpack's subresource integrity. It's likely that `@angular/compiler`, `@angular-devkit/build-angular` or `@angular-builders/custom-webpack` aren't resolved properly in the `package-lock.json`.

To fix it, uninstall these 3 dependencies and then install them again in this order:
1. `@angular/compiler`
2. `@angular-devkit/build-angular`
3. `@angular-builders/custom-webpack`

If the error is still happening, try reinstalling `@angular/cli`.

{{% /details %}}

{{% details title="npm errno -17" closed="true" %}}

If `npm ci` errors with "errno -17" in shared-libs you may need to manually remove the nested dependencies from the package-lock.json. This needs move investigation to work out why this is happening.

{{% /details %}}

{{% details title="select2 is not a function"  closed="true" %}}

If you get `TypeError: "$(...).select2 is not a function"` then either:
1. You bumped select2. For some reason this breaks it.
2. You have multiple jquery libraries and select2 is getting attached to one but not the other. Make sure the jquery versions in enketo-core and webapp match and you've `run dedupe` to remove the enketo-core copy.

{{% /details %}}
