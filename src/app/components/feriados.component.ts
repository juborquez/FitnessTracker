import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonChip,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/angular/standalone';
import { FeriadosService, Feriado } from '../services/feriados.service';
import { calendarOutline, timeOutline, alertCircleOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-feriados',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Feriados Chile</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" (ionRefresh)="handleRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-searchbar
        [debounce]="500"
        (ionInput)="handleSearch($event)"
        placeholder="Buscar feriado"
        [animated]="true"
      ></ion-searchbar>

      <ion-card *ngIf="proximosFeriados.length > 0">
        <ion-card-header>
          <ion-card-title>Próximos Feriados</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <ion-item *ngFor="let feriado of proximosFeriados">
              <ion-label>
                <h2>{{ feriado.nombre }}</h2>
                <p>{{ feriado.fecha | date:'fullDate':'':'es' }}</p>
              </ion-label>
              <ion-badge slot="end" [color]="feriado.irrenunciable ? 'danger' : 'primary'">
                {{ feriado.irrenunciable ? 'Irrenunciable' : feriado.tipo }}
              </ion-badge>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <div class="ion-padding">
        <ion-chip (click)="filtrarPorTipo('Civil')" [color]="filtroTipo === 'Civil' ? 'primary' : 'medium'">
          <ion-icon name="calendar-outline"></ion-icon>
          <ion-label>Civil</ion-label>
        </ion-chip>
        <ion-chip (click)="filtrarPorTipo('Religioso')" [color]="filtroTipo === 'Religioso' ? 'primary' : 'medium'">
          <ion-icon name="time-outline"></ion-icon>
          <ion-label>Religioso</ion-label>
        </ion-chip>
        <ion-chip (click)="mostrarIrrenunciables()" [color]="soloIrrenunciables ? 'primary' : 'medium'">
          <ion-icon name="alert-circle-outline"></ion-icon>
          <ion-label>Irrenunciables</ion-label>
        </ion-chip>
      </div>

      <ion-list *ngIf="!loading; else skeleton">
        <ion-item *ngFor="let feriado of feriadosFiltrados">
          <ion-label>
            <h2>{{ feriado.nombre }}</h2>
            <p>{{ feriado.fecha | date:'fullDate':'':'es' }}</p>
            <p *ngIf="feriado.comentarios">{{ feriado.comentarios }}</p>
          </ion-label>
          <ion-badge slot="end" [color]="feriado.irrenunciable ? 'danger' : 'primary'">
            {{ feriado.irrenunciable ? 'Irrenunciable' : feriado.tipo }}
          </ion-badge>
        </ion-item>
      </ion-list>

      <ng-template #skeleton>
        <ion-list>
          <ion-item *ngFor="let i of [1,2,3,4,5]">
            <ion-label>
              <h2><ion-skeleton-text animated style="width: 70%"></ion-skeleton-text></h2>
              <p><ion-skeleton-text animated style="width: 50%"></ion-skeleton-text></p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ng-template>
    </ion-content>
  `,
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonList,
    IonItem,
    IonLabel,
    IonBadge,
    IonSkeletonText,
    IonRefresher,
    IonRefresherContent,
    IonSearchbar,
    IonChip,
    IonIcon,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle
  ]
})
export class FeriadosComponent implements OnInit {
  feriados: Feriado[] = [];
  feriadosFiltrados: Feriado[] = [];
  proximosFeriados: Feriado[] = [];
  loading = true;
  filtroTipo: string | null = null;
  soloIrrenunciables = false;
  searchTerm = '';

  constructor(private feriadosService: FeriadosService) {
    addIcons({ calendarOutline, timeOutline, alertCircleOutline });
  }

  ngOnInit() {
    this.cargarFeriados();
  }

  cargarFeriados() {
    this.loading = true;
    this.feriadosService.getFeriados().subscribe({
      next: (data) => {
        this.feriados = data;
        this.feriadosFiltrados = data;
        this.cargarProximosFeriados();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  cargarProximosFeriados() {
    this.feriadosService.getProximosFeriados(3).subscribe({
      next: (data) => {
        this.proximosFeriados = data;
      }
    });
  }

  handleRefresh(event: any) {
    this.cargarFeriados();
    event.target.complete();
  }

  handleSearch(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    this.aplicarFiltros();
  }

  filtrarPorTipo(tipo: string) {
    this.filtroTipo = this.filtroTipo === tipo ? null : tipo;
    this.aplicarFiltros();
  }

  mostrarIrrenunciables() {
    this.soloIrrenunciables = !this.soloIrrenunciables;
    this.aplicarFiltros();
  }

  private aplicarFiltros() {
    let resultado = this.feriados;

    if (this.searchTerm) {
      resultado = resultado.filter(feriado => 
        feriado.nombre.toLowerCase().includes(this.searchTerm) ||
        feriado.comentarios?.toLowerCase().includes(this.searchTerm)
      );
    }

    if (this.filtroTipo) {
      resultado = resultado.filter(feriado => feriado.tipo === this.filtroTipo);
    }

    if (this.soloIrrenunciables) {
      resultado = resultado.filter(feriado => feriado.irrenunciable);
    }

    this.feriadosFiltrados = resultado;
  }
}