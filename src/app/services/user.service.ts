import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserListByName(searchString: string) {
      return this.http.get('https://api.github.com/search/users?q=' + searchString);
  }

  getUserDetailByName(userName: string) {
      return this.http.get('https://api.github.com/users/' + userName + '/repos');
  }
}
