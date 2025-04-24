import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatLabel, MatPrefix, MatSuffix } from '@angular/material/form-field';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  bootstrapBan,
  bootstrapCheckCircle,
  bootstrapFilter,
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
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatPrefix,
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
      bootstrapFilter,
    }),
  ],
  templateUrl: './command-list.component.html',
  styleUrl: './command-list.component.scss',
})
export class CommandListComponent implements AfterViewInit {
  readonly dataSource = new MatTableDataSource<CommandInfo>([]);
  readonly displayedColumns: string[] = ['enabled', 'name', 'restrictions', 'actions'];

  @Output() readonly disableCommand = new EventEmitter<CommandInfo>();
  @Output() readonly deleteCommand = new EventEmitter<CommandInfo>();
  @Output() readonly showCommandDetails = new EventEmitter<CommandInfo>();
  @Output() readonly editCommand = new EventEmitter<CommandInfo>();

  @Input({ required: true }) get commands(): CommandInfo[] {
    return this.dataSource.data;
  }
  set commands(commands: CommandInfo[] | null) {
    this.dataSource.data = commands || [];
  }

  @Input() allowDetail = true;
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
