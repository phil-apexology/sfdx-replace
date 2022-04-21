sfdx-replace
============

Uses setting files to look for values and replace them in files. Useful for replacing endpoints / email addresses when deploying between environments

[![Version](https://img.shields.io/npm/v/sfdx-replace.svg)](https://npmjs.org/package/sfdx-replace)
[![CircleCI](https://circleci.com/gh/https://github.com/phil-apexology/sfdx-replace//tree/master.svg?style=shield)](https://circleci.com/gh/https://github.com/phil-apexology/sfdx-replace//tree/master)
[![Appveyor CI](https://ci.appveyor.com/api/projects/status/github/https://github.com/phil-apexology/sfdx-replace/?branch=master&svg=true)](https://ci.appveyor.com/project/heroku//branch/master)
[![Greenkeeper](https://badges.greenkeeper.io/https://github.com/phil-apexology/sfdx-replace/.svg)](https://greenkeeper.io/)
[![Known Vulnerabilities](https://snyk.io/test/github/https://github.com/phil-apexology/sfdx-replace//badge.svg)](https://snyk.io/test/github/https://github.com/phil-apexology/sfdx-replace/)
[![Downloads/week](https://img.shields.io/npm/dw/sfdx-replace.svg)](https://npmjs.org/package/sfdx-replace)
[![License](https://img.shields.io/npm/l/sfdx-replace.svg)](https://github.com/https://github.com/phil-apexology/sfdx-replace//blob/master/package.json)

<!-- toc -->
* [Debugging your plugin](#debugging-your-plugin)
<!-- tocstop -->
<!-- install -->
<!-- usage -->
```sh-session
$ npm install -g sfdx-replace
$ sfdx COMMAND
running command...
$ sfdx (-v|--version|version)
sfdx-replace/0.0.4 win32-x64 node-v16.7.0
$ sfdx --help [COMMAND]
USAGE
  $ sfdx COMMAND
...
```
<!-- usagestop -->
<!-- commands -->
* [`sfdx replace:settings [-i <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`](#sfdx-replacesettings--i-string---json---loglevel-tracedebuginfowarnerrorfataltracedebuginfowarnerrorfatal)

## `sfdx replace:settings [-i <string>] [--json] [--loglevel trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]`

process replacements in source files

```
USAGE
  $ sfdx replace:settings [-i <string>] [--json] [--loglevel 
  trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL]

OPTIONS
  -i, --input=input                                                                 the input settings file name
  --json                                                                            format output as json

  --loglevel=(trace|debug|info|warn|error|fatal|TRACE|DEBUG|INFO|WARN|ERROR|FATAL)  [default: warn] logging level for
                                                                                    this command invocation

EXAMPLE
  sfdx replace:settings --input ./buildfiles/environments/uat/settings.json
```

_See code: [src/commands/replace/settings.ts](https://github.com/phil-apexology/sfdx-replace/blob/v0.0.4/src/commands/replace/settings.ts)_
<!-- commandsstop -->
<!-- debugging-your-plugin -->
# Debugging your plugin
We recommend using the Visual Studio Code (VS Code) IDE for your plugin development. Included in the `.vscode` directory of this plugin is a `launch.json` config file, which allows you to attach a debugger to the node process when running your commands.

To debug the `hello:org` command: 
1. Start the inspector
  
If you linked your plugin to the sfdx cli, call your command with the `dev-suspend` switch: 
```sh-session
$ sfdx hello:org -u myOrg@example.com --dev-suspend
```
  
Alternatively, to call your command using the `bin/run` script, set the `NODE_OPTIONS` environment variable to `--inspect-brk` when starting the debugger:
```sh-session
$ NODE_OPTIONS=--inspect-brk bin/run hello:org -u myOrg@example.com
```

2. Set some breakpoints in your command code
3. Click on the Debug icon in the Activity Bar on the side of VS Code to open up the Debug view.
4. In the upper left hand corner of VS Code, verify that the "Attach to Remote" launch configuration has been chosen.
5. Hit the green play button to the left of the "Attach to Remote" launch configuration window. The debugger should now be suspended on the first line of the program. 
6. Hit the green play button at the top middle of VS Code (this play button will be to the right of the play button that you clicked in step #5).
<br><img src=".images/vscodeScreenshot.png" width="480" height="278"><br>
Congrats, you are debugging!
