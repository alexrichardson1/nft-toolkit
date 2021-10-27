import formReducer from "../../reducers/formReducer";

describe("formReducer", () => {
  const DEFAULT_IMAGE = new File(["foo"], "testName.txt");
  const DEFAULT_IMAGE_ID = "testName.txt3";
  let state: FormStateI;
  let initialState: FormStateI;
  let payload: FormActionPayloadI;
  let payloadUndefined: FormActionPayloadI;

  beforeEach(() => {
    state = {
      collectionName: "",
      description: "",
      images: [],
      mintingPrice: 0,
    };

    initialState = {
      collectionName: "",
      description: "",
      images: [],
      mintingPrice: 0,
    };

    payload = {
      newName: "newCollectionName",
      description: "newDescription",
      images: [DEFAULT_IMAGE],
      newImgObj: {
        newImageName: "newImageName",
        imageId: `${DEFAULT_IMAGE_ID}`,
      },
      price: "1",
      deleteId: `${DEFAULT_IMAGE_ID}`,
      initialState: initialState,
    };

    payloadUndefined = {
      newName: "",
      description: "",
      images: [],
      newImgObj: { newImageName: "", imageId: "" },
      price: "",
      deleteId: "",
    };
  });

  describe("CHANGE_NAME", () => {
    test("payload.newName should be returned", () => {
      const expected = initialState;
      expected.collectionName = payload.newName ?? "";
      expect(
        formReducer(state, { type: "CHANGE_NAME", payload })
      ).toMatchObject(expected);
    });
  });

  describe("CHANGE_DESCRIPTION", () => {
    test("payload.description should be returned", () => {
      const expected = initialState;
      expected.description = payload.description ?? "";
      expect(
        formReducer(state, { type: "CHANGE_DESCRIPTION", payload })
      ).toMatchObject(expected);
    });
  });

  describe("CHANGE_IMAGES", () => {
    test("payload.images should be returned", () => {
      if (payload.images && payload.images[0]) {
        const expected = initialState;
        expected.images = [
          {
            image: payload.images[0],
            url: "testUrl",
            name: "testName",
            id: DEFAULT_IMAGE_ID,
          },
        ];
        if (!global.URL.createObjectURL) {
          global.URL.createObjectURL = () => "testUrl";
        }
        const result = formReducer(state, { type: "CHANGE_IMAGES", payload });
        expect(result).toMatchObject(expected);
      }
    });
  });

  describe("CHANGE_IMAGE_NAME", () => {
    test("name of DEFAULT_IMAGE should be changed", () => {
      if (payload.images && payload.images[0]) {
        const expected = initialState;
        expected.images = [
          {
            image: payload.images[0],
            url: "testUrl",
            name: "newImageName",
            id: DEFAULT_IMAGE_ID,
          },
        ];
        const newState = state;
        newState.images = [
          {
            image: payload.images[0],
            url: "testUrl",
            name: "testName",
            id: DEFAULT_IMAGE_ID,
          },
        ];

        const result = formReducer(newState, {
          type: "CHANGE_IMAGE_NAME",
          payload,
        });
        expect(result).toMatchObject(expected);
      }
    });
  });

  describe("DELETE_IMAGE", () => {
    test("state.images should have had an image removed", () => {
      const expected = initialState;
      expected.images = [];
      expect(
        formReducer(state, { type: "DELETE_IMAGE", payload })
      ).toMatchObject(expected);
    });
  });

  describe("CHANGE_PRICE", () => {
    test("state.mintingPrice should be changed to payload.price", () => {
      const expected = initialState;
      expected.mintingPrice = Number(payload.price);
      expect(
        formReducer(state, { type: "CHANGE_PRICE", payload })
      ).toMatchObject(expected);
    });
  });

  describe("RESET_STATE", () => {
    test("payload.initialState should be returned", () => {
      expect(
        formReducer(state, { type: "RESET_STATE", payload })
      ).toMatchObject(initialState);
    });

    test("state should be returned", () => {
      expect(
        formReducer(state, { type: "RESET_STATE", payload: payloadUndefined })
      ).toMatchObject(state);
    });
  });
});
