import { Component, OnInit } from '@angular/core';
import { AsientoService } from '../../../service/asiento.service';
import { IAsiento } from '../../../model/asiento.interface';
import { CommonModule } from '@angular/common';
import { IPage } from '../../../model/model.interface';
import { FormsModule } from '@angular/forms';
import { BotoneraService } from '../../../service/botonera.service';
import { debounceTime, Subject } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TrimPipe } from '../../../pipe/trim.pipe';
import { UsuarioService } from '../../../service/usuario.service';
import { IUsuario } from '../../../model/usuario.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ITipoasiento } from '../../../model/tipoasiento.interface';
import { TipoAsientoService } from '../../../service/tipoAsiento.service';
import { IPeriodo } from '../../../model/periodo.interface';
import { PeriodoService } from '../../../service/periodo.service';

@Component({
  selector: 'app-asiento-xperiodo-admin-routed',
  templateUrl: './asiento.xperiodo.admin.plist.routed.component.html',
  styleUrls: ['./asiento.xperiodo.admin.plist.routed.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, TrimPipe, RouterModule],
})
export class AsientoXPeriodoAdminPlistRoutedComponent implements OnInit {
  oPage: IPage<IAsiento> | null = null;
  //
  nPage: number = 0; // 0-based server count
  nRpp: number = 10;
  //
  strField: string = '';
  strDir: string = '';
  //
  strFiltro: string = '';
  //
  arrBotonera: string[] = [];
  //
  private debounceSubject = new Subject<string>();
  //
  oPeriodo: IPeriodo = {} as IPeriodo;

  constructor(
    private oAsientoService: AsientoService,
    private oBotoneraService: BotoneraService,
    private oRouter: Router,
    private oActivatedRoute: ActivatedRoute,
    private oPeriodoService: PeriodoService
  ) {
    this.debounceSubject.pipe(debounceTime(10)).subscribe((value) => {
      this.getPage();
    });
    // get id from route admin/asiento/plist/xusuario/:id
    this.oActivatedRoute.params.subscribe((params) => {
      this.oPeriodoService.get(params['id']).subscribe({
        next: (oPeriodo: IPeriodo) => {
          this.oPeriodo = oPeriodo;
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
    
    this.oAsientoService
      .getPageXPeriodo(
        this.nPage,
        this.nRpp,
        this.strField,
        this.strDir,
        this.strFiltro,
        this.oPeriodo.id
      )
      .subscribe({
        next: (oPageFromServer: IPage<IAsiento>) => {
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

  edit(oAsiento: IAsiento) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/asiento/edit', oAsiento.id]);
  }

  view(oAsiento: IAsiento) {
    //navegar a la página de edición
    this.oRouter.navigate(['admin/asiento/view', oAsiento.id]);
  }

  remove(oAsiento: IAsiento) {
    this.oRouter.navigate(['admin/asiento/delete/', oAsiento.id]);
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
