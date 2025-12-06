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
  description?: string | null;
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
  requiredPrivilegeLevel?: PrivilegeLevel | null;
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
  description?: string | null;
  possibleValues?: string[];
}

export interface CommandAbstract {
  name: string;
  aliases: string[];
  description?: string | null;
  minPrivilegeLevel?: PrivilegeLevel;
  availableOnInterfaces: string[];
  syntax?: string[];
  noParameters: boolean;
  hidden: boolean;
  parameters?: CommandParameterAbstract[];
  allMetadata: Record<string, string>;
}

export interface CommandReport {
  command: CommandAbstract;
  configuration: CommandConfiguration | null;
}

export interface CustomCommand {
  id: string;
  name: string;
  aliases: string[];
  responses: CommandResponse[];
  limitations: CommandLimitation;
  responseMode: CommandResponseMode;
  allowCounterOperations: boolean;
  counter?: CounterValue;
}

export interface CommandResponse {
  type: CommandResponseType;
  content: string;
  auxiliaryContent?: string | null;
  sendAsReply: boolean;
}

export interface CommandLimitation {
  minLevel: PrivilegeLevel;
  cooldown: CooldownDescription[];
  limitedToUsers: string[];
}

export interface CooldownDescription {
  level: PrivilegeLevel;
  milliseconds: number;
}

export declare type CommandResponseMode = 'First' | 'PickOneRandom' | 'All';
export declare type CommandResponseType = 'Text' | 'Sound' | 'Visual';

export interface CounterValue {
  value: number;
}

export interface ShoutoutCommandConfig {
  message: string;
  teamMessage: string;
}

export interface TimerMessageConfig {
  channelId: string;
  messages: string[];
  interval: number;
  minMessages: number;
}

export interface LogRecord {
  id: string;
  timestamp: Date;
  level: LogLevel;
  messageTemplate: string;
  renderedMessage: string;
  service: LogRecordService;
  context: string;
  exception?: string;
  properties?: Record<string, string>;
}

export interface LogRecordService {
  assemblyName: string;
  assemblyVersion: string;
  assemblyInformationalVersion: string;
  instanceName?: string;
}

export enum LogLevel {
  Verbose = 'Verbose',
  Debug = 'Debug',
  Information = 'Information',
  Warning = 'Warning',
  Error = 'Error',
  Fatal = 'Fatal',
}

export interface LogRecordSearchParameters {
  minTime?: Date;
  maxTime?: Date;

  minLevel?: LogLevel;
  maxLevel?: LogLevel;

  hasException?: boolean;

  context?: string[];
  service?: string[];
  instanceName?: string[];
  messageTemplate?: string[];

  excludeContext?: string[];
  excludeService?: string[];
  excludeInstanceName?: string[];
  excludeMessageTemplate?: string[];

  includeProperties?: boolean;
  maxRecords?: number;
}

export interface LogStats {
  totalCount: number;
  oldestLogEntry?: string;
  newestLogEntry?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: Date;
  userIdentifier: string;
  channelIdentifier: string;
  objectType: string;
  objectIdentifier: string;
  action: string;
  additionalData: string;
}

export interface TwitchAuthenticationStart {
  loginUrl: string;
}

export interface TwitchAuthenticationConfirm {
  sessionId: string;
  code: string;
}

export interface ChannelReward {
  id: string;
  title: string;
  cost: number;
  isEnabled: boolean;
  isPaused: boolean;
}

export interface TwitchReward {
  reward: ChannelReward;
  linkedCommand?: CustomCommand | null;
}
