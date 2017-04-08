import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ProjectService } from '../ProjectServices/project.service';
import { ErrorCommon } from '../../ErrorHandler';


@Component({
  styles: [`
    .project-list {
      padding-bottom: 90px;
    }

    .container {
      z-index: 4;
      position: relative;
    }
  `],
  selector: 'projects',
  template: require("./template.pug")
})

export class Projects {
  private projects: Array<any> = [];
  private loading: boolean = false;
  private title: string = "";
  private error: ErrorCommon;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService
  ){
    this.title = "You don't have projects yet, create your first one!";
  }

  onSearch(value: any){}

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.loading = true;
      this.projectService.getProjects( 0, 10 ).subscribe( res => {
        console.log(res);
        this.loading = false;
        this.projects = res;
      }, (err: ErrorCommon)=>{
        this.loading = false;
        this.error = err;
      })
    });
  }
}