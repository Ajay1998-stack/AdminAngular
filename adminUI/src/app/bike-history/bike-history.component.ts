import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { MatSort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { AssetManagementService } from '../shared/asset-management.service';

@Component({
  selector: 'app-bike-history',
  templateUrl: './bike-history.component.html',
  styleUrls: ['./bike-history.component.css']
})
export class BikeHistoryComponent implements OnInit {

  bikesBehaviour2: Subject<any>;

  res: HttpResponse<any>;
  displayedColumns: string[] = ['regNo', 'userName', 'initMeterReading','finalMeterReading','initTime','dropTime','bookingID','feedbackOrComments', 'station'];
  dataSource: any;
  
  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private http: HttpClient,private assetHisService:AssetManagementService) {
    this.bikesBehaviour2 = new Subject<any>();
  }

  ngOnInit() {
    this.assetHisService.getAssetHisData().subscribe((data) => {
      this.bikesBehaviour2.next(data);
      console.log("inside component : ", data);
    });
    this.bikesBehaviour2.subscribe(data => {
      this.dataSource = data;
      this.dataSource.sort = this.sort;
    })

    this.assetHisService.bikesHistory.subscribe((data) => {
      console.log(JSON.parse(data))
      data = JSON.parse(data)
      this.dataSource = this.dataSource.filter(e => e.regNo !== data.regNo);
      this.dataSource.unshift(data);
  });
  }
}