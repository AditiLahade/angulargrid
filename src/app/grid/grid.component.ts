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
import { employees } from "./employees";
import { images } from "./images";

import { KENDO_LABELS } from "@progress/kendo-angular-label";
import { DropDownsModule, KENDO_DROPDOWNS } from "@progress/kendo-angular-dropdowns";
import { FormGroup, FormsModule, NgModel } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GridComponent as KendoGridComponent } from '@progress/kendo-angular-grid';
import { ApiService } from '../api.service';


import { Renderer2, OnDestroy } from '@angular/core';








@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, GridModule, ExcelModule,
    KENDO_CHARTS,
    KENDO_INPUTS, NgIf,
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
  public gridView: any[] = [];


  menuOpen = false;

  selectedToggle = 'non-intl';
  public editedItem: any;


  // constructor(private apiService: ApiService ) { }

  constructor(private apiService: ApiService, private renderer: Renderer2) {
    this.documentClickListener = this.renderer.listen('document', 'click', (event: Event) => {
      this.onDocumentClick(event);
    });
  }
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




  ngOnInit(): void {
    this.apiService.getData().subscribe(
      (data) => {
        console.log('Fetched data:', data);
        this.gridData = data;
        this.gridView = [...this.gridData];
      },
      (error) => {
        console.error('Error loading grid data:', error);
      }
    );
  }

  // ngOnInit(): void {
  //   const storedPreferences = localStorage.getItem('savedPreferences');
  //   if (storedPreferences) {
  //     this.savedPreferences = JSON.parse(storedPreferences);
  //   } else {
  //     this.savedPreferences = [];
  //   }
  //   console.log('Loaded preferences:', this.savedPreferences);

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


  ngAfterViewInit(): void {
    console.log('Grid Reference:', this.grid);
  }



  public loadGridData(): void {

    this.apiService.getData().subscribe(
      (data) => {
        this.gridView = data;
        console.log('Grid Data:', this.gridView);
      },
      (error) => {
        console.error('Error loading grid data:', error);
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
        this.gridView = [...this.gridData];
      },
      error: (error: any) => {
        console.error('Error deleting data:', error);
      }
    });
  }


  // add new row button





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
    this.gridView = [...this.gridData];


    this.editedItem = newItem;


    const rowIndex = this.gridData.indexOf(newItem);
    this.grid.editRow(rowIndex);
  }




  public reloadGrid(): void {
    this.apiService.getData().subscribe({
      next: (data) => {
        this.gridData = data;
        this.gridView = [...this.gridData];
        console.log('Grid reloaded successfully:', this.gridView);
      },
      error: (error) => {
        console.error('Error reloading grid data:', error);
      }
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



  public saveHandler({ sender, rowIndex, dataItem }: any): void {
    console.log('Save Handler Triggered');
    console.log('Data Item:', dataItem);

    if (dataItem.id === null) {
      console.log('Adding new data to the backend...');
      this.apiService.addData(dataItem).subscribe({
        next: (newItem) => {
          console.log('New data added successfully:', newItem);

          this.gridData[rowIndex] = newItem;

          this.gridView = [...this.gridData];
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

          this.gridView = [...this.gridData];
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
  //   console.log('Clear Filters button clicked');
   

  //   if (this.grid && this.grid.filter) {
  //     this.grid.filter = {
  //       logic: 'and',
  //       filters: []
  //     };
  //   }
   
  //   if (this.grid && this.grid.sort) {
  //     this.grid.sort = [];
  //   }

  //   this.grid.pageChange.emit({ skip: 0, take: 20 });
   
  //   this.gridView = [...this.gridData];
  
  //   setTimeout(() => {
  //     this.grid.data = this.gridView;
  //   }, 0);
   
  //   console.log('Grid filters and sorting cleared. Data restored.');
  // }
   

clearFilters(): void {
  const emptyFilter: CompositeFilterDescriptor = { logic: 'and', filters: [] }; 
 
 
  this.gridView = process(this.gridData, { filter: emptyFilter }).data; 
 
  console.log('Filters cleared successfully!');
 
  window.location.reload();
}









  // public savedPreferences: {
  //   columns: any; name: string; filter: any[]
  // }[] = []; 
  // public preprocessedPreferences: string[] = [];


  // public savePreferences(): void {
  //   const preferenceName = `Preference ${this.savedPreferences.length + 1}`; 
  //   const columnState = this.grid.columns.toArray().map((column: any) => ({
  //     field: column.field,
  //     title: column.title,
  //     width: column.width,
  //     hidden: column.hidden,
  //   }));

  //   const preference = {
  //     name: preferenceName,
  //     filter: [...this.gridView], 
  //     columns: columnState, 
  //   };

  //   this.savedPreferences.push(preference);
  //   localStorage.setItem('savedPreferences', JSON.stringify(this.savedPreferences)); 
  //   console.log('Preferences saved:', this.savedPreferences);
  // }


  // public applyPreference(preferenceName: string): void {
  //   console.log('Applying preference:', preferenceName);

  //   const selectedPreference = this.savedPreferences.find(
  //     (pref) => pref.name === preferenceName
  //   );

  //   if (selectedPreference) {
      
  //     this.gridView = [...selectedPreference.filter];

      
  //     const columnState = selectedPreference.columns;
  //     this.grid.columns.toArray().forEach((column: any, index: number) => {
  //       const savedColumn = columnState[index];
  //       if (savedColumn) {
  //         column.width = savedColumn.width;
  //         column.hidden = savedColumn.hidden;
  //       }
  //     });

  //     console.log('Applied preference:', selectedPreference);
  //   } else {
  //     console.warn('Preference not found:', preferenceName);
  //     this.gridView = [...this.gridData]; 
  //   }
  // }




 


}














