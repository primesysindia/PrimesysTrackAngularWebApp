import { Injectable } from '@angular/core';
import { User } from '../core/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  currUserData: User;
  
  constructor() { }
}
