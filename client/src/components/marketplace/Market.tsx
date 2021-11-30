import DisplayCard from "./DisplayCard";

const dummy: CardInfoI = {
  name: "APE 0",
  description:
    "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
  image:
    "https://media4.giphy.com/media/30NdmWTV6ORPuwUNUu/giphy.gif?cid=ecf05e47auja74quh6utc1i80lc2j3zfqbr15vnql5o5tg3r&rid=giphy.gif&ct=g",
  attributes: { tier: "Legendary" },
};

const Market = (): JSX.Element => {
  return <DisplayCard data={dummy} />;
};

export default Market;
