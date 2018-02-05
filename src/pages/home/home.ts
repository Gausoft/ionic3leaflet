import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import L from 'leaflet';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';

const searchControl = new GeoSearchControl({
  provider: new OpenStreetMapProvider(),
});

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  @ViewChild('map') mapContainer: ElementRef;
  map: any;
  constructor(public navCtrl: NavController) {

  }

  ionViewDidEnter() {
    this.loadmap();
  }
  
  setLeafletMarker(lat, long) {
      L.marker([lat, long])
        .addTo(this.map)
        .bindPopup("<strong>Ma position actuelle :)</strong>");
  };
  getRoute(p1, p2){
      L.Routing.control({
      waypoints: [
        L.latLng(p1.lat, p1.lon),
        L.latLng(p2.lat, p2.lon)
      ]
    }).addTo(this.map);
  }

  loadmap() {
    this.map = L.map("map");
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attributions: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);
    this.map.locate({
      setView: true,
      maxZoom: 10
    }).on('locationfound', (e) => {
      let markerGroup = L.featureGroup();
      let marker: any = L.marker([e.latitude, e.longitude]).on('click', () => {
        
        let agoe = { lat: 6.220818, lon: 1.225829};
        this.getRoute({ lat: e.latitude, lon: e.longitude }, 
          { lat: agoe.lat, lon: agoe.lon })

        this.setLeafletMarker(e.latitude, e.longitude)          
      })
      markerGroup.addLayer(marker);
      this.map.addLayer(markerGroup);
      
      this.map.addControl(searchControl);
      
    }).on('locationerror', (err) => {
      alert(err.message);
    })
  }
  

}