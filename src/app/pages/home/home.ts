import { Component } from '@angular/core';
import { About } from "../about/about";
import { Carousel } from "../../componets/carousel/carousel";

@Component({
  selector: 'app-home',
  imports: [ Carousel],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}
