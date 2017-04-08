import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostComponent }   from './Post/post.component';
import { BemModule } from 'angular-bem';
import { SvgModule } from '../Svg';
import { MomentModule } from 'angular2-moment';
import { PostService } from './PostServices';
import { ImageModule } from '../Image';
import { CollectionModule } from '../Collection';
import { MessageFormModule, FormHelperModule } from '../FormHelper';

@NgModule({
      imports: [BemModule, SvgModule, MomentModule, CommonModule, ImageModule, CollectionModule, MessageFormModule, FormHelperModule],
      exports: [PostComponent],
      declarations: [PostComponent],
      providers: [],
})
export class PostModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: PostModule,
      providers: [PostService]
    }
  }
}
