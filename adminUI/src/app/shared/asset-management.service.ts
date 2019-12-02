import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AssetData{
  id: number;
  status: string;
  feedbackOrComments: string;
  station: string;
}

export interface Vehicle{
  charge:number;
  username:string;
  initMeterReading:number;
  finalMeterReading:number;
  rideCount:number;
  initTime:number;
  dropTime:number;
  totalDistance:number;
  id:number;
  station:string;
  feedbackOrComments:string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class AssetManagementService {

  constructor(private http:HttpClient) { }

  getAssetData():Observable<any>{
    return this.http.get("http://localhost:8085/api/v1/asset");
  }

  deleteAsset(id: number):Observable<any>{
    return this.http.delete("http://localhost:8085/api/v1/assetUpdate/"+id);
  }

  postAsset(vehicle: Vehicle): Observable<any>{
    // let body = {vehicle};
    return this.http.post("http://localhost:8085/api/v1/asset/",vehicle);
  }
}
