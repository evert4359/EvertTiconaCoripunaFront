import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { LibeyUserService } from 'src/app/core/service/libeyuser/libeyuser.service';
import { LibeyUser } from 'src/app/entities/libeyuser';
import Swal from 'sweetalert2';


declare var $: any;


@Component({
  selector: 'app-libe-user',
  templateUrl: './libe-user.component.html',
  styleUrls: ['./libe-user.component.css']
})
export class LibeUserComponent implements OnInit {

  liveUser!:LibeyUser;

  listDocumentType:any[] = [];
  listLiveUser:any[] = [];
  listRegion:any[] = [];
  listProvince:any[] = [];
  listUbigeo:any[] = [];

  titulo:any="";

  booleanButtonActualizar:boolean = false;
  booleanButtonGuardar:boolean = false;


  constructor(private frmB: FormBuilder,
    private svcLibeUser:LibeyUserService) { }


  public formFiltroLiveUser = this.frmB.group({
    documentoNumber: new FormControl('')
   });

   public formLiveUser = this.frmB.group({
    documentoNumero:new FormControl(''),
    documentTypeId:new FormControl(0),
    name:new FormControl(''),
    fathersLastName :new FormControl(''),
    mothersLastName :new FormControl(''),
    address :new FormControl(''),
    regionCode :new FormControl(''),
    provinceCode :new FormControl(''),
    ubigeoCode :new FormControl(''),
    phone :new FormControl(''),
    email :new FormControl(''),
    password :new FormControl('')
   });

  ngOnInit(): void {
     this.ListDocumentTypes();
     this.ListDepartamentos();
  }

  ListDocumentTypes() {
    this.listDocumentType=[];
    this.svcLibeUser.ListDocumentType().subscribe(
      (data) => {
        this.listDocumentType = data;
        console.log(this.listDocumentType);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  ListDepartamentos() {
    this.svcLibeUser.ListDepartamento().subscribe(
      (data) => {
        this.listRegion = data;
        console.log(this.listRegion);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  ListProvinces(event: Event) {
    const regionCode = (event.target as HTMLSelectElement).value;
    this.svcLibeUser.ListProvince(regionCode).subscribe(
      (data) => {
        this.listProvince = data;
        console.log(this.listProvince);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }


  ListUbigeos(event: Event) {
    const regionCode =(this.formLiveUser.controls['regionCode'].value);
    const provinceCode= (event.target as HTMLSelectElement).value;
    this.svcLibeUser.ListUbigeo(regionCode, provinceCode).subscribe(
      (data) => {
        this.listUbigeo = data;
        console.log(this.listUbigeo);
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }



  async ListProvincesEditar(regionCode:any,provinceCode:any) {
    debugger
    this.svcLibeUser.ListProvince(regionCode).subscribe(
      (data) => {
        debugger
        this.listProvince = data;
        console.log(this.listProvince);
        debugger
        if (this.listProvince!=null) {
          this.formLiveUser.controls['provinceCode'].setValue(provinceCode);
        }

      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  ListUbigeosEditar(regionCode: any,provinceCode:any,ubigeoCode:any) {
    this.svcLibeUser.ListUbigeo(regionCode, provinceCode).subscribe(
      (data) => {
        this.listUbigeo = data;
        console.log(this.listUbigeo);
        if (this.listUbigeo!=null) {
          this.formLiveUser.controls['ubigeoCode'].setValue(ubigeoCode);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  listaLibeUser(){
    debugger
   let documentNumber=(this.formFiltroLiveUser.controls['documentoNumber'].value);
   this.svcLibeUser.Find(documentNumber).subscribe((data: any) => {
    if (Array.isArray(data)) {
      this.listLiveUser = data;
    } else {
      this.listLiveUser = [data];
    }
    console.log(this.listLiveUser);
  }, error => {
    console.log(error);
  });

  }

  openModalLiveUser(){
    this.titulo="Insert";
    this.booleanButtonActualizar = false;
    this.booleanButtonGuardar = true;
    $('#libeUserModal').modal('show');
  }

  createLiveUser() {
    if (this.formLiveUser.valid) {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Save",
        denyButtonText: `Don't save`
      }).then((result) => {
        if (result.isConfirmed) {
          this.liveUser = {
            documentNumber: this.formLiveUser.controls['documentoNumero'].value,
            documentTypeId: parseInt(this.formLiveUser.controls['documentTypeId'].value),
            name: this.formLiveUser.controls['name'].value,
            fathersLastName: this.formLiveUser.controls['fathersLastName'].value,
            mothersLastName: this.formLiveUser.controls['mothersLastName'].value,
            address: this.formLiveUser.controls['address'].value,
            regionCode: this.formLiveUser.controls['regionCode'].value,
            provinceCode: this.formLiveUser.controls['provinceCode'].value,
            ubigeoCode: this.formLiveUser.controls['ubigeoCode'].value,
            phone: this.formLiveUser.controls['phone'].value,
            email: this.formLiveUser.controls['email'].value,
            password: this.formLiveUser.controls['password'].value,
            active: true
          };

          this.svcLibeUser.createLibeyUser(this.liveUser).subscribe(
            (response) => {
              Swal.fire("Saved!", "", "success");
              console.log('éxito', response);
              this.limpiar();
              this.cerrar();
              this.listaLibeUser();
            },
            (error) => {
              Swal.fire("Error", "No se pudo guardar el usuario", "error");
              console.error('Error', error);
            }
          );
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else {
      Swal.fire("Error", "El formulario no es válido", "error");
    }

  }


  editar(item:any){
    this.titulo="Editar";
    this.booleanButtonActualizar = true;
    this.booleanButtonGuardar = false;
    console.log("EDITAR:",item)
    this.formLiveUser.controls['documentoNumero'].setValue(item.documentNumber);
    this.formLiveUser.controls['documentTypeId'].setValue(item.documentTypeId);
    this.formLiveUser.controls['name'].setValue(item.name);
    this.formLiveUser.controls['fathersLastName'].setValue(item.fathersLastName);
    this.formLiveUser.controls['mothersLastName'].setValue(item.mothersLastName);
    this.formLiveUser.controls['address'].setValue(item.address);
    this.formLiveUser.controls['regionCode'].setValue(item.ubigeoCode.substring(0, 2));
    this.formLiveUser.controls['provinceCode'].setValue(item.ubigeoCode.substring(0, 4));
    this.ListProvincesEditar(item.ubigeoCode.substring(0, 2),item.ubigeoCode.substring(0, 4));
    this.ListUbigeosEditar(item.ubigeoCode.substring(0, 2),item.ubigeoCode.substring(0, 4),item.ubigeoCode);
    //this.formLiveUser.controls['ubigeoCode'].setValue(item.ubigeoCode);
    this.formLiveUser.controls['phone'].setValue(item.phone);
    this.formLiveUser.controls['email'].setValue(item.email);
    this.formLiveUser.controls['password'].setValue(item.password);
    $('#libeUserModal').modal('show');

  }

  updateLiveUser(){
    if (this.formLiveUser.valid) {
      Swal.fire({
        title: "Do you want to save the changes?",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "Update",
        denyButtonText: `Don't update`
      }).then((result) => {
        if (result.isConfirmed) {
          this.liveUser = {
            documentNumber: this.formLiveUser.controls['documentoNumero'].value,
            documentTypeId: parseInt(this.formLiveUser.controls['documentTypeId'].value),
            name: this.formLiveUser.controls['name'].value,
            fathersLastName: this.formLiveUser.controls['fathersLastName'].value,
            mothersLastName: this.formLiveUser.controls['mothersLastName'].value,
            address: this.formLiveUser.controls['address'].value,
            regionCode: this.formLiveUser.controls['regionCode'].value,
            provinceCode: this.formLiveUser.controls['provinceCode'].value,
            ubigeoCode: this.formLiveUser.controls['ubigeoCode'].value,
            phone: this.formLiveUser.controls['phone'].value,
            email: this.formLiveUser.controls['email'].value,
            password: this.formLiveUser.controls['password'].value,
            active: true
          };

          this.svcLibeUser.updateLibeyUser(this.liveUser).subscribe(
            (response) => {
              Swal.fire("Update Exito!", "", "success");
              console.log('éxito', response);
              this.listaLibeUser();
              this.limpiar();
              this.cerrar();
            },
            (error) => {
              Swal.fire("Error", "No se pudo guardar el usuario", "error");
              console.error('Error', error);
            }
          );
        } else if (result.isDenied) {
          Swal.fire("Changes are not saved", "", "info");
        }
      });
    } else {
      Swal.fire("Error", "El formulario no es válido", "error");
    }
  }

  cerrar(){
    $('#libeUserModal').modal('hide')
  }
  eliminarFila(item:any){

  }


  limpiar(){
    this.formLiveUser.controls['documentoNumero'].setValue("");
    this.formLiveUser.controls['documentTypeId'].setValue(0);
    this.formLiveUser.controls['name'].setValue("");
    this.formLiveUser.controls['fathersLastName'].setValue("");
    this.formLiveUser.controls['mothersLastName'].setValue("");
    this.formLiveUser.controls['address'].setValue("");
    this.formLiveUser.controls['regionCode'].setValue("");
    this.formLiveUser.controls['provinceCode'].setValue("");
    this.formLiveUser.controls['ubigeoCode'].setValue("");
    this.formLiveUser.controls['phone'].setValue("");
    this.formLiveUser.controls['email'].setValue("");
    this.formLiveUser.controls['password'].setValue("");
  }

}





