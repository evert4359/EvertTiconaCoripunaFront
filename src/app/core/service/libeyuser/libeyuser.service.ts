import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../environments/environment";
import { LibeyUser } from "src/app/entities/libeyuser";
@Injectable({
	providedIn: "root",
})
export class LibeyUserService {

  private readonly baseUrl:string = environment.pathLibeyTechnicalTest;

	constructor(private http: HttpClient) {}


  ListDocumentType(): Observable<any> {
    const uri = `${this.baseUrl}DocumentType/listDocumentType`;
    return this.http.get<any>(uri);
  }

  ListDepartamento(): Observable<any> {
    const uri = `${this.baseUrl}Region/listRegion`;
    return this.http.get<any>(uri);
  }


  ListProvince(regionCode: string): Observable<any> {
    const uri = `${this.baseUrl}Province/listProvince?regionCode=${regionCode}`;
    return this.http.get<any>(uri);
  }

  ListUbigeo(regionCode: string, provinceCode: string): Observable<any> {
    const uri = `${this.baseUrl}Ubigeo/listUbigeo?regionCode=${regionCode}&provinceCode=${provinceCode}`;
    return this.http.get<any>(uri);
  }

  createLibeyUser(user: LibeyUser): Observable<any> {
    const uri = `${this.baseUrl}LibeyUser/Create`;
    return this.http.post<any>(uri, user);
  }

  updateLibeyUser(user: LibeyUser): Observable<any> {
    const uri = `${this.baseUrl}LibeyUser/Update`;
    return this.http.post<any>(uri, user);
  }

	Find(documentNumber: string): Observable<LibeyUser> {
    debugger
		const uri = `${this.baseUrl}LibeyUser/${documentNumber}`;
		return this.http.get<LibeyUser>(uri);
	}



}

