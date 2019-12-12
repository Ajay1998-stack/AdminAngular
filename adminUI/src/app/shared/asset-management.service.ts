import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

export interface AssetData {
  regNo: String;
  status: string;
  feedbackOrComments: string;
  station: string;
}

// export interface AssetHistory{
//   regNo:String ; //regno
//   charge: number; //console //charge at the end of ride
//   username: String;  //booking // username might be same
//   initMeterReading : number; //booking
//   finalMeterReading : number; //booking
//   rideCount : number; //
//   initTime; //booking
//   Timestamp dropTime; //booking
//   int totalDistance; //
//   String feedbackOrComments; //booking
//   //String status; //booking
//   String station; //booking
//   @Id
//   UUID bookingID;

// }

export interface Vehicle {
  charge: number;
  username: string;
  initMeterReading: number;
  finalMeterReading: number;
  rideCount: number;
  initTime: number;
  dropTime: number;
  totalDistance: number;
  id: number;
  station: string;
  feedbackOrComments: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetManagementService {

  

  webSocketEndPoint: string = 'http://localhost:8085/ws';
  topic: string = "/topic/adminUI";
  stompClient: any;
  bikesData: Subject<any>;
  bikesHistory: Subject<any>;


  topic2: string = "/topic/history";
  stompClient2: any;
  bikesData2: Subject<any>;

  constructor(private http: HttpClient) { 
    this.bikesData = new Subject<any>();
    this.bikesHistory = new Subject<any>();
  }

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
        console.log(sdkEvent.body);
        _this.bikesData.next(sdkEvent.body);                  
      });
      _this.stompClient.subscribe(_this.topic2, function (sdkEvent) {
        console.log(sdkEvent.body);
        _this.bikesHistory.next(sdkEvent.body);  
      });
      //_this.stompClient.reconnect_delay = 2000;
    },(error) => {
      console.log("errorCallBack -> " + error)
      setTimeout(() => {
        // this.connect();
      }, 5000);
    });
  };

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }




  // connect2() {
  //   console.log("Initialize AssetHistory Socket Connection");
  //   let history = new SockJS(this.webSocketEndPoint2);
  //   this.stompClient = Stomp.over(history);
  //   const _this = this;
  //   _this.stompClient.connect({}, function (frame) {
  //     _this.stompClient.subscribe(_this.topic, function (sdkEvent) {
  //       console.log(sdkEvent.body);
  //       _this.bikesData2.next(sdkEvent.body);                  
  //     });
  //     //_this.stompClient.reconnect_delay = 2000;
  //   },(error) => {
  //     console.log("errorCallBack -> " + error)
  //     setTimeout(() => {
  //       // this.connect();
  //     }, 5000);
  //   });
  // };

  // disconnect2() {
  //   if (this.stompClient !== null) {
  //     this.stompClient.disconnect();
  //   }
  //   console.log("Disconnected");
  // }



  getAssetData(): Observable<any> {
    return this.http.get("http://localhost:8085/api/v1/assetentry");
  }

  getAssetHisData(): Observable<any> {
    return this.http.get("http://localhost:8085/api/v2/assetHis");
  }

  deleteAsset(regNo: String): Observable<any> {
    return this.http.delete("http://localhost:8085/api/v1/assetUpdate/" + regNo);
  }

  postAsset(vehicle: Vehicle): Observable<any> {
    // let body = {vehicle};
    return this.http.post("http://localhost:8085/api/v1/asset/", vehicle);
  }
}
