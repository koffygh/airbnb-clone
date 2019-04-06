import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { FormBuilder, FormArray, FormControl, FormGroup } from '@angular/forms';
import { DataService } from './data.service';
import { map, tap } from 'rxjs/operators';
declare var UIkit: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  @ViewChild('homeTypeFilter') homeTypeFilter;
  title = 'airbnb-clone';
  homeTypeFilters = [
    { name: 'Entire apartment', description: 'Have the whole place to yourself', selected: false },
    { name: 'Private room', description: 'Your own room with shared common spaces', selected: false },
    { name: 'Tree house', description: 'Enjoy an entire tree house with your friends', selected: false },
    { name: 'Hotel room', description: 'Private or shared room in a hotel', selected: false }
  ];
  listings$: Observable<{}>;
  form: FormGroup;
  filterBarState$ = new BehaviorSubject({ homeType: { open: false, selected: false } });

  constructor(private dataService: DataService, private fb: FormBuilder) {}

  ngOnInit() {
    this.listings$ = this.dataService.getListings$();
    this.dataService.loadListings([]);
    this.form = this.fb.group({
      homeTypeFilters: new FormArray(this.homeTypeFilters.map(filter => new FormControl(false)))
    });
  }

  parseStars(stars: number) {
    const result = [0, 0, 0, 0, 0];

    for (let i = 0; i <= stars; i++) {
      result[i] = 1;
    }

    return result;
  }

  toggleFilterDropdown(filter: string) {
    const filters = this.filterBarState$.getValue();
    filters[filter].open = !filters[filter].open;
    this.filterBarState$.next(filters);
  }

  closeFilterDropdown(filter: string) {
    const filters = this.filterBarState$.getValue();
    filters[filter].open = false;
    this.filterBarState$.next(filters);
  }

  markFilterSelected(filter: string) {
    const filters = this.filterBarState$.getValue();
    filters[filter].selected = true;
    this.filterBarState$.next(filters);
  }

  submit(formValue) {
    // figure out how to:
    // - close the filter dropdown
    // - make the current filter highlighted
    // - show the loader
    // - re-fetch the listings with the filters applied
    // - show the new listings
    // const formValue = Object.assign({}, value, {
    //   skills: form.skills.map((selected, i) => {
    //     return {
    //       id: this.user.skills[i].id,
    //       selected
    //    }
    //   });
    // });
    // --
    // Hide the dropdown.
    this.closeFilterDropdown('homeType');
    if (formValue.homeTypeFilters && formValue.homeTypeFilters.includes(true)) {
      this.markFilterSelected('homeType');
    }
    const filters = this.homeTypeFilters
      .filter((filter, index) => formValue.homeTypeFilters[index])
      .map((filter, index) => {
        return filter.name;
      });
    this.dataService.loadListings(filters);
  }
}
