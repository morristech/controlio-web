import { ProjectModel } from '../projects/Project.model';
import { ImageGalleryModel } from '../helpers/image-galery/ImageGallery.model';
import { ImageModel } from '../helpers/imgb/imgb.model';
import { User } from '../users/user.model';
import { IRemovableImage } from '../helpers/image-galery/IRemovableImage.interface';

export class PostModel implements IRemovableImage {
	protected _id: string;
  get id(){
    return this._id;
  }

	protected _project: ProjectModel;
  get project(){
    return this._project;
  }

	protected _sender: User;
  get sender(){
    return this._sender;
  }

	protected _date: string;
	set date(date: string){
		this._date = date;
	}
	get date(){
		return this._date;
	}

	protected _message: string;
	set message(message: string){
		this._message = message;
	}
	get message(){
		return this._message;
	}

	protected _type: string = 'post';
	get type(){
		return this._type;
	}

	protected _gallery: ImageGalleryModel = null;
	set gallery(gallery: ImageGalleryModel){
		this._gallery = gallery;
	}
	get gallery(){
		return this._gallery;
	}

	protected _editable: boolean;
  get editable(){
    return this._editable;
  }
	protected _removable: boolean;
  get removable(){
    return this._removable;
  }

	constructor( id: string, sender: User, project: ProjectModel, date: string, message?: string, editable?: boolean, removable?: boolean, attachments?: string[] ){
		this._id = id;
		this._sender = sender;
		if(message) this.message = message;
		this._project = project;
		this._editable = false || editable;
		this._removable = false || removable;

		if(attachments != null){
			let images = this.createImageFromKeys( attachments );
			if(images.length > 0){
        this._gallery = new ImageGalleryModel(images, this);
      }
		}
	}

	removeImage(image: ImageModel){
		console.log("Good! Remove image:", image)
	}

	createImageFromKeys( keys: string[] ){
    let images = [];

    keys.forEach((key)=>{
      images.push(new ImageModel(key, true))
    })

    return images;
	}
}
