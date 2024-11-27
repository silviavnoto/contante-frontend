import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { IApunte } from '../../../model/apunte.interface';
import { ApunteService } from '../../../service/apunte.service';
import { ISubcuenta } from '../../../model/subcuenta.interface';
import { SubcuentaService } from '../../../service/subcuenta.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-apunte.xsubcuenta.admin.plist.routed',
  templateUrl: './apunte.xsubcuenta.admin.plist.routed.component.html',
  styleUrls: ['./apunte.xsubcuenta.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule]
})
export class ApunteXSubcuentaAdminPlistRoutedComponent implements OnInit {

  oPage: IPage<IApunte> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = 'desc';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();

  oSubcuenta: ISubcuenta = {} as ISubcuenta;

  constructor(
    private oApunteService: ApunteService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oSubcuentaService: SubcuentaService
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
    // get id from route admin/asiento/plist/xsubcuenta/:id
    this.oActivatedRoute.params.subscribe((params) => {
      this.oSubcuentaService.get(params['id']).subscribe({  
        next: (oSubcuenta: ISubcuenta) => {
          this.oSubcuenta = oSubcuenta;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    });
  }

  ngOnInit() {
  }

  getPage() {
    this.oApunteService
      .getPageXSubcuenta(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oSubcuenta.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<IApunte>) => {
          this.oPage = oPageFromServer;
          this.arrBotonera = this.oBotoneraService.getBotonera(
            this.nPage,
            oPageFromServer.totalPages
          );
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  edit(oApunte: IApunte) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/apunte/edit', oApunte.id]);
  }

  view(oApunte: IApunte) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/apunte/view', oApunte.id]);
  }

  remove(oApunte: IApunte) {
    this.oRouter.navigate(['admin/apunte/delete/', oApunte.id]);
  }

  goToPage(p: number) {
    if (p) {
      this.nPage = p - 1;
      this.getPage();
    }
    return false;
  }

  goToNext() {
    this.nPage++;
    this.getPage();
    return false;
  }

  goToPrev() {
    this.nPage--;
    this.getPage();
    return false;
  }

  sort(field: string) {
    this.strField = field;
    this.strDir = this.strDir === 'asc' ? 'desc' : 'asc';
    this.getPage();
  }

  goToRpp(nrpp: number) {
    this.nPage = 0;
    this.nRpp = nrpp;
    this.getPage();
    return false;
  }

  filter(event: KeyboardEvent) {
    this.debounceSubject.next(this.strFiltro);
  }
}
