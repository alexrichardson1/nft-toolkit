const formReducer = (state: FormStateI, action: FormActionI): FormStateI => {
  switch (action.type) {
    case "CHANGE_NAME":
      return {
        ...state,
        collectionName: action.payload as string,
      };
    case "CHANGE_DESCRIPTION":
      return {
        ...state,
        description: action.payload as string,
      };
    case "CHANGE_IMAGES":
      return {
        ...state,
        images: [
          ...state.images,
          ...(action.payload as File[]).map((image) => ({
            image,
            url: URL.createObjectURL(image),
          })),
        ],
      };
    case "CHANGE_PRICE":
      return {
        ...state,
        mintingPrice: parseFloat(action.payload as string),
      };
    default:
      return state;
  }
};

export default formReducer;
