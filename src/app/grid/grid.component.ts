import { ExcelModule, GridModule, KENDO_GRID } from '@progress/kendo-angular-grid';
import { CommonModule, NgIf } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { KENDO_CHARTS } from "@progress/kendo-angular-charts";
import {
  DataBindingDirective,
  KENDO_GRID_EXCEL_EXPORT,
  KENDO_GRID_PDF_EXPORT,
} from "@progress/kendo-angular-grid";
import { KENDO_INPUTS } from "@progress/kendo-angular-inputs";
import { CompositeFilterDescriptor, process } from "@progress/kendo-data-query";
import { SVGIcon, fileExcelIcon, filePdfIcon } from "@progress/kendo-svg-icons";


import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { DropDownsModule, KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";
import { FormGroup, FormsModule, NgModel } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GridComponent as KendoGridComponent } from '@progress/kendo-angular-grid';
import { ApiService } from '../api.service';


import { Renderer2, OnDestroy } from '@angular/core';

import { StatePersistingService } from '../state-persisting.service';

import { DataResult } from '@progress/kendo-data-query';

import { ChangeDetectorRef } from '@angular/core';

import { NgZone } from '@angular/core';

@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, GridModule, ExcelModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT, ReactiveFormsModule,
    KENDO_GRID_EXCEL_EXPORT, KENDO_LABELS, KENDO_DROPDOWNS, FormsModule, DropDownsModule, ReactiveFormsModule, KENDO_GRID, KENDO_DROPDOWNS],

  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ApiService]

})

export class GridComponent {


  private documentClickListener: () => void;


  @ViewChild(DataBindingDirective) dataBinding !: DataBindingDirective;

  @ViewChild('gridRef') grid!: KendoGridComponent;

 


  gridRef: any;
  gridcomponent: any;
  isDarkMode = false;



  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  public gridData: any[] = [];

  //public gridView: any[] = [];
 public gridView: DataResult = { data: [], total: 0 };


  menuOpen = false;

  selectedToggle = 'non-intl';
  public editedItem: any;
  toastr: any;


  // constructor(private apiService: ApiService ) { }

  constructor(private apiService: ApiService, private renderer: Renderer2,
    private persistingService : StatePersistingService, 
    private cdr: ChangeDetectorRef ,
    private zone: NgZone
  ) {
    this.documentClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onDocumentClick(event);
    });
  }




  public gridSettings: any = {
    state: {
      skip: 0,
      take: 5,
      filter: {
        logic: "and",
        filters: [],
      },
      group: [],
    },
    gridData: process(this.gridData, {
      skip: 0,
      take: 5,
      filter: {
        logic: "and",
        filters: [],
      },
      group: [],
    }),
    columnsConfig: [
      {
        field: "ProductID",
        title: "ID",
        filterable: false,
        filter: "text",
        width: 60,
        hidden: false,
      },
      {
        field: "ProductName",
        title: "Product Name",
        filterable: true,
        filter: "text",
        width: 300,
        hidden: false,
      },
      {
        field: "FirstOrderedOn",
        title: "First Ordered On",
        filter: "date",
        format: "{0:d}",
        width: 240,
        filterable: true,
        hidden: false,
      },
      {
        field: "UnitPrice",
        title: "Unit Price",
        filter: "numeric",
        format: "{0:c}",
        width: 180,
        filterable: true,
        hidden: false,
      },
      {
        field: "Discontinued",
        title: "Discontinued",
        filter: "boolean",
        width: 120,
        filterable: true,
        hidden: false,
      },
    ],
  };









  private onDocumentClick(event: Event): void {
    const clickedInsideGrid = (event.target as HTMLElement).closest('kendo-grid');
    if (!clickedInsideGrid && this.editedItem) {

      const rowIndex = this.gridData.indexOf(this.editedItem);
      this.saveHandler({ sender: this.grid, rowIndex, dataItem: this.editedItem });
    }
  }

  ngOnDestroy(): void {
    if (this.documentClickListener) {
      this.documentClickListener();
    }
  }




  // ngOnInit(): void {
  //   this.apiService.getData().subscribe(
  //     (data) => {
  //       console.log('Fetched data:', data);
  //       this.gridData = data;
  //       this.gridView = [...this.gridData];
  //     },
  //     (error) => {
  //       console.error('Error loading grid data:', error);
  //     }
  //   );
  // }

  ngOnInit(): void {
    const savedSettings = this.persistingService.get('gridSettings');
    if (savedSettings) {
      this.gridSettings = this.mapGridSettings(savedSettings);
    }
  
    // Fetch grid data
    this.apiService.getData().subscribe(
      (data) => {
        this.gridData = data;
        this.gridView = process(this.gridData, this.gridSettings.state); // Process data with the current state
      },
      (error) => {
        console.error('Error loading grid data:', error);
      }
    );
  }










  // ngAfterViewInit(): void {
  //   console.log('Grid Reference:', this.grid);
  // }



  // public loadGridData(): void {

  //   this.apiService.getData().subscribe(
  //     (data) => {
  //       this.gridView = data;
  //       console.log('Grid Data:', this.gridView);
  //     },
  //     (error) => {
  //       console.error('Error loading grid data:', error);
  //     }
  //   );
  // }

  ngAfterViewInit(): void {
    console.log('Grid Reference:', this.grid);
  
    // Apply grid settings after the grid is fully initialized
    if (this.gridSettings) {
      this.applyGridSettings();
    }
  }















  public loadGridData(): void {
    this.apiService.getData().subscribe(
      (data) => {
        this.gridView = { data: data, total: data.length }; // Wrap data in a DataResult object
        console.log('Grid Data:', this.gridView);
      },
      (error) => {
        console.error('Error loading grid data:', error);
      }
    );
  }

















  // public onFilter(value: string): void {
  //   const inputValue = value.toLowerCase();


  //   this.gridView = process(this.gridData, {
  //     filter: {
  //       logic: "or",
  //       filters: [
  //         {
  //           field: "full_name",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "job_title",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "budget",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "phone",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //         {
  //           field: "address",
  //           operator: "contains",
  //           value: inputValue,
  //         },
  //       ],
  //     },
  //   }).data;

  //   this.dataBinding.skip = 0;
  // }

  public onFilter(value: string): void {
    const inputValue = value.toLowerCase();
  
    this.gridView = process(this.gridData, {
      filter: {
        logic: "or",
        filters: [
          { field: "full_name", operator: "contains", value: inputValue },
          { field: "job_title", operator: "contains", value: inputValue },
          { field: "budget", operator: "contains", value: inputValue },
          { field: "phone", operator: "contains", value: inputValue },
          { field: "address", operator: "contains", value: inputValue },
        ],
      },
    });
  
    this.dataBinding.skip = 0;
  }





















  public areaList: Array<string> = [
    "Lead 1",
    "Lead 2",
    "Lead 3", 
    "Lead 4",
    "Lead 5",
    "Lead 6",
    "Lead 7"
  ];



  exportExcel(grid: any): void {
    grid.saveAsExcel();
  }


  toggleIntl(type: 'non-intl' | 'intl') {
    this.selectedToggle = type;
  }




  public editHandler({ sender, rowIndex, dataItem }: any): void {
    console.log('Edit Handler Triggered');
    console.log('Editing Row:', dataItem);

    this.editedItem = dataItem;
    sender.editRow(rowIndex);
  }


  // public saveHandler({ sender, rowIndex, dataItem }: any): void {
  //     console.log('Save Handler Triggered');
  //     console.log('Data Item:', dataItem);

  //     if (dataItem.id === null) {

  //       console.log('Adding new data to the backend...');
  //       this.apiService.addData(dataItem).subscribe({
  //         next: (newItem) => {
  //           console.log('New data added successfully:', newItem);


  //           const index = this.gridData.findIndex((item: any) => item === dataItem);
  //           if (index !== -1) {
  //             this.gridData[index] = newItem;
  //           } else {
  //             this.gridData.push(newItem); 
  //           }

  //           this.gridView = [...this.gridData];
  //           this.editedItem = undefined;
  //           sender.closeRow(rowIndex); 
  //         },
  //         error: (error: any) => {
  //           console.error('Error adding new data:', error);
  //         }
  //       });
  //     } else {

  //       console.log('Updating existing data...');
  //       this.apiService.updateData(dataItem).subscribe({
  //         next: (updatedItem) => {
  //           console.log('Data updated successfully:', updatedItem);

  //           const index = this.gridData.findIndex((item: any) => item.id === dataItem.id);
  //           if (index !== -1) {
  //             this.gridData[index] = updatedItem;
  //           }

  //           this.gridView = [...this.gridData];
  //           this.editedItem = undefined;
  //           sender.closeRow(rowIndex); 
  //         },
  //         error: (error) => {
  //           console.error('Error updating data:', error);
  //         }
  //       });
  //     }
  //   }



  public cancelHandler(): void {
    console.log('Cancel editing');
    this.editedItem = undefined;
  }



  // public removeHandler({ dataItem }: any): void {
  //   console.log('Data Item to be deleted:', dataItem);

  //   if (!dataItem || !dataItem.id) {
  //     console.error('Invalid dataItem or missing id:', dataItem);
  //     return;
  //   }


  //   this.apiService.deleteData(dataItem.id).subscribe({
  //     next: () => {
  //       console.log('Data deleted successfully:', dataItem);


  //       this.gridData = this.gridData.filter((item: any) => item.id !== dataItem.id);
  //       this.gridView = [...this.gridData];
  //     },
  //     error: (error: any) => {
  //       console.error('Error deleting data:', error);
  //     }
  //   });
  // }


  // add new row button


  public removeHandler({ dataItem }: any): void {
    console.log('Data Item to be deleted:', dataItem);
  
    if (!dataItem || !dataItem.id) {
      console.error('Invalid dataItem or missing id:', dataItem);
      return;
    }
  
    this.apiService.deleteData(dataItem.id).subscribe({
      next: () => {
        console.log('Data deleted successfully:', dataItem);
  
        this.gridData = this.gridData.filter((item: any) => item.id !== dataItem.id);
        this.gridView = { data: this.gridData, total: this.gridData.length }; // Wrap in DataResult
      },
      error: (error: any) => {
        console.error('Error deleting data:', error);
      }
    });
  }




  // public addNewRow(): void {
  //   const newItem = {
  //     id: null,
  //     Record_Id: '',
  //     last_name: '',
  //     first_name: '',
  //     email: '',
  //     phone: '',
  //     lmp_lead: '',
  //     appoinment_type: '',
  //     booking_agency: ''
  //   };


  //   this.gridData.unshift(newItem);
  //   this.gridView = [...this.gridData];


  //   this.editedItem = newItem;


  //   const rowIndex = this.gridData.indexOf(newItem);
  //   this.grid.editRow(rowIndex);
  // }




  // public reloadGrid(): void {
  //   this.apiService.getData().subscribe({
  //     next: (data) => {
  //       this.gridData = data;
  //       this.gridView = [...this.gridData];
  //       console.log('Grid reloaded successfully:', this.gridView);
  //     },
  //     error: (error) => {
  //       console.error('Error reloading grid data:', error);
  //     }
  //   });
  // }

  public addNewRow(): void {
    const newItem = {
      id: null,
      Record_Id: '',
      last_name: '',
      first_name: '',
      email: '',
      phone: '',
      lmp_lead: '',
      appoinment_type: '',
      booking_agency: ''
    };
  
    this.gridData.unshift(newItem);
    this.gridView = { data: this.gridData, total: this.gridData.length }; // Wrap in DataResult
  
    this.editedItem = newItem;
  
    const rowIndex = this.gridData.indexOf(newItem);
    this.grid.editRow(rowIndex);
  }










  public reloadGrid(): void {
    this.apiService.getData().subscribe({
      next: (data) => {
        this.gridView = { data: data, total: data.length }; // Wrap data in a DataResult object
        console.log('Grid reloaded successfully:', this.gridView);
      },
      error: (error) => {
        console.error('Error reloading grid data:', error);
      },
    });
  }










 




  public cellClickHandler({ sender, rowIndex, dataItem }: any): void {
    console.log('Cell clicked:', dataItem);

    if (this.editedItem && this.editedItem !== dataItem) {
      this.saveHandler({ sender, rowIndex: this.gridData.indexOf(this.editedItem), dataItem: this.editedItem });
    }


    this.editedItem = dataItem;

    sender.editRow(rowIndex);
  }



  // public saveHandler({ sender, rowIndex, dataItem }: any): void {
  //   console.log('Save Handler Triggered');
  //   console.log('Data Item:', dataItem);

  //   if (dataItem.id === null) {
  //     console.log('Adding new data to the backend...');
  //     this.apiService.addData(dataItem).subscribe({
  //       next: (newItem) => {
  //         console.log('New data added successfully:', newItem);

  //         this.gridData[rowIndex] = newItem;

  //         this.gridView = [...this.gridData]
  //         this.editedItem = undefined;
  //         sender.closeRow(rowIndex);
  //       },
  //       error: (error: any) => {
  //         console.error('Error adding new data:', error);
  //       }
  //     });
  //   } else {
  //     console.log('Updating existing data...');
  //     this.apiService.updateData(dataItem).subscribe({
  //       next: (updatedItem) => {
  //         console.log('Data updated successfully:', updatedItem);

  //         const index = this.gridData.findIndex((item: any) => item.id === dataItem.id);
  //         if (index !== -1) {
  //           this.gridData[index] = updatedItem;
  //         }

  //         this.gridView = [...this.gridData];
  //         this.editedItem = undefined;
  //         sender.closeRow(rowIndex);
  //       },
  //       error: (error) => {
  //         console.error('Error updating data:', error);
  //       }
  //     });
  //   }
  // }



  public saveHandler({ sender, rowIndex, dataItem }: any): void {
    console.log('Save Handler Triggered');
    console.log('Data Item:', dataItem);
  
    if (dataItem.id === null) {
      console.log('Adding new data to the backend...');
      this.apiService.addData(dataItem).subscribe({
        next: (newItem) => {
          console.log('New data added successfully:', newItem);
  
          this.gridData[rowIndex] = newItem;
          this.gridView = { data: this.gridData, total: this.gridData.length }; // Wrap in DataResult
          this.editedItem = undefined;
          sender.closeRow(rowIndex);
        },
        error: (error: any) => {
          console.error('Error adding new data:', error);
        }
      });
    } else {
      console.log('Updating existing data...');
      this.apiService.updateData(dataItem).subscribe({
        next: (updatedItem) => {
          console.log('Data updated successfully:', updatedItem);
  
          const index = this.gridData.findIndex((item: any) => item.id === dataItem.id);
          if (index !== -1) {
            this.gridData[index] = updatedItem;
          }
  
          this.gridView = { data: this.gridData, total: this.gridData.length }; // Wrap in DataResult
          this.editedItem = undefined;
          sender.closeRow(rowIndex);
        },
        error: (error) => {
          console.error('Error updating data:', error);
        }
      });
    }
  }





















toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }




// clearFilters(): void {
//   const emptyFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] }; 
 
 
//   this.gridView = process(this.gridData, { filter: emptyFilter }).data; 
 
//   console.log('Filters cleared successfully!');
 
//   window.location.reload();
// }

clearFilters(): void {
  const emptyFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] };

  this.gridView = process(this.gridData, { filter: emptyFilter });

  console.log('Filters cleared successfully!');
}









public saveGridSettings(): void {
  const columns = this.grid.columns.toArray();

  const gridConfig = {
    state: this.gridSettings.state, // Save the current grid state
    gridData: this.gridData, // Save the current grid data
    columnsConfig: columns.map((column: any) => ({
      field: column.field,
      width: column.width,
      title: column.title,
      filter: column.filter, // Include filter configuration
      format: column.format, // Include format configuration
      filterable: column.filterable, // Include filterable property
      orderIndex: column.orderIndex,
      hidden: column.hidden,
    })),
  };

  this.persistingService.set('gridSettings', gridConfig); // Save to local storage
  console.log('Grid settings saved:', gridConfig);
}


public loadGridSettings(): void {
  const savedSettings = this.persistingService.get('gridSettings');
  if (savedSettings) {
    this.gridSettings = this.mapGridSettings(savedSettings); // Map the saved settings
    this.applyGridSettings(); // Apply the settings to the grid
    console.log('Grid settings loaded:', savedSettings);
  } else {
    console.log('No saved grid settings found.');
  }
}

private mapGridSettings(gridSettings: any): any {
  const state = gridSettings.state;
  this.mapDateFilter(state.filter); // Map date filters if any

  return {
    state,
    columnsConfig: gridSettings.columnsConfig.sort(
      (a: any, b: any) => a.orderIndex - b.orderIndex // Sort columns by orderIndex
    ),
    gridData: process(this.gridData, state), // Process grid data with the saved state
  };
}
private mapDateFilter(descriptor: any): void {
  const filters = descriptor.filters || [];
  filters.forEach((filter: any) => {
    if (filter.filters) {
      this.mapDateFilter(filter); // Recursively map nested filters
    } else if (filter.field === 'FirstOrderedOn' && filter.value) {
      filter.value = new Date(filter.value); // Convert string to Date object
    }
  });
}

private applyGridSettings(): void {
  if (!this.grid || !this.grid.columns) {
    console.warn('Grid is not fully initialized. Skipping applyGridSettings.');
    return;
  }

  const columns = this.grid.columns.toArray();
  this.gridSettings.columnsConfig.forEach((savedColumn: any) => {
    const column = columns.find((col: any) => col.field === savedColumn.field);
    if (column) {
      column.width = savedColumn.width; // Apply saved column width
      column.hidden = savedColumn.hidden; // Apply saved column visibility
    }
  });

  // Update gridView with the saved state
  this.zone.run(() => {
    this.gridView = process(this.gridData, this.gridSettings.state); // Process data with the saved state
    this.cdr.detectChanges(); // Trigger change detection to avoid ExpressionChangedAfterItHasBeenCheckedError
  });
}


























 


}














