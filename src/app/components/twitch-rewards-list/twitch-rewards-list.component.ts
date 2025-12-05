import { DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import {
  bootstrapBan,
  bootstrapCheckCircle,
  bootstrapCoin,
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

import { ChannelReward } from '../../api/entities';
import { ListPipe } from '../../utils/list.pipe';
import { sortData } from '../../utils/sort';
import { CommandRestrictionsComponent } from '../command-restrictions/command-restrictions.component';

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
    CommandRestrictionsComponent,
    ListPipe,
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
    }),
  ],
  templateUrl: './twitch-rewards-list.component.html',
  styleUrl: './twitch-rewards-list.component.scss',
})
export class TwitchRewardsListComponent implements AfterViewInit {
  readonly dataSource = new MatTableDataSource<ChannelReward>([]);
  readonly displayedColumns: string[] = ['status', 'title', 'cost', 'actions'];

  // @Output() readonly disableCommand = new EventEmitter<ChannelReward>();
  // @Output() readonly deleteCommand = new EventEmitter<ChannelReward>();
  // @Output() readonly showCommandDetails = new EventEmitter<ChannelReward>();
  // @Output() readonly editCommand = new EventEmitter<ChannelReward>();

  @Input({ required: true }) get rewards(): ChannelReward[] {
    return this.dataSource.data;
  }
  set rewards(rewards: ChannelReward[] | null) {
    this.dataSource.data = rewards || [];
  }

  @Input() channelId: string | null = null;

  // @Input() allowDetail = true;
  // @Input() allowDelete = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortData = (data: ChannelReward[], sort: Sort) => sortData(data, sort);
  }
}
