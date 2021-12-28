import FormActions from "actions/formActions";
import formReducer from "../../reducers/formReducer";

const EMPTY_STATE: FormStateI = {
  twitterHandle: "",
  redditHandle: "",
  collectionName: "",
  description: "",
  symbol: "",
  mintingPrice: "",
  static: { images: {}, numberOfImages: 0 },
  generative: {
    numberOfTiers: 0,
    totalTierRarity: 0,
    tiers: [],
    layers: [],
    numberOfLayers: 0,
    quantity: "1",
  },
  marketplace: { wanted: false, royalty: "" },
  predictions: { names: [], hype: -1, price: -1 },
};

const getImageObj = (name: string, url: string, image: File): ImageI => ({
  name,
  url,
  image,
});

const TEST_IMG0_NAME = "testImg0";
const TEST_IMG0_URL = "testUrl0";
const TEST_IMG0_FILE = new File(["foo"], `${TEST_IMG0_NAME}.txt`);
const TEST_IMG0_ID = "testImg0.txt3";
const TESTOBJ_IMG0 = getImageObj(TEST_IMG0_NAME, TEST_IMG0_URL, TEST_IMG0_FILE);

const TEST_IMG1_NAME = "testImg1";
const TEST_IMG1_URL = "testUrl1";
const TEST_IMG1_FILE = new File(["foo"], `${TEST_IMG1_NAME}.txt`);
const TEST_IMG1_ID = "testImg1.txt3";
const TESTOBJ_IMG1 = getImageObj(TEST_IMG1_NAME, TEST_IMG1_URL, TEST_IMG1_FILE);

const TEST_IMG2_NAME = "testImg2";
const TEST_IMG2_URL = "testUrl2";
const TEST_IMG2_FILE = new File(["foo"], `${TEST_IMG2_NAME}.txt`);
const TEST_IMG2_ID = "testImg2.txt3";
const TESTOBJ_IMG2 = getImageObj(TEST_IMG2_NAME, TEST_IMG2_URL, TEST_IMG2_FILE);

describe("formReducer", () => {
  let initialState: FormStateI;

  const payload = {
    newName: "newCollectionName",
    description: "newDescription",
    newImagesStatic: [TESTOBJ_IMG2.image],
    modifyImgObjStatic: {
      newImageName: "newImageName",
      imageId: TEST_IMG1_ID,
    },
    price: "1",
    symbol: "APES",
    deleteId: TEST_IMG1_ID,
  };

  beforeEach(() => {
    initialState = {
      twitterHandle: "",
      redditHandle: "",
      collectionName: "",
      description: "",
      symbol: "",
      static: {
        numberOfImages: 2,
        images: {
          [TEST_IMG0_ID]: TESTOBJ_IMG0,
          [TEST_IMG1_ID]: TESTOBJ_IMG1,
        },
      },
      generative: {
        totalTierRarity: 0,
        quantity: "1",
        tiers: [],
        numberOfTiers: 0,
        layers: [],
        numberOfLayers: 0,
      },
      marketplace: { wanted: false, royalty: "" },
      predictions: { names: [], hype: -1, price: -1 },
      mintingPrice: "0",
    };
  });

  test("Collection Name is changed", () => {
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.collectionName = payload.newName ?? "";
    expect(
      formReducer(initialState, { type: FormActions.CHANGE_NAME, payload })
    ).toMatchObject(expected);
  });

  test("Description is changed", () => {
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.description = payload.description ?? "";
    expect(
      formReducer(initialState, {
        type: FormActions.CHANGE_DESCRIPTION,
        payload,
      })
    ).toMatchObject(expected);
  });

  test("Symbol is changed", () => {
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.symbol = payload.symbol ?? "";
    expect(
      formReducer(initialState, { type: FormActions.CHANGE_SYMBOL, payload })
    ).toMatchObject(expected);
  });

  test("New images are added", () => {
    if (payload.newImagesStatic && payload.newImagesStatic[0]) {
      const expected: FormStateI = JSON.parse(JSON.stringify(initialState));
      expected.static.numberOfImages = 3;
      if (!global.URL.createObjectURL) {
        global.URL.createObjectURL = () => TESTOBJ_IMG2.url;
      }
      if (!global.URL.revokeObjectURL) {
        global.URL.revokeObjectURL = jest.fn();
      }
      expected.static.images[TEST_IMG2_ID] = TESTOBJ_IMG2;
      const result = formReducer(initialState, {
        type: FormActions.ADD_IMAGES_STATIC,
        payload,
      });
      expect(result).toMatchObject(expected);
    }
  });

  test("Name of TESTOBJ_IMG1 is changed", () => {
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.static.images[TEST_IMG0_ID] = TESTOBJ_IMG0;
    expected.static.images[TEST_IMG1_ID] = getImageObj(
      "newImageName",
      TEST_IMG1_URL,
      TEST_IMG1_FILE
    );
    const result = formReducer(initialState, {
      type: FormActions.CHANGE_IMAGE_NAME,
      payload,
    });
    expect(result).toMatchObject(expected);
  });

  test("TESTOBJ_IMG1 is deleted", () => {
    const expected = JSON.parse(JSON.stringify(initialState));
    delete expected.static.images[TEST_IMG1_ID];
    expected.static.numberOfImages = 1;
    expect(
      formReducer(initialState, {
        type: FormActions.DELETE_IMAGE_STATIC,
        payload,
      })
    ).toMatchObject(expected);
  });

  test("Minting price is changed", () => {
    const expected = JSON.parse(JSON.stringify(initialState));
    expected.mintingPrice = payload.price;
    expect(
      formReducer(initialState, { type: FormActions.CHANGE_PRICE, payload })
    ).toMatchObject(expected);
  });

  test("initialState is returned", () => {
    expect(
      formReducer(initialState, { type: FormActions.RESET_STATE, payload })
    ).toMatchObject(EMPTY_STATE);
  });

  test("default case", () => {
    try {
      formReducer(initialState, {
        type: "" as unknown as FormActions,
        payload,
      });
      fail("Error should have been thrown on invalid action");
    } catch (ignored) {
      expect(true);
    }
  });
});
