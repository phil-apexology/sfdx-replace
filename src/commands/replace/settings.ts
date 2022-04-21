/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
import * as os from 'os';
import * as fs from 'fs';
import { flags, SfdxCommand } from '@salesforce/command';
import { Messages } from '@salesforce/core';
import { Setting } from '../../models/setting';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('sfdx-replace', 'settings');

export default class Settings extends SfdxCommand {
  public static description = messages.getMessage('commandDescription');

  public static examples = messages.getMessage('examples').split(os.EOL);

  public static args = [{ name: 'file' }];

  protected static flagsConfig = {
    // flag with a value (-i, --input=VALUE)
    input: flags.string({
      char: 'i',
      description: messages.getMessage('inputFlagDescription'),
    }),
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = false;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = false;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<any> {
    const settingsFile = fs.readFileSync(this.flags.input, { encoding: 'utf-8' });
    const settings: Setting[] = JSON.parse(settingsFile);
    this.processReplacements(settings);
  }

  private processReplacements(settings: Setting[]): void {
    for (const setting of settings) {
      this.processReplacement(setting);
    }
  }

  private processReplacement(setting: Setting): void {
    for (const replacement of setting.replacements) {
      this.processReplacementDir(setting.path, replacement.key, replacement.value, null);
    }
  }

  private processReplacementDir(dir: string, key: string, value: string, filesIn: string[]): void {
    let files: string[] = [];
    if (filesIn !== null) {
      files = filesIn;
    }
    const currentDirectoryFiles = fs.readdirSync(dir);
    for (const file of currentDirectoryFiles) {
      const name = dir + '/' + file;
      if (fs.statSync(name).isDirectory()) {
        this.processReplacementDir(name, key, value, files);
      } else {
        fs.readFile(name, 'utf8', (readError, data) => {
          if (readError) {
            // eslint-disable-next-line no-console
            return console.log(readError);
          }
          const searchKey = '/{{' + key + '}}/g';
          const result = data.replace(searchKey, value);

          fs.writeFile(name, result, 'utf8', (writeError) => {
            // eslint-disable-next-line no-console
            if (writeError) return console.log(writeError);
          });
        });
      }
    }
  }
}
