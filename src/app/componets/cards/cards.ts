import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Food } from '../../models/food.model';

@Component({
  selector: 'app-cards',
  imports: [RouterLink],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Cards {
  readonly product = input.required<Food>();
}
