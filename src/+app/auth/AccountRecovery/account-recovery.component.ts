import { Component,  Output, EventEmitter, Injectable } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { GlobalValidator, FormMessageService } from '../../FormHelper';
import { Router } from '@angular/router';
import { AuthService } from '../AuthServices';

@Component({
  styles: [`
    .send-email-message ~ .under-link {
      padding-top: 15px;
    }
  `],
  selector: 'account-recovery',
  template: require("./account_recovery_form.pug")
})

@Injectable()
export class AccountRecovery {
  private listMessages: any = {};
  private sendEmail: boolean;
  private email: string;
  public myForm: FormGroup;
  public submitted: boolean = false;
  public logined: boolean = false;
  private error: string;
  constructor(private _fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private message: FormMessageService) {
    this.listMessages = message.createList(["email"]);
    authService.loggedIn$.subscribe(value => {
      this.logined = true;
    });
  }

  ngOnInit() {
      this.myForm = new FormGroup({
          email: new FormControl('', [<any>Validators.required, GlobalValidator.mailFormat]),
      });
  }

  save( data, isValid: boolean) {
    this.submitted = true;
    if( isValid ){
      let self = this;
      this.email = data.email;
      this.authService.recoverPassword( data.email ).subscribe((result) => {
        if (result) {
          this.sendEmail = true;
        }
      }, (err)=>{
        this.error = err;
      });
    }
  }

}

