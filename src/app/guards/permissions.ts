export enum Permissions {
  ReadCommands = 'read:commands',
  ReadBot = 'read:bot',
  RestartBot = 'restart:bot',
  ReadQuotes = 'read:quotes',
  EditQuotes = 'edit:quotes',
  ReadCustomCommands = 'read:custom-commands',
  EditCustomCommands = 'edit:custom-commands',
  ReadConfig = 'read:config',
  EditConfig = 'edit:config',
  ReadFiles = 'read:files',
  EditFiles = 'edit:files',
  ReadLogs = 'read:logs',
  ReadAudit = 'read:audit',

  /** This role is not assigned to anyone */
  NoOne = 'no:one',
}

export const ADMIN_PERMISSIONS: readonly Permissions[] = [Permissions.ReadLogs, Permissions.ReadAudit] as const;
