import {  GridModule } from '@progress/kendo-angular-grid';
import { CommonModule } from '@angular/common';
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
import { FormsModule, NgModel } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { GridComponent as KendoGridComponent } from '@progress/kendo-angular-grid';




@Component({
  selector: 'app-grid',
  standalone: true,
    imports: [CommonModule,GridModule,
    KENDO_CHARTS,
    KENDO_INPUTS,
    KENDO_GRID_PDF_EXPORT,
    KENDO_GRID_EXCEL_EXPORT, KENDO_LABELS, KENDO_DROPDOWNS,FormsModule,DropDownsModule,ReactiveFormsModule],
  
  templateUrl: './grid.component.html',
  styleUrl: './grid.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA], 
  
})
export class GridComponent {

  @ViewChild(DataBindingDirective) dataBinding !: DataBindingDirective;
  @ViewChild('gridRef') grid!: KendoGridComponent;
  public gridData: unknown[] = employees;



  public gridView!: unknown[];

  

  public mySelection: string[] = [];
  public pdfSVG: SVGIcon = filePdfIcon;
  public excelSVG: SVGIcon = fileExcelIcon;




  menuOpen = false;

  selectedToggle = 'non-intl';

  public ngOnInit(): void {
    this.gridView = this.gridData;
    console.log('Grid Data:', this.gridData); // Debugging
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






  public editedItem: any;

  public editHandler({sender, rowIndex, dataItem }: any): void {
    this.editedItem = { ...dataItem };
    sender.editRow(rowIndex);
  }
  
  public cancelHandler(): void {
    this.editedItem = undefined;
  }
  
  public saveHandler({ sender, rowIndex,dataItem }: any): void {
    sender.closeRow(rowIndex);

    const index = (this.gridData as any[]).findIndex(item => item.id === dataItem.id);
    console.log('Save Handler:', { dataItem, index, editedItem: this.editedItem }); // Debugging
    if (index !== -1) {
      this.gridData[index] = this.editedItem;
    }
    this.editedItem = undefined;
  }
  
  public removeHandler({ dataItem }: any): void {
    this.gridData = (this.gridData as any[]).filter(item => item.id !== dataItem.id);
  }
  



  
}














