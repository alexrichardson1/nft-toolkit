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
          ...(action.payload.images || []).map((newImage) => ({
            image: newImage,
            url: URL.createObjectURL(newImage),
            name: "",
            id: newImage.name + newImage.size,
          })),
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
            console.log(action.payload.newImageObj.newImageName);
            return {
              ...image,
              name: action.payload.newImageObj.newImageName,
            };
          }
          return image;
        }),
      };
    case "CHANGE_PRICE":
      return {
        ...state,
        mintingPrice: parseFloat(action.payload.price || "0"),
      };
    default:
      return state;
  }
};

export default formReducer;
