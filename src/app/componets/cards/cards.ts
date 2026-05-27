import { Component } from '@angular/core';
import { Input } from '@angular/core';
import {  RouterLink } from '@angular/router';

@Component({
  selector: 'app-cards',
  imports: [RouterLink],
  templateUrl: './cards.html',
  styleUrl: './cards.css',
})
export class Cards {
  @Input() product: any;
}
