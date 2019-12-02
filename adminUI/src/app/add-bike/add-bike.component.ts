import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http'
import { AssetManagementService, Vehicle } from '../shared/asset-management.service';


@Component({
  selector: 'app-add-bike',
  templateUrl: './add-bike.component.html',
  styleUrls: ['./add-bike.component.css']
})
export class AddBikeComponent implements OnInit {

  confirmationString: string = "New Bike has been added";
  isAdded: boolean = false;
  bikeObj: Vehicle;

  constructor(private assetService: AssetManagementService) { }

  ngOnInit() {

  }

  addNewBike(bike) {
    this.bikeObj = {
      // id: (new Date().valueOf()/100),
      id: bike.regno,
      station: bike.station,
      feedbackOrComments: bike.comments,
      status: 'available',
      charge: 0,
      username: "null",
      initMeterReading: 0,
      finalMeterReading: 0,
      rideCount: 0,
      initTime: 0,
      dropTime: 0,
      totalDistance: 0
    }

    // this.http.post("http://localhost:3000/bikes/",this.bikeObj).subscribe((res:Response)=>{
    //   this.isAdded=true;
    // })

    this.assetService.postAsset(this.bikeObj).subscribe(() => {
      this.isAdded = true;
    })

  }


}
