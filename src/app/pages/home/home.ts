import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { About } from "../about/about";
import { Carousel } from "../../componets/carousel/carousel";

@Component({
  selector: 'app-home',
  imports: [Carousel, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {}

