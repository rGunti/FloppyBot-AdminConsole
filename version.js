const { gitDescribeSync } = require('git-describe');
const { resolve, relative } = require('path');
const { writeFileSync } = require('fs');

const gitInfo = {
  ...JSON.parse(JSON.stringify(gitDescribeSync({
    dirtyMark: false,
    dirtySemver: false
  }))),
  version: require('./package.json').version,
  buildTime: new Date().toISOString(),
  buildEnv: {
    node: `${process.versions.node}-${process.arch}-${process.platform}`,
    typescript: require('typescript').version,
    angular: require('@angular/core/package.json').version,
    angularMaterial: require('@angular/material/package.json').version,
    ngIcons: require('@ng-icons/core/package.json').version,
  },
};

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
export const VERSION: Version = ${JSON.stringify(gitInfo, null, 4)};
/* tslint:enable */
`, { encoding: 'utf-8' });

console.log('Version info written', gitInfo);
