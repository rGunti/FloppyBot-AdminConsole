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
  description: string;
  aliases: string[];
  restrictedToInterfaces: string[];
  requiredPrivilegeLevel: PrivilegeLevel;
  customCommand: boolean;
  cooldown: CooldownInfo;
  syntax: CommandSyntax[];
  obsolete: boolean;
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
}
