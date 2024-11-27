import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TipoCuentaService } from '../../../service/tipoCuenta.service';
import { ITipocuenta } from '../../../model/tipocuenta.interface';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';


declare let bootstrap: any;

@Component({
  selector: 'app-tipoCuenta-admin-edit-routed',
  templateUrl: './tipoCuenta.admin.edit.routed.component.html',
  styleUrls: ['./tipoCuenta.admin.edit.routed.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
})
export class TipoCuentaAdminEditRoutedComponent implements OnInit {
  id: number = 0;
  oTipoCuentaForm: FormGroup | undefined = undefined;
  oTipoCuenta: ITipocuenta | null = null;
  message: string = '';
  myModal: any;

  constructor(
    private oActivatedRoute: ActivatedRoute,
    private oTipoCuentaService: TipoCuentaService,
    private oRouter: Router
  ) {
    this.oActivatedRoute.params.subscribe((params) => {
      this.id = params['id'];
    });
  }

  ngOnInit() {
    this.createForm();
    this.get();
    this.oTipoCuentaForm?.markAllAsTouched();
  }

  createForm() {
    this.oTipoCuentaForm = new FormGroup({
      id: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      creditoOdebito: new FormControl('', [
        Validators.required,
        Validators.pattern('^[01]$'),
      ]),
      comentarios: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(255),
      ]),
      realOnominal: new FormControl('', [
        Validators.required,
        Validators.pattern('^[01]$'),
      ]),
    });
  }

  

  onReset() {
    this.oTipoCuentaService.get(this.id).subscribe({
      next: (oTipoCuenta: ITipocuenta) => {
        this.oTipoCuenta = oTipoCuenta;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
    return false;
  }

  updateForm() {
    this.oTipoCuentaForm?.controls['id'].setValue(this.oTipoCuenta?.id);
    this.oTipoCuentaForm?.controls['descripcion'].setValue(this.oTipoCuenta?.descripcion);
    this.oTipoCuentaForm?.controls['creditoodebito'].setValue(this.oTipoCuenta?.creditoodebito);
    this.oTipoCuentaForm?.controls['comentarios'].setValue(this.oTipoCuenta?.comentarios);
    this.oTipoCuentaForm?.controls['realonominal'].setValue(this.oTipoCuenta?.realonominal);
  }

  get() {
    this.oTipoCuentaService.get(this.id).subscribe({
      next: (oTipoCuenta: ITipocuenta
      ) => {
        this.oTipoCuenta = oTipoCuenta;
        this.updateForm();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  showModal(mensaje: string) {
    this.message = mensaje;
    this.myModal = new bootstrap.Modal(document.getElementById('mimodal'), {
      keyboard: false,
    });
    this.myModal.show();
  }

  hideModal = () => {
    this.myModal.hide();
    this.oRouter.navigate(['/admin/tipoCuenta/view/' + this.oTipoCuenta?.id]);
  };

  onSubmit() {
    if (!this.oTipoCuentaForm?.valid) {
      this.showModal('Formulario no válido');
      return;
    } else {
      this.oTipoCuentaService.update(this.oTipoCuentaForm?.value).subscribe({
        next: (oTipoCuenta: ITipocuenta) => {
          this.oTipoCuenta = oTipoCuenta;
          this.updateForm();
          this.showModal('TipoCuenta ' + this.oTipoCuenta.id + ' actualizado');
        },
        error: (error) => {
          this.showModal('Error al actualizar el TipoCuenta');
          console.error(error);
        },
      });
    }
  }
}
