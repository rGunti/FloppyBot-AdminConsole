import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, computed, EventEmitter, Input, input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  bootstrapBan,
  bootstrapCheckCircle,
  bootstrapCoin,
  bootstrapCommand,
  bootstrapFilter,
  bootstrapLink45deg,
  bootstrapPauseBtn,
  bootstrapPencil,
  bootstrapPower,
  bootstrapSearch,
  bootstrapTrash,
  bootstrapX,
  bootstrapXCircle,
  bootstrapXLg,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { ChannelReward, CommandInfo, TwitchReward } from '../../api/entities';
import { PropertyMapping, sortAliasedData, sortData } from '../../utils/sort';

@Component({
  selector: 'fac-twitch-rewards-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatPrefix,
    MatSuffix,
    DecimalPipe,
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    RouterLink,
    MatMenuModule,
  ],
  providers: [
    provideIcons({
      bootstrapSearch,
      bootstrapPencil,
      bootstrapTrash,
      bootstrapCheckCircle,
      bootstrapXCircle,
      bootstrapX,
      bootstrapXLg,
      bootstrapBan,
      bootstrapPower,
      bootstrapFilter,
      bootstrapPauseBtn,
      bootstrapCoin,
      bootstrapLink45deg,
      bootstrapCommand,
    }),
  ],
  templateUrl: './twitch-rewards-list.component.html',
  styleUrl: './twitch-rewards-list.component.scss',
})
export class TwitchRewardsListComponent implements AfterViewInit {
  private readonly mapping: PropertyMapping<TwitchReward> = {
    status: (reward: TwitchReward) =>
      reward.reward.isEnabled ? (reward.reward.isPaused ? 'paused' : 'enabled') : 'disabled',
    title: (reward: TwitchReward) => reward.reward.title,
    cost: (reward: TwitchReward) => reward.reward.cost,
    linkedCommandName: (reward: TwitchReward) => reward.linkedCommand?.name,
  };

  readonly dataSource = new MatTableDataSource<TwitchReward>([]);
  readonly displayedColumns: string[] = ['status', 'title', 'cost', 'linkedCommandName', 'actions'];

  @Output() readonly linkRewardCommand = new EventEmitter<[ChannelReward, CommandInfo]>();
  @Output() readonly unlinkRewardCommand = new EventEmitter<ChannelReward>();

  @Input({ required: true }) get rewards(): TwitchReward[] {
    return this.dataSource.data;
  }
  set rewards(rewards: TwitchReward[] | null) {
    this.dataSource.data = rewards || [];
  }

  readonly customCommands = input<CommandInfo[]>([]);

  @Input() channelId: string | null = null;

  readonly sortedCommands = computed(() => {
    const commands = this.customCommands().filter(
      (c) => c.restrictedToInterfaces.length === 0 || c.restrictedToInterfaces.includes('Twitch'),
    );
    return sortData(commands, { active: 'name', direction: 'asc' });
  });

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = (data: TwitchReward[], sort: Sort) => sortAliasedData(data, sort, this.mapping);
  }

  linkCommand(reward: ChannelReward, command: CommandInfo) {
    this.linkRewardCommand.emit([reward, command]);
  }
}
