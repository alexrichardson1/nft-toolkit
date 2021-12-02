const MAX_RARITY = 100;
const TWO = 2;

interface PropsT {
  totalRarity: number;
}

const RarityProgressBar = (props: PropsT): JSX.Element => {
  return (
    <>
      <div>
        <p style={{ textAlign: "right" }}>
          {" "}
          You have {MAX_RARITY - props.totalRarity} rarity left to assign
        </p>
        <div
          style={{
            width: `${window.innerWidth / TWO}`,
            height: 20,
            outline: "solid",
          }}>
          <div
            style={{
              width: `${Math.min(props.totalRarity, MAX_RARITY)}%`,
              height: 20,
              backgroundColor:
                props.totalRarity <= MAX_RARITY ? "#00bcd4" : "#B33F40",
              textAlign: "center",
            }}>
            {props.totalRarity <= MAX_RARITY
              ? ""
              : "You have a total rarity over 100"}
          </div>
        </div>
      </div>
    </>
  );
};

export default RarityProgressBar;
