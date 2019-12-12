import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { AssetManagementService } from '../shared/asset-management.service';
import { Data } from '@angular/router';

@Component({
  selector: 'app-bikes-and-veh',
  templateUrl: './bikes-and-veh.component.html',
  styleUrls: ['./bikes-and-veh.component.css']
})
export class BikesAndVehComponent implements OnInit {

  bikes = [];
  bikesBehaviour: BehaviorSubject<any>
  res: HttpResponse<any>;
  displayedColumns: string[] = ['regNo', 'status', 'feedbackOrComments', 'station', 'actions'];
  
  dataSource: any;

  private headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');
  
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(private http: HttpClient, private assetService: AssetManagementService) {
    this.bikesBehaviour = new BehaviorSubject<any>(this.bikes);
  }

  ngOnInit() {
    this.fetchData();

    this.assetService.connect();

    this.bikesBehaviour.subscribe(data => {
      this.dataSource = data;
      this.dataSource.sort = this.sort;
    })
    this.assetService.bikesData.subscribe((data) => {
        console.log(data);
        console.log(JSON.parse(data))
        data = JSON.parse(data)
        this.dataSource = this.dataSource.filter(e => e.regNo !== data.regNo);
        this.dataSource.unshift(data)
    });
  }


  fetchData = function () {
    this.assetService.getAssetData().subscribe((data) => {
      this.bikesBehaviour.next(data);
      console.log("inside component : ", data);
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  removeBike = function (regNo: String) {
    if (confirm("Are you sure?")) {
      return this.assetService.deleteAsset(regNo).toPromise()
        .then(() => {
          this.fetchData();
        }
        )
    }
  }
}
