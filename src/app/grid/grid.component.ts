import {  GridModule, KENDO_GRID } from '@progress/kendo-angular-grid';
import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { KENDO_CHARTS } from "@progress/kendo-angular-charts";
import {
  DataBindingDirective,
  KENDO_GRID_EXCEL_EXPORT,
  KENDO_GRID_PDF_EXPORT,
} from "@progress/kendo-angular-grid";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { process } from "@progress/kendo-data-query";
import { SVGIcon, fileExcelIcon, filePdfIcon } from "@progress/kendo-svg-icons";
import { employees } from "./employees";
import { images } from "./images";

import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { DropDownsModule, KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";
import { FormGroup, FormsModule, NgModel } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GridComponent as KendoGridComponent } from '@progress/kendo-angular-grid';
import { ApiService } from '../api.service';




@Component({
  selector: 'app-grid',
  standalone: true,
    imports: [CommonModule,GridModule,
    KENDO_CHARTS,
    KENDO_INPUTS,NgIf,
    KENDO_GRID_PDF_EXPORT,ReactiveFormsModule,
    KENDO_GRID_EXCEL_EXPORT, KENDO_LABELS, KENDO_DROPDOWNS,FormsModule,DropDownsModule,ReactiveFormsModule, KENDO_GRID, KENDO_DROPDOWNS],
  
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  providers: [ApiService]
  
})
export class GridComponent {

  @ViewChild(DataBindingDirective) dataBinding !: DataBindingDirective;
  @ViewChild('gridRef') grid!: KendoGridComponent;
  public gridData: unknown[] = employees;

  constructor(private apiService: ApiService) {}


  // public gridView!: unknown[];

  

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  public gridView: any[] = []

  


  menuOpen = false;

  selectedToggle = 'non-intl';

  public ngOnInit(): void {
this.loadGridData(); // Load grid data on initialization

    // this.gridView = this.gridData;
    // console.log('Grid Data:', this.gridData); // Debugging
  }


  public loadGridData(): void {
    // Assuming the API service returns an observable of data
    this.apiService.getData().subscribe(
      (data) => {
        this.gridView = data; // Assign the fetched data to the gridView
        console.log('Grid Data:', this.gridView); // Debugging
      },
      (error) => {
        console.error('Error loading grid data:', error); // Handle error if data fetching fails
      }
    );
  }
 
  public onFilter(value: string): void {
    const inputValue = value.toLowerCase();


    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          {
            field: "full_name",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "job_title",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "budget",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "phone",
            operator: "contains",
            value: inputValue,
          },
          {
            field: "address",
            operator: "contains",
            value: inputValue,
          },
        ],
      },
    }).data;

    this.dataBinding.skip = 0;
  }

  public photoURL(dataItem: { img_id: string; gender: string }): string {
    const code: string = dataItem.img_id + dataItem.gender;
    const image: { [Key: string]: string } = images;

    return image[code];
  }

  public flagURL(dataItem: { country: string }): string {
    const code: string = dataItem.country;
    const image: { [Key: string]: string } = images;

    return image[code];
  }



public areaList: Array<string> = [
    "Boston",
    "Chicago",
    "Houston",
    "Los Angeles",
    "Miami",
    "New York",
    "Philadelphia",
    "San Francisco",
    "Seattle",
  ];




  exportExcel(grid: any): void {
    grid.saveAsExcel(); 
  }
  

toggleIntl(type: 'non-intl' | 'intl') {
    this.selectedToggle = type;
  }

  
 



  // for edit and delete






  // public editedItem: any;

  // public editHandler({ sender, rowIndex, dataItem }: any): void {
  //   // Make a copy of the dataItem and assign it to editedItem for editing
  //   this.editedItem = { ...dataItem };
    
  //   // Put the row in edit mode
  //   sender.editRow(rowIndex);
  // }

public editedItem: any; // Store the currently edited item

public editHandler({ sender, rowIndex, dataItem }: any): void {
  console.log('Editing row:', dataItem); // Debugging

  this.editedItem = { ...dataItem };
  sender.editRow(rowIndex);
}

// saveHandler(event: any) {
//   const { sender, rowIndex, dataItem } = event;
  
//   console.log('Event:', event);
//   console.log('Grid:', sender);
//   console.log('Row Index:', rowIndex);
//   console.log('Data Item:', dataItem);

//   if (!dataItem) {
//     console.error('No data item found!');
//     return;
//   }

//   // Assuming you are modifying the data in the grid
//   // For example, if you're updating the first_name field:
//   const updatedData = {
//     ...dataItem,  // Copy the existing data
//     first_name: 'Updated Name',  // Modify the necessary field
//   };

//   // Update the grid's data source
//   sender.dataSource.update(updatedData);
//   console.log('Updated Data:', updatedData);

//   // Optional: Persist updated data (e.g., to JSON, localStorage, or a backend)
//   // For example, if you are using localStorage:
//   const storedData = JSON.parse(localStorage.getItem('yourDataKey') || '[]');
//   const updatedDataList = storedData.map((item: any) =>
//     item.id === updatedData.id ? updatedData : item
//   );
//   localStorage.setItem('yourDataKey', JSON.stringify(updatedDataList));
  
//   // Log the update to confirm
//   console.log('Updated Data in Local Storage:', updatedDataList);
// }

// saveHandler({ sender, rowIndex, dataItem }: any): void {
//   console.log('Sender:', sender);
//   console.log('Row Index:', rowIndex);
//   console.log('Data Item:', dataItem);
//   console.log('Service:', this.apiService);

//   if (!this.apiService || !this.apiService.updateData) {
//     console.error('Service is not defined or update method is missing!');
//     return;
//   }

//   this.apiService.updateData(dataItem).subscribe({
//     next: (updatedItem) => {
//       console.log('Data updated successfully:', updatedItem);
//       sender.closeRow(rowIndex); // Close row after successful update
//     },
//     error: (error) => {
//       console.error('Update failed:', error);
//     }
//   });
// }

saveHandler({ sender, rowIndex, dataItem }: any): void {
  console.log('Sender:', sender);
  console.log('Row Index:', rowIndex);
  console.log('Data Item:', dataItem);
  console.log('Service:', this.apiService);

  if (!this.apiService || !this.apiService.updateData) {
    console.error('Service is not defined or update method is missing!');
    return;
  }

  this.apiService.updateData(dataItem).subscribe({
    next: (updatedItem) => {
      console.log('Data updated successfully:', updatedItem);

      // ✅ Manually update the local data array to reflect changes immediately
      this.gridData[rowIndex] = updatedItem;

      // ✅ Close the row in the grid
      sender.closeRow(rowIndex);
    },
    error: (error) => {
      console.error('Update failed:', error);
    }
  });
}




public cancelHandler(): void {
  console.log('Cancel editing');
  this.editedItem = undefined;
}

  
  
  public removeHandler({ dataItem }: any): void {
    this.gridData = this.gridData.filter((item:any) => item.id !== dataItem.id);
  }
  



  
}














