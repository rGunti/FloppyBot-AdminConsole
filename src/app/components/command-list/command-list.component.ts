import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { CommandInfo } from '../../api/entities';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommandRestrictionsComponent } from '../command-restrictions/command-restrictions.component';
import { ListPipe } from '../../utils/list.pipe';
import {
  bootstrapBan,
  bootstrapCheckCircle,
  bootstrapPencil,
  bootstrapSearch,
  bootstrapTrash,
  bootstrapXCircle,
} from '@ng-icons/bootstrap-icons';

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
      bootstrapBan,
    }),
  ],
  templateUrl: './command-list.component.html',
  styleUrl: './command-list.component.scss',
})
export class CommandListComponent implements AfterViewInit {
  readonly dataSource = new MatTableDataSource<CommandInfo>([]);
  readonly displayedColumns: string[] = ['enabled', 'name', 'restrictions', 'actions'];

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
    return `Show more about ${command.name}`;
  }

  getEditTooltip(command: CommandInfo): string {
    return `Edit ${command.name}`;
  }

  getDisableTooltip(command: CommandInfo): string {
    return `Disable ${command.name}`;
  }

  getDeleteTooltip(command: CommandInfo): string {
    return `Delete ${command.name}`;
  }
}
