import { Component, HostListener, OnInit } from '@angular/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { ToastrService } from 'ngx-toastr';
import { LayoutService } from 'src/app/_rms';
import { DashboardService } from 'src/app/_rms/services/entities/dashboard/dashboard.service';

@Component({
  selector: 'app-main-page-internal',
  templateUrl: './internal-main-page.component.html',
  styleUrls: ['./internal-main-page.component.scss']
})
export class InternalMainPageComponent implements OnInit {
  colorsGrayGray100: string;
  colorsGrayGray700: string;
  colorsThemeBaseSuccess: string;
  colorsThemeLightSuccess: string;
  fontFamily: string;
  dtpChartOptions: any = {};
  dtpCompleted: any;
  dupChartOptions: any = {};
  dupCompleted: any;
  studyChartOptions: any = {};
  studyCompleted: any;
  objectChartOptions: any = {};
  objectCompleted: any;
  valuePer: any = {};
  valueNum: any = {};

  constructor( private layout: LayoutService, private dashboardService: DashboardService, private toastr: ToastrService, private permissionService: NgxPermissionsService) { 
    this.colorsGrayGray100 = this.layout.getProp('js.colors.gray.gray100');
    this.colorsGrayGray700 = this.layout.getProp('js.colors.gray.gray700');
    this.colorsThemeBaseSuccess = this.layout.getProp(
      'js.colors.theme.base.success'
    );
    this.colorsThemeLightSuccess = this.layout.getProp(
      'js.colors.theme.light.success'
    );
    this.fontFamily = this.layout.getProp('js.fontFamily');

  }
  ngOnInit(): void {
    this.getDtpStatistics();
    this.getDupStatistics();
    this.getStudyStatistics();
    this.getObjectStatistics();
    const perm = localStorage.getItem('role');
    this.permissionService.loadPermissions([perm]);
  }
  getDtpStatistics() {
    this.dashboardService.getDtpStatistics().subscribe((res: any) => {
      this.dtpCompleted = Math.round((((res.total-res.uncompleted)/res.total)*100)*100)/100 ;
      this.dtpChartOptions = this.getChartOptions(this.dtpCompleted, 'Completed DTs', true);
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getDupStatistics() {
    this.dashboardService.getDupStatistics().subscribe((res: any) => {
      this.dupCompleted = Math.round((((res.total-res.uncompleted)/res.total)*100)*100)/100;
      this.dupChartOptions = this.getChartOptions(this.dupCompleted, 'Completed DTs', true);
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getStudyStatistics() {
    this.dashboardService.getStudyStatistics().subscribe((res: any) => {
      this.studyCompleted = res.total;
      this.studyChartOptions = this.getChartOptions(this.studyCompleted, 'Completed DUs', false);
    }, error => {
      this.toastr.error(error.error.title);
    })
  }
  getObjectStatistics() {
    this.dashboardService.getObjectStatistics().subscribe((res: any) => {
      this.objectCompleted = res.total;
      this.objectChartOptions = this.getChartOptions(this.objectCompleted, 'Total Objects', false);
    }, error => {
      this.toastr.error(error.error.title);
    })
  }

  getChartOptions(data,label, format) {
    this.valuePer = {
      color: this.colorsGrayGray700,
      fontSize: '30px',
      fontWeight: '700',
      offsetY: 12,
      show: true,
    };
    this.valueNum = {
      formatter: function (val) {
        return parseInt(val.toString(), 10).toString();
      },
      color: this.colorsGrayGray700,
      fontSize: '30px',
      fontWeight: '700',
      offsetY: 12,
      show: true,
    }
    const strokeColor = '#D13647';
    return {
      series: [data],
      offsetX: 5000,
      chart: {
        type: 'radialBar',
        height: 200,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 0,
            size: '65%',
          },
          dataLabels: {
            showOn: 'always',
            name: {
              show: false,
              fontWeight: '700',
            },
            value: format ? this.valuePer : this.valueNum,
          },
          track: {
            background: this.colorsThemeLightSuccess,
            strokeWidth: '100%',
          },
        },
      },
      colors: [this.colorsThemeBaseSuccess],
      stroke: {
        lineCap: 'round',
      },
      labels: [label],
      legend: {},
      dataLabels: {},
      fill: {},
      xaxis: {},
      yaxis: {},
      states: {},
      tooltip: {},
      markers: {},
    };
  }
  scrollToElement($element): void {
    var topOfElement = $element.offsetTop - 135;
    window.scroll({ top: topOfElement, behavior: "smooth" });
  }
}
