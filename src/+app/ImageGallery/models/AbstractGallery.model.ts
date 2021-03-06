import { Injectable } from '@angular/core';

export interface IGalleryModel<T> {
  index: number;
  elements: T[];
  getNextElement() : T;
  getPrevElement() : T;
  currentElement: T;
}

export interface IServiceGallery<T> {
  index: number;
  elements: T[];
  getNextElement() : T;
  getPrevElement() : T;
  getElementFromIndex(index: number) : T | null;
  currentElement: T;
}


export abstract class ServiceGallery<T> implements IServiceGallery<T> {
  protected _elements: T[] = [];
  get elements() : T[] {
    return this._elements;
  }
  set elements(elements: T[]){
    this._elements = elements;
  }

  protected _index: number = 0;
  get index(){
    return this._index;
  }
  set index(index: number){
    this._index = index;
  }

  getElementFromIndex(index: number) : T | null {
    if(this._elements.length < index || index < 0 ) return null;
    let elem = this._elements[index];
    return (elem) ? elem : null;
  }

  getNextElement() : T | null {
    if(this._index < this._elements.length){
      this._index++;
      return this.currentElement;
    } else {
      return null;
    }
  }

  getPrevElement() : T | null {
    if(this._index > 0){
      this._index--;
      return this.currentElement;
    } else {
      return null;
    }
  }

  get currentElement() : T {
    return this.getElementFromIndex(this._index);
  }
}


@Injectable()
export class CircularGallery<T> extends ServiceGallery<T> {

  constructor(){
    super();
  }

  getNextElement() : T {
    if(this._index == this._elements.length - 1){
      this._index = 0;
    } else {
      this._index++;
    }
    return this.currentElement;
  }

  getPrevElement() : T{
    if(this._index <= 0){
      this._index = this._elements.length - 1;
    } else {
      this._index--;
    }
    return this.currentElement;
  }

  get currentElement() : T {
    if(this._index >= this._elements.length ){
      this._index = this._elements.length - 1;
    } else if(this._index < 0){
      this._index = 0;
    }
    return this.getElementFromIndex(this._index);
  }
}

export abstract class AbsctractGalleryModel<T> implements IGalleryModel<T> {

  constructor(elements: T[], private service: ServiceGallery<T> ){
    this.service.elements = elements;
  }

  get elements() : T[] {
    return this.service.elements;
  }

  setIndexFromElem(elem: T){
    this.service.index = this.elements.indexOf(elem) > -1 ? this.elements.indexOf(elem) : 0;
  }

  setIndex(index: number){
    this.service.index = index;
  }

  get index(){
    return this.service.index;
  }

  getNextElement() : T {
    return this.service.getNextElement();
  }

  getPrevElement() : T {
    return this.service.getPrevElement();
  }

  get currentElement() : T {
    return this.service.currentElement;
  }

  getElementFromIndex(index: number): T {
    return this.service.getElementFromIndex(index)
  }
}
