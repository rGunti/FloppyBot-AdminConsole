export interface Version {
  dirty: boolean;
  raw: string;
  hash: string;
  distance: number | null;
  tag: string | null;
  semver: string | null;
  suffix: string;
  semverString: string | null;
  version: string;
  buildTime: string;
  buildEnv: Record<string, string>;
}
