import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ChartModule } from 'primeng/chart';
import { FileUploadModule } from 'primeng/fileupload';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DropdownModule } from 'primeng/dropdown'; // Optional, for dropdown
import { InputTextModule } from 'primeng/inputtext'; // Optional, for input styling
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CommonModule } from '@angular/common';
interface PortfolioItem {
  Symbol: string;
  InvestedValue: string;
  CurrentValue: string;
  Sector: string;
  CompanyName: string;
  OverAllPNL: string;
}
interface SectorSummary {
  sector: string;
  value: number;
  color: string;
}

@Component({
  selector: 'app-button',
  imports: [
    ButtonModule, 
    ChartModule, 
    FileUploadModule,       
    TableModule,
    AutoCompleteModule,
    MultiSelectModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent implements OnInit{
[x: string]: any;
  data: any;
  options: any;
  portfolioData: PortfolioItem[] = [];
  sectorSummary: SectorSummary[] = [];

  filteredData: PortfolioItem[] = [];
  sectors: string[] = [];
  selectedSectors: string[] = [];

  constructor() {}

  initializeChartOptions() {
    this.options = {
      plugins: {
        legend: {
          labels: {
            color: '#495057'
          }
        },
        title: {
          display: true,
          text: 'Sector-wise Portfolio Performance',
          color: '#495057',
          fontSize: 16
        }
      }
    };
  }

  onFileUpload(event: any) {
    const file = event.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      try {
        this.portfolioData = JSON.parse(e.target.result);
        this.initializeSectors();
       this.selectedSectors = [...this.sectors]; // Select all sectors by default
       this.filterData();
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };

    reader.readAsText(file);
  }

  // processDataForChart() {
  //   // Group by sector and calculate PnL
  //   const sectorPnL = new Map<string, number>();
    
  //   this.portfolioData.forEach(item => {
  //     if (!item.Sector) return; // Skip items with no sector
      
  //     const pnl = parseFloat(item.CurrentValue) - parseFloat(item.InvestedValue);
  //     const currentValue = sectorPnL.get(item.Sector) || 0;
  //     sectorPnL.set(item.Sector, currentValue + pnl);
  //   });

  //   // Prepare data for chart
  //   const sectors: string[] = [];
  //   const values: number[] = [];
  //   const colors: string[] = [];

  //   sectorPnL.forEach((value, sector) => {
  //     sectors.push(sector);
  //     values.push(Number(value.toFixed(2)));
  //     // Generate random color
  //     colors.push(`#${Math.floor(Math.random()*16777215).toString(16)}`);
  //   });

  //   this.data = {
  //     labels: sectors,
  //     datasets: [
  //       {
  //         data: values,
  //         backgroundColor: colors,
  //         hoverBackgroundColor: colors
  //       }
  //     ]
  //   };
  // }

  // Update the processDataForChart method
  processDataForChart() {
    // Group by sector and calculate PnL
    const sectorPnL = new Map<string, number>();
    
    this.portfolioData.forEach(item => {
      if (!item.Sector) return;
    
      const pnl = parseFloat(item.CurrentValue) - parseFloat(item.InvestedValue);
      const currentValue = sectorPnL.get(item.Sector) || 0;
      sectorPnL.set(item.Sector, currentValue + pnl);
      console.log(`foreach: ${item}`);
    });

    // Prepare data for chart
    const sectors: string[] = [];
    const values: number[] = [];
    const colors: string[] = [];
    this.sectorSummary = [];

    sectorPnL.forEach((value, sector) => {
      sectors.push(sector);
      values.push(Number(value.toFixed(2)));
      const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
      colors.push(color);
      
      this.sectorSummary.push({
        sector,
        value: Number(value.toFixed(2)),
        color
      });
    });

    // Sort sector summary by value (descending)
    this.sectorSummary.sort((a, b) => b.value - a.value);

    this.data = {
       labels: sectors,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          hoverBackgroundColor: colors
        }
      ]
    };
  }


  ngOnInit() {
    this.initializeChartOptions();

  }


 initializeSectors() {
  // Extract unique sectors, excluding empty ones
  this.sectors = [...new Set(
    this.portfolioData
      .map(item => item.Sector)
      .filter(sector => sector && sector.trim() !== '')
  )].sort();
}

onSectorChange() {
  this.filterData();
}

filterData() {
  this.filteredData = this.portfolioData.filter(item => 
    this.selectedSectors.includes(item.Sector)
  );
  this.processDataForChart();
}

  calculatePNL(item: PortfolioItem): number {
    return parseFloat(item.CurrentValue) - parseFloat(item.InvestedValue);
  }
 
}