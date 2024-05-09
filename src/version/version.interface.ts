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

export function calculateDisplayVersion(version: Version | null): string {
  if (!version) {
    return 'unknown';
  }

  if (version.semverString) {
    return version.semverString;
  }

  if (version.raw) {
    return version.raw;
  }

  return version.version;
}
