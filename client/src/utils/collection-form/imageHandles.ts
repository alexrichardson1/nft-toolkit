import FormActions from "actions/formActions";
import { FormActionI } from "reducers/formReducerTypes";

export const handleImageDrop = (
  e: React.DragEvent<HTMLLabelElement> | React.ChangeEvent<HTMLInputElement>,
  dispatch: React.Dispatch<FormActionI>,
  generative: boolean
) => {
  return (imgObjs: FileList | null, layerName = ""): void => {
    e.preventDefault();
    if (!imgObjs) {
      return;
    }
    const payload = generative
      ? { newImagesGen: { images: Array.from(imgObjs), layerName } }
      : { newImagesStatic: Array.from(imgObjs) };
    dispatch({
      type: generative
        ? FormActions.ADD_IMAGES_GEN
        : FormActions.ADD_IMAGES_STATIC,
      payload,
    });
  };
};

export const handleImageDelete = (
  deleteId: string,
  dispatch: React.Dispatch<FormActionI>,
  generative: boolean
) => {
  return (layerName = ""): void => {
    const payload = generative
      ? { deleteGen: { deleteId, layerName } }
      : { deleteId };
    dispatch({
      type: generative
        ? FormActions.DELETE_IMAGE_GEN
        : FormActions.DELETE_IMAGE_STATIC,
      payload,
    });
  };
};

export const handleImgNameChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>,
  generative: boolean
) => {
  return (imageid: string, layerName = ""): void => {
    const payload = generative
      ? {
          modifyImgObjGen: {
            newImageName: e.target.value,
            imageId: imageid,
            layerName,
          },
        }
      : {
          modifyImgObjStatic: {
            newImageName: e.target.value,
            imageId: imageid,
          },
        };
    dispatch({
      type: generative
        ? FormActions.CHANGE_IMAGE_NAME_GEN
        : FormActions.CHANGE_IMAGE_NAME,
      payload,
    });
  };
};

export const handleImgDescChange = (
  e: InputEventT,
  dispatch: React.Dispatch<FormActionI>
) => {
  return (imageId: string): void => {
    dispatch({
      type: FormActions.CHANGE_IMAGE_DESC,
      payload: { imageDescChange: { imageId, newDesc: e.target.value } },
    });
  };
};
