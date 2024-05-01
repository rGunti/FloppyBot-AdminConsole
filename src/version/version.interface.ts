export interface Version {
  dirty: boolean;
  raw: string;
  hash: string;
  distance: string | null;
  tag: string | null;
  semver: string | null;
  suffix: string;
  semverString: string | null;
  version: string;
}
