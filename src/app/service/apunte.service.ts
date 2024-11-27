import { Injectable } from '@angular/core';
import { httpOptions, serverURL } from '../environment/environment';
import { HttpClient } from '@angular/common/http';
import { IApunte } from '../model/apunte.interface';
import { IPage } from '../model/model.interface';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root',
})
export class ApunteService {
  serverURL: string = serverURL + '/apunte';

  constructor(private oHttp: HttpClient) {}

  getPage(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string
  ): Observable<IPage<IApunte>> {
    let URL: string = '';
    URL += this.serverURL;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<IApunte>>(URL, httpOptions);
  }

  getPageXSubcuenta(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_subcuenta: number
  ): Observable<IPage<IApunte>> {
    let URL: string = '';
    URL += this.serverURL + '/xsubcuenta/' + id_subcuenta;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<IApunte>>(URL, httpOptions);
  }

  getPageXAsiento(  
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_asiento: number
  ): Observable<IPage<IApunte>> {
  
    let URL: string = '';
    URL += this.serverURL + '/xasiento/' + id_asiento;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<IApunte>>(URL, httpOptions);
  }

  getPageXTipoApunte(
    page: number,
    size: number,
    field: string,
    dir: string,
    filtro: string,
    id_tipoapunte: number
  ): Observable<IPage<IApunte>> {
    let URL: string = '';
    URL += this.serverURL + '/xtipoapunte/' + id_tipoapunte;
    if (!page) {
      page = 0;
    }
    URL += '?page=' + page;
    if (!size) {
      size = 10;
    }
    URL += '&size=' + size;
    if (field) {
      URL += '&sort=' + field;
      if (dir === 'asc') {
        URL += ',asc';
      } else {
        URL += ',desc';
      }
    }
    if (filtro) {
      URL += '&filter=' + filtro;
    }
    return this.oHttp.get<IPage<IApunte>>(URL, httpOptions);
  }

  get(id: number): Observable<IApunte> {
    let URL: string = '';
    URL += this.serverURL;
    URL += '/' + id;
    return this.oHttp.get<IApunte>(URL);
  }

  create(oApunte: IApunte): Observable<IApunte> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IApunte>(URL, oApunte);
  }

  update(oApunte: IApunte): Observable<IApunte> {
    let URL: string = '';
    URL += this.serverURL;
    return this.oHttp.put<IApunte>(URL, oApunte);
  }

  getOne(id: number): Observable<IApunte> {
    let URL: string = '';
    URL += 'http://localhost:8085';
    URL += '/apunte';
    URL += '/' + id;
    return this.oHttp.get<IApunte>(URL);
  }

  delete(id: number) {
    return this.oHttp.delete('http://localhost:8085/apunte/' + id);
  }
}
