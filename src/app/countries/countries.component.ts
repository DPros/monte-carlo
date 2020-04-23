import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import countries from "./countries.json"

@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.less']
})
export class CountriesComponent implements OnInit {

  size = 2000;

  squareArea = 0;
  countryArea;

  @ViewChild('canvas', {static: true}) canvas: ElementRef<HTMLCanvasElement>;

  countries: { properties: { ADMIN: string }, geometry: { coordinates: [number, number][][][], type: 'MultiPolygon' } | { type: 'Polygon', coordinates: [number, number][][] } }[] = countries as any;

  constructor() {

  }

  ngOnInit(): void {
    this.countries = this.countries.filter(_ => _.geometry.type === "Polygon")
  }

  onSelect(index: number) {
    const country = this.countries[index];
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height)

    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let xShift = 0;
    let yShift = 0;
    let xDelta: number;
    let yDelta: number;

    const normalize = () => {
      const lat = (minY + maxY) / 2
      if (minX < 0) {
        maxX += xShift = -minX;
        minX = 0;
      } else {
        xShift = -minX;
      }
      if (minY < 0) {
        maxY += yShift = -minY;
        minY = 0;
      } else {
        yShift = -minY;
      }
      this.squareArea = Math.abs((maxY - minY) * 111 * Math.cos(lat * Math.PI / 180) * 111.325 * (maxX - minX));

      xDelta = this.size / (maxX - minX);
      yDelta = this.size / (maxY - minY);
    }

    const findMinMax = (array: [number, number][]) => {
      array.forEach(([x, y]) => {
        if (x < minX) {
          minX = x;
        } else if (x > maxX) {
          maxX = x;
        }
        if (y < minY) {
          minY = y
        } else if (y > maxY) {
          maxY = y
        }
      })
    }

    const getNormalized = (([x, y]: [number, number]) => [Math.round((x + xShift) * xDelta), Math.round((y + yShift) * yDelta)])

    const drawPath = (array: [number, number][]) => {
      for (let i = 0; i < array.length; i++) {
        const [x, y] = getNormalized(array[i]);
        if (i === 0) {
          context.beginPath();
          context.moveTo(x, y);
        } else {
          context.lineTo(x, y);
        }
      }
      context.closePath()
      context.stroke();
    }

    if (country.geometry.type === "Polygon") {
      country.geometry.coordinates.forEach(_ => findMinMax(_))
      normalize();
      country.geometry.coordinates.forEach(_ => drawPath(_));
    } else {
      country.geometry.coordinates.forEach(parts => parts.forEach(_ => findMinMax(_)))
      normalize()
      country.geometry.coordinates.forEach(parts => parts.forEach(_ => drawPath(_)))
    }

    let ins = 0.;
    let total = 0.;

    let placedDots = 0;

    const placeDots = () => {
      const nDots = 10000;
      setTimeout(() => {
        for (let i = 0; i < nDots; i++) {
          ++total;
          const x = Math.random() * this.size;
          const y = Math.random() * this.size;
          const inside = context.isPointInPath(x, y);
          if (inside) {
            ++ins;
            context.fillStyle = "green"
          } else {
            context.fillStyle = "red"
          }
          context.fillRect(x, y, 1, 1)
        }
        this.countryArea = (ins / total * this.squareArea).toFixed(3);
        placedDots += nDots;
        if (total < Number.MAX_SAFE_INTEGER / 2) {
          placeDots()
        }
      })
    }

    placeDots();
  }
}
