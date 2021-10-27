import formReducer from "../../reducers/formReducer";

const getImageObj = (name: string, url: string, image: File, id: string) => ({
  name,
  url,
  image,
  id,
});

const TEST_IMG0_NAME = "testImg0";
const TEST_IMG0_URL = "testUrl0";
const TEST_IMG0_FILE = new File(["foo"], `${TEST_IMG0_NAME}.txt`);
const TEST_IMG0_ID = "testImg0.txt3";
const TESTOBJ_IMG0 = getImageObj(
  TEST_IMG0_NAME,
  TEST_IMG0_URL,
  TEST_IMG0_FILE,
  TEST_IMG0_ID
);

const TEST_IMG1_NAME = "testImg1";
const TEST_IMG1_URL = "testUrl1";
const TEST_IMG1_FILE = new File(["foo"], `${TEST_IMG1_NAME}.txt`);
const TEST_IMG1_ID = "testImg1.txt3";
const TESTOBJ_IMG1 = getImageObj(
  TEST_IMG1_NAME,
  TEST_IMG1_URL,
  TEST_IMG1_FILE,
  TEST_IMG1_ID
);

const TEST_IMG2_NAME = "testImg2";
const TEST_IMG2_URL = "testUrl2";
const TEST_IMG2_FILE = new File(["foo"], `${TEST_IMG2_NAME}.txt`);
const TEST_IMG2_ID = "testImg2.txt3";
const TESTOBJ_IMG2 = getImageObj(
  TEST_IMG2_NAME,
  TEST_IMG2_URL,
  TEST_IMG2_FILE,
  TEST_IMG2_ID
);

describe("formReducer", () => {
  let initialState: FormStateI;
  let payload: FormActionPayloadI;
  let payloadUndefined: FormActionPayloadI;

  beforeEach(() => {
    initialState = {
      collectionName: "",
      description: "",
      images: [TESTOBJ_IMG0, TESTOBJ_IMG1],
      mintingPrice: 0,
    };

    payload = {
      newName: "newCollectionName",
      description: "newDescription",
      images: [TESTOBJ_IMG2.image],
      newImgObj: {
        newImageName: "newImageName",
        imageId: `${TESTOBJ_IMG1.id}`,
      },
      price: "1",
      deleteId: TESTOBJ_IMG1.id,
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
    test("Collection Name is changed", () => {
      const expected = { ...initialState };
      expected.collectionName = payload.newName ?? "";
      expect(
        formReducer(initialState, { type: "CHANGE_NAME", payload })
      ).toMatchObject(expected);
    });
  });

  describe("CHANGE_DESCRIPTION", () => {
    test("payload.description should be returned", () => {
      const expected = { ...initialState };
      expected.description = payload.description ?? "";
      expect(
        formReducer(initialState, { type: "CHANGE_DESCRIPTION", payload })
      ).toMatchObject(expected);
    });
  });

  describe("CHANGE_IMAGES", () => {
    test("payload.images should be returned", () => {
      if (payload.images && payload.images[0]) {
        const expected = { ...initialState };
        expected.images = [...expected.images, TESTOBJ_IMG2];
        if (!global.URL.createObjectURL) {
          global.URL.createObjectURL = () => TESTOBJ_IMG2.url;
        }
        const result = formReducer(initialState, {
          type: "CHANGE_IMAGES",
          payload,
        });
        expect(result).toMatchObject(expected);
      }
    });
  });

  describe("CHANGE_IMAGE_NAME", () => {
    test("name of DEFAULT_IMAGE should be changed", () => {
      const expected = { ...initialState };
      expected.images = [
        TESTOBJ_IMG0,
        getImageObj(
          "newImageName",
          TEST_IMG1_URL,
          TEST_IMG1_FILE,
          TEST_IMG1_ID
        ),
      ];
      const result = formReducer(initialState, {
        type: "CHANGE_IMAGE_NAME",
        payload,
      });
      expect(result).toMatchObject(expected);
    });
  });

  describe("DELETE_IMAGE", () => {
    test("state.images should have had an image removed", () => {
      const expected = { ...initialState };
      expected.images = [TESTOBJ_IMG0];
      expect(
        formReducer(initialState, { type: "DELETE_IMAGE", payload })
      ).toMatchObject(expected);
    });
  });

  describe("CHANGE_PRICE", () => {
    test("state.mintingPrice should be changed to payload.price", () => {
      const expected = { ...initialState };
      expected.mintingPrice = Number(payload.price);
      expect(
        formReducer(initialState, { type: "CHANGE_PRICE", payload })
      ).toMatchObject(expected);
    });
  });

  describe("RESET_STATE", () => {
    test("payload.initialState should be returned", () => {
      expect(
        formReducer(initialState, { type: "RESET_STATE", payload })
      ).toMatchObject(initialState);
    });

    test("state should be returned", () => {
      expect(
        formReducer(initialState, {
          type: "RESET_STATE",
          payload: payloadUndefined,
        })
      ).toMatchObject(initialState);
    });
  });
});
