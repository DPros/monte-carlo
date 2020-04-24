import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CountriesComponent} from "./countries/countries.component";
import {FunctionComponent} from "./function/function.component";

const routes: Routes = [
  {path: "countries", component: CountriesComponent},
  {path: "function", component: FunctionComponent},
  {path: "**", redirectTo: "countries"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
