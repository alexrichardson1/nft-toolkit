const FILE_EXTENSION = /\.[^/.]+$/;
const DEFAULT_STRING = "";
const DEFAULT_FILE_ARRAY: File[] = [];

const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...state,
        collectionName: action.payload.newName ?? DEFAULT_STRING,
      };
    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload.description ?? DEFAULT_STRING,
      };
    case "CHANGE_IMAGES":
      return {
        ...state,
        images: [
          ...state.images,
          ...(action.payload.images ?? DEFAULT_FILE_ARRAY).map((newImage) => ({
            image: newImage,
            url: URL.createObjectURL(newImage),
            name: newImage.name.replace(FILE_EXTENSION, ""),
            id: newImage.name + newImage.size,
          })),
        ],
      };
    case "CHANGE_IMAGE_NAME":
      return {
        ...state,
        images: state.images.map((imgObj) => {
          if (
            action.payload.newImgObj &&
            imgObj.id === action.payload.newImgObj.imageId
          ) {
            return {
              ...imgObj,
              name: action.payload.newImgObj.newImageName,
            };
          }
          return imgObj;
        }),
      };
    case "DELETE_IMAGE":
      return {
        ...state,
        images: state.images.filter(
          (imgObj) => imgObj.id !== action.payload.deleteId
        ),
      };
    case "CHANGE_PRICE":
      return {
        ...state,
        mintingPrice: Number(action.payload.price ?? DEFAULT_STRING),
      };
    case "RESET_STATE":
      return action.payload.initialState ?? state;
    default:
      return state;
  }
};

export default formReducer;
