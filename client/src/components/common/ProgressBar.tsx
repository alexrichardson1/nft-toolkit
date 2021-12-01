const MAX_RARITY = 100;
const TWO = 2;

interface PropsT {
  totalTierRarity: number;
}

const ProgressBar = (props: PropsT): JSX.Element => {
  return (
    <>
      <div>
        <p style={{ textAlign: "right" }}>
          {" "}
          You have {MAX_RARITY - props.totalTierRarity} rarity left to assign
        </p>
        <div
          style={{
            width: `${window.innerWidth / TWO}`,
            height: 20,
            outline: "solid",
          }}>
          <div
            style={{
              width: `${Math.min(props.totalTierRarity, MAX_RARITY)}%`,
              height: 20,
              backgroundColor:
                props.totalTierRarity <= MAX_RARITY ? "#00bcd4" : "#B33F40",
              textAlign: "center",
            }}>
            {props.totalTierRarity <= MAX_RARITY
              ? ""
              : "You have a total rarity over 100"}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProgressBar;
