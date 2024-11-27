import { Component, OnInit } from '@angular/core';
import { CuentaService } from '../../../service/cuenta.service';
import { ICuenta } from '../../../model/cuenta.interface';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-cuenta.admin.routed',
  templateUrl: './cuenta.xtipocuenta.admin.plist.routed.component.html',
  styleUrls: ['./cuenta.xtipocuenta.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class CuentaXTipoCuentaAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<ICuenta> | null = null;
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

  oTipocuenta: ITipocuenta = {} as ITipocuenta;

  constructor(
    private oCuentaService: CuentaService,
    private oTipocuentaService: TipoCuentaService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute
  ) {
    this.debounceSubject.pipe(debounceTime(500)).subscribe((value) => {
      this.nPage = 0;
      this.getPage();
    });
    // get id from route admin/cuenta/plist/xtipocuenta/:id
    this.oActivatedRoute.params.subscribe((params) => {
      this.oTipocuentaService.get(params['id']).subscribe({
        next: (oTipocuenta: ITipocuenta) => {
          this.oTipocuenta = oTipocuenta;
          this.getPage();
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        },
      });
    });
  }

  ngOnInit() {
    this.getPage();
  }

  getPage() {
    this.oCuentaService
      .getPageXTipoCuenta(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oTipocuenta.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<ICuenta>) => {
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

  edit(oCuenta: ICuenta) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/cuenta/edit/', oCuenta.id]);
  }

  view(oCuenta: ICuenta) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/cuenta/view/', oCuenta.id]);
  }

  remove(oCuenta: ICuenta) {
    this.oRouter.navigate(['admin/cuenta/delete/', oCuenta.id]);
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
