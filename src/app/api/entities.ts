export interface Channel {
  interface: string;
  channel: string;
  alias?: string;
}

export interface FileHeader {
  id: string;
  channelId: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

export interface FileStorageQuota {
  channelId: string;
  maxStorageQuota: number;
  maxFileNumber: number;
  storageUsed: number;
  fileCount: number;
}

export interface Quote {
  id: string;
  channelMappingId: string;
  quoteId: number;
  quoteText: string;
  quoteContext?: string;
  createdAt: Date;
  createdBy: string;
}

export interface CommandInfo {
  name: string;
  description?: string;
  aliases: string[];
  restrictedToInterfaces: string[];
  requiredPrivilegeLevel: PrivilegeLevel;
  customCommand: boolean;
  cooldown: CooldownInfo;
  syntax: CommandSyntax[];
  obsolete: boolean;
  disabled?: boolean;
}

export declare type PrivilegeLevel = 'Unknown' | 'Viewer' | 'Moderator' | 'Administrator' | 'SuperUser';

export interface CommandSyntax {
  syntax: string;
  purpose: string;
  examples: string[];
}

export interface CooldownInfo {
  cooldownMode: string;
  defaultCooldown?: number;
  modCooldown?: number;
  adminCooldown?: number;
}

export interface UserReport {
  userId: string;
  ownerOf: string[];
  channelAliases: { [key: string]: string };
  permissions: string[];
  apiKeyCreatedAt?: Date | string;
}

export interface ApiKeyReport {
  accessKey?: string;
}

export interface CooldownConfiguration {
  privilegeLevel: PrivilegeLevel;
  cooldownMs: number;
}

export interface CommandConfiguration {
  id: string;
  channelId: string;
  commandName: string;
  requiredPrivilegeLevel?: PrivilegeLevel;
  disabled: boolean;
  customCooldown: boolean;
  customCooldownConfiguration: CooldownConfiguration[];
}

export declare type CommandParameterType = 'String' | 'Number' | 'Enum';

export interface CommandParameterAbstract {
  order: number;
  name: string;
  type: CommandParameterType;
  required: boolean;
  description?: string;
  possibleValues?: string[];
}

export interface CommandAbstract {
  name: string;
  aliases: string[];
  description?: string;
  minPrivilegeLevel?: PrivilegeLevel;
  availableOnInterfaces: string[];
  syntax?: string[];
  noParameters: boolean;
  hidden: boolean;
  parameters?: CommandParameterAbstract[];
}

export interface CommandReport {
  command: CommandAbstract;
  configuration: CommandConfiguration;
}
