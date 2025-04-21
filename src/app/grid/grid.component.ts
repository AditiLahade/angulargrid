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
  imports: [CommonModule, GridModule,ExcelModule,
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

  @ViewChild(DataBindingDirective) dataBinding !: DataBindingDirective;
  @ViewChild('gridRef') grid!: KendoGridComponent;
  public gridData: unknown[] = employees;

  constructor(private apiService: ApiService) { }

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;

  public gridView: any[] = []




  menuOpen = false;

  selectedToggle = 'non-intl';

  public ngOnInit(): void {
    this.loadGridData();

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







  public editedItem: any;

  public editHandler({ sender, rowIndex, dataItem }: any): void {
    console.log('Editing row:', dataItem);

    this.editedItem = { ...dataItem };
    sender.editRow(rowIndex);
  }


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

        this.gridData[rowIndex] = updatedItem;


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
    this.gridData = this.gridData.filter((item: any) => item.id !== dataItem.id);
  }


  


}














