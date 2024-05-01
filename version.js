const { gitDescribeSync } = require('git-describe');
const { version } = require('./package.json');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs');

const gitInfo = gitDescribeSync({
  dirtyMark: false,
  dirtySemver: false
});

gitInfo.version = version;

const srcDir = resolve(__dirname, 'src');
const jsonAsset = resolve(srcDir, 'assets', 'version.json');
console.log('Writing JSON version info to', jsonAsset);
writeFileSync(jsonAsset, JSON.stringify(gitInfo, null, 4), { encoding: 'utf-8' });

const tsFile = resolve(srcDir, 'version', 'version.ts');
console.log('Writing TS version info to', tsFile);
writeFileSync(tsFile,
`// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT OR CHECKIN!
/* tslint:disable */
import { Version } from "./version.interface";
export const VERSION = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });
