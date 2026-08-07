import { AfterViewInit, Component, ElementRef, Input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import * as L from 'leaflet';
import { MapIncident } from '../../models/dashboard.model';
import { statusColor, statusLabel } from '../../../../shared/utils/status.util';

@Component({
  selector: 'eco-incident-map',
  standalone: true,
  template: `<div #mapContainer class="eco-incident-map"></div>`,
  styles: [`
    .eco-incident-map { width: 100%; height: 100%; min-height: 340px; border-radius: 14px; overflow: hidden; }
  `],
})
export class IncidentMapComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() incidents: MapIncident[] = [];
  @Input() center: [number, number] = [48.8566, 2.3522];
  @Input() zoom = 12;

  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private markers: L.Marker[] = [];

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement).setView(this.center, this.zoom);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    this.renderMarkers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incidents'] && this.map) {
      this.renderMarkers();
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private renderMarkers(): void {
    if (!this.map) return;

    this.markers.forEach((m) => m.remove());
    this.markers = [];

    this.incidents.forEach((incident) => {
      const color = statusColor(incident.status);
      const icon = L.divIcon({
        className: 'eco-map-marker',
        html: `<span style="background:${color.text};width:14px;height:14px;border-radius:50%;display:block;border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.4);"></span>`,
        iconSize: [14, 14],
      });

      const marker = L.marker([incident.lat, incident.lng], { icon }).addTo(this.map!);
      marker.bindPopup(`<strong>${incident.title}</strong><br/>${statusLabel(incident.status)}`);
      this.markers.push(marker);
    });
  }
}
