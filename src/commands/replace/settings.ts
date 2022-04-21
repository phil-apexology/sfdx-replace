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
import { Replacement } from '../../models/replacement';

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
      this.processPathReplacements(setting.path, setting.replacements, null);
    }
  }

  private processPathReplacements(dir: string, replacements: Replacement[], filesIn: string[]): void {
    let files: string[] = [];
    if (filesIn !== null) {
      files = filesIn;
    }
    const currentDirectoryFiles = fs.readdirSync(dir);
    for (const file of currentDirectoryFiles) {
      const name = dir + '/' + file;
      // eslint-disable-next-line no-console
      console.log('processing: ' + name);
      if (fs.statSync(name).isDirectory()) {
        this.processPathReplacements(name, replacements, files);
      } else {
        this.processFileReplacements(name, replacements);
      }
    }
  }

  private processFileReplacements(name: string, replacements: Replacement[]): void {
    fs.readFile(name, 'utf8', (readError, data) => {
      if (readError) {
        // eslint-disable-next-line no-console
        return console.log(readError);
      }

      let result = data;
      for (const replacement of replacements) {
        result = result.replace(replacement.key, replacement.value);
        if (data.indexOf(replacement.key) > -1) {
          // eslint-disable-next-line no-console
          console.log('replaced: ' + replacement.key + ' with: ' + replacement.value);
        } else {
          // eslint-disable-next-line no-console
          console.log('replacement: ' + replacement.key + ' not found.');
        }
      }

      if (data === result) {
        // eslint-disable-next-line no-console
        console.log('no replacements processed for file: ' + name);
        return;
      }

      fs.writeFile(name, result, 'utf8', (writeError) => {
        // eslint-disable-next-line no-console
        if (writeError) return console.log(writeError);
        // eslint-disable-next-line no-console
        console.log('writing: ' + name);
      });
    });
  }
}
