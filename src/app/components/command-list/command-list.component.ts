import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapBan,
  bootstrapCheckCircle,
  bootstrapPencil,
  bootstrapPower,
  bootstrapSearch,
  bootstrapTrash,
  bootstrapXCircle,
  bootstrapXLg,
} from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';

import { CommandInfo } from '../../api/entities';
import { ListPipe } from '../../utils/list.pipe';
import { CommandRestrictionsComponent } from '../command-restrictions/command-restrictions.component';

@Component({
  selector: 'fac-command-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatTooltipModule,
    CommandRestrictionsComponent,
    ListPipe,
  ],
  providers: [
    provideIcons({
      bootstrapSearch,
      bootstrapPencil,
      bootstrapTrash,
      bootstrapCheckCircle,
      bootstrapXCircle,
      bootstrapXLg,
      bootstrapBan,
      bootstrapPower,
    }),
  ],
  templateUrl: './command-list.component.html',
  styleUrl: './command-list.component.scss',
})
export class CommandListComponent implements AfterViewInit {
  readonly dataSource = new MatTableDataSource<CommandInfo>([]);
  readonly displayedColumns: string[] = ['enabled', 'name', 'restrictions', 'actions'];

  @Output() readonly disableCommand = new EventEmitter<CommandInfo>();
  @Output() readonly showCommandDetails = new EventEmitter<CommandInfo>();

  @Input({ required: true }) get commands(): CommandInfo[] {
    return this.dataSource.data;
  }
  set commands(commands: CommandInfo[] | null) {
    this.dataSource.data = commands || [];
  }

  @Input() allowDelete = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDetailTooltip(command: CommandInfo): string {
    return `Show more about "${command.name}"`;
  }

  getEditTooltip(command: CommandInfo): string {
    return `Edit "${command.name}"`;
  }

  getDisableTooltip(command: CommandInfo): string {
    return `${command.disabled ? 'Enable' : 'Disable'} "${command.name}"`;
  }

  getDeleteTooltip(command: CommandInfo): string {
    return `Delete "${command.name}"`;
  }
}
