import { Component, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../../../core';

@Component({
  selector: 'app-study-widget',
  templateUrl: './study-widget.component.html',
})
export class StudyWidgetComponent implements OnInit {
  @Input() cssClass;
  @Input() symbolShape;
  @Input() baseColor;
  chartOptions: any = {};
  fontFamily = '';
  colorsGrayGray500 = '';
  colorsGrayGray200 = '';
  colorsGrayGray300 = '';
  colorsThemeBase = '';
  colorsThemeLight = '';
  symbolCSSClasses = '';
  svgCSSClasses = '';
  data: Array<number> = [];
  ymax: number;
  total: number;

  constructor(private layout: LayoutService) {
    this.data = [1, 3, 5, 8, 5, 5, 6];
    this.ymax = Math.max(...this.data) + 5;
    this.total = 0;
    for (const val of this.data){
      this.total += val;
    }
  }

  loadLayoutView() {
    this.fontFamily = this.layout.getProp('js.fontFamily');
    this.colorsGrayGray500 = this.layout.getProp('js.colors.gray.gray500');
    this.colorsGrayGray200 = this.layout.getProp('js.colors.gray.gray200');
    this.colorsGrayGray300 = this.layout.getProp('js.colors.gray.gray300');
    this.colorsThemeBase = this.layout.getProp(
      `js.colors.theme.base.${this.baseColor}`
    );

    this.colorsThemeLight = this.layout.getProp(
      `js.colors.theme.light.${this.baseColor}`
    );
  }

  ngOnInit(): void {
    if (!this.baseColor) {
      this.baseColor = 'success';
    }

    if (!this.symbolShape) {
      this.symbolShape = 'symbol-circle';
    }
    this.loadLayoutView();
    this.symbolCSSClasses = `symbol ${this.symbolShape} symbol-50 symbol-light-${this.baseColor} mr-2`;
    this.svgCSSClasses = `svg-icon svg-icon-xl svg-icon-${this.baseColor}`;
    this.chartOptions = this.getChartOptions();
  }

  getChartOptions() {
    return {
      series: [{
        name: 'New studies',
        data: this.data
      }],
      chart: {
        type: 'area',
        height: '150px',
        toolbar: {
          show: false
        },
        zoom: {
          enabled: true
        },
        sparkline: {
          enabled: true
        }
      },
      plotOptions: {},
      legend: {
        show: false
      },
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid',
        opacity: 1
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [this.colorsThemeBase]
      },
      xaxis: {
        categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        },
        crosshairs: {
          show: false,
          position: 'front',
          stroke: {
            color: this.colorsGrayGray300,
            width: 1,
            dashArray: 3
          }
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      yaxis: {
        min: 0,
        max: this.ymax,
        labels: {
          show: false,
          style: {
            colors: this.colorsGrayGray500,
            fontSize: '12px',
            fontFamily: this.fontFamily
          }
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: '12px',
          fontFamily: this.fontFamily
        },
        y: {
          formatter: (val) => {
            return `${val}`;
          }
        }
      },
      colors: [this.colorsThemeLight],
      markers: {
        colors: [this.colorsThemeLight],
        strokeColor: [this.colorsThemeBase],
        strokeWidth: 3
      }
    };
  }
}