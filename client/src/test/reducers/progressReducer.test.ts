import { ProgressActions } from "actions/progressActions";
import progressReducer from "reducers/progressReducer";

describe("progressReducer", () => {
  let initialState = {
    inProgress: false,
    progressAmount: 0,
  };

  beforeEach(() => {
    initialState = {
      inProgress: false,
      progressAmount: 0,
    };
  });

  test("Start progress", () => {
    const expected = { ...initialState, inProgress: true };
    expect(
      progressReducer(initialState, {
        type: ProgressActions.START_PROGRESS,
        payload: {},
      })
    ).toMatchObject(expected);
  });

  test("Advance progress with advanceProgressBy", () => {
    const expected = { ...initialState, inProgress: true, progressAmount: 50 };
    expect(
      progressReducer(
        { ...initialState, inProgress: true },
        {
          type: ProgressActions.ADVANCE_PROGRESS_BY,
          payload: { advanceProgressBy: 50 },
        }
      )
    ).toMatchObject(expected);
  });

  test("Advance progress no advanceProgressBy", () => {
    const expected = { ...initialState, inProgress: true, progressAmount: 99 };
    expect(
      progressReducer(
        { ...initialState, inProgress: true },
        {
          type: ProgressActions.ADVANCE_PROGRESS_BY,
          payload: {},
        }
      )
    ).toMatchObject(expected);
  });

  test("Finish progress", () => {
    const expected = { ...initialState, progressAmount: 100 };
    expect(
      progressReducer(initialState, {
        type: ProgressActions.FINISH_PROGRESS,
        payload: {},
      })
    ).toMatchObject(expected);
  });

  test("Stop progress", () => {
    const expected = { ...initialState };
    expect(
      progressReducer(initialState, {
        type: ProgressActions.STOP_PROGRESS,
        payload: {},
      })
    ).toMatchObject(expected);
  });
});
