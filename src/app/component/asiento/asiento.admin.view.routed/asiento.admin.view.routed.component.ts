import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AsientoService } from '../../../service/asiento.service';
import { IAsiento } from '../../../model/asiento.interface';
import { CommonModule } from '@angular/common';
import { TrimPipe } from "../../../pipe/trim.pipe";


@Component({
  selector: 'app-asiento.admin.view.routed',
  standalone: true,
  imports: [
    CommonModule,
    TrimPipe,
    RouterModule
],
  templateUrl: './asiento.admin.view.routed.component.html',
  styleUrls: ['./asiento.admin.view.routed.component.css']
})
export class AsientoAdminViewRoutedComponent implements OnInit {
  id: number = 0;
  route: string = '';
  oAsiento: IAsiento = {} as IAsiento;
    
  constructor(private oActivatedRoute: ActivatedRoute, private oAsientoService: AsientoService) { }

  ngOnInit() {
    this.id = this.oActivatedRoute.snapshot.params['id'];
    this.getOne();
  }
  getOne() {
    this.oAsientoService.getOne(this.id).subscribe({
      next: (data: IAsiento) => {
        this.oAsiento = data;
      },
    });
  }
}