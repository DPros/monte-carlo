import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-formula',
  templateUrl: './function.component.html',
  styleUrls: ['./function.component.less']
})
export class FunctionComponent implements OnInit {

  form = new FormGroup({
    from: new FormControl(null, Validators.required),
    to: new FormControl(null, Validators.required),
    where: new FormControl(null, Validators.required)
  })

  res = 0;

  func(x) {
    return Math.cos(x)
  }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(({from, to, where}) => {
      if (this.form.valid) {
        let max = Number.NEGATIVE_INFINITY;
        let min = Number.POSITIVE_INFINITY;
        for (let i = from; i <= to; i += 0.1) {
          const y = this.func(i);
          console.log(i + " " + y);
          if (y > max) {
            max = y
          } else if (y < min) {
            min = y;
          }
        }
        let xShift, yShift, width, height;
        if (from < 0) {
          xShift = -from;
          from = 0;
          to += xShift;
          width = to;
        } else {
          xShift = 0;
          width = to - from;
        }
        if (min < 0) {
          yShift = -min;
          min = 0;
          max += yShift;
          height = max;
        } else {
          yShift = 0;
          height = max - min
        }

        let ins = 0.;

        for (let i = 0; i < 1000; i++) {
          const x = Math.random() * width - xShift;
          const y = Math.random() * height - yShift;
          const calcY = this.func(x);
          if (where === "above") {
            if (y > calcY) {
              ++ins
            }
          } else if (y < calcY) {
            ++ins
          }
        }
        this.res = ins / 1000 * width * height
      }
    })
  }


}
