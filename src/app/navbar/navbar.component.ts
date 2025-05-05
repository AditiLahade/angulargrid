import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { KENDO_BUTTONS } from "@progress/kendo-angular-buttons";
import { CalendarModule } from '@progress/kendo-angular-dateinputs';


@Component({
  selector: 'app-navbar',
  standalone : true,
  imports: [CommonModule,KENDO_BUTTONS,CalendarModule] ,
  
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  isCalendarOpen = false;
  selectedDate: Date = new Date();
  
  toggleCalendarDropdown() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }
  
 
  // isDarkMode = false;

  // toggleDarkMode() {
  //   this.isDarkMode = !this.isDarkMode;
  //   if (this.isDarkMode) {
  //     document.body.classList.add('dark-mode');
  //   } else {
  //     document.body.classList.remove('dark-mode');
  //   }
  // }


}
