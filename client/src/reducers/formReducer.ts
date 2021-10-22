const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...state,
        collectionName: action.payload.newName || "",
      };
    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload.description || "",
      };
    case "CHANGE_IMAGES":
      return {
        ...state,
        images: [
          ...state.images,
          ...(action.payload.images || []).map((newImage) => {
            return {
              image: newImage,
              url: URL.createObjectURL(newImage),
              name: newImage.name.replace(/\.[^/.]+$/, ""),
              id: newImage.name + newImage.size,
            };
          }),
        ],
      };
    case "CHANGE_IMAGE_NAME":
      return {
        ...state,
        images: state.images.map((image) => {
          if (
            action.payload.newImageObj &&
            image.id === action.payload.newImageObj.imageId
          ) {
            return {
              ...image,
              name: action.payload.newImageObj.newImageName,
            };
          }
          return image;
        }),
      };
    case "DELETE_IMAGE":
      return {
        ...state,
        images: state.images.filter(
          (image) => image.id !== action.payload.deleteId
        ),
      };
    case "CHANGE_PRICE":
      return {
        ...state,
        mintingPrice: parseFloat(action.payload.price || ""),
      };
    case "RESET_STATE":
      return action.payload.initialState || state;
    default:
      return state;
  }
};

export default formReducer;
