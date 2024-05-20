import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CalendarViewComponent } from '../../components/calendar-view/calendar-view.component';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [CalendarViewComponent],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoComponent {}
