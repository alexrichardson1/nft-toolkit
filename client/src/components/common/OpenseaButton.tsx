import { Button } from "@mui/material";
import OpenseaBlackLogo from "images/opensea-black.svg";
import OpenseaColorLogo from "images/opensea-colour.svg";
import { useEffect, useState } from "react";
import { NFT__factory as NFTFactory } from "typechain";
import { DEFAULT_NET } from "utils/constants";
import { getExternalMarket, getRPCProvider } from "utils/mintingPageUtils";
import SvgLogo from "./SvgLogo";

interface PropsT {
  marketURL?: string;
  chainId: number;
  address: string;
  isOutlined?: boolean;
}

const OpenseaButton = ({
  marketURL,
  chainId,
  address,
  isOutlined,
}: PropsT): JSX.Element => {
  const [externalMarket, setExternalMarket] = useState("");

  useEffect(() => {
    const getMarketURL = async () => {
      const nftContract = NFTFactory.connect(address, getRPCProvider(chainId));
      const curToken = await nftContract.tokenIdTracker();
      if (curToken.eq(0)) {
        return;
      }
      const url = await getExternalMarket(chainId, address);
      setExternalMarket(url);
    };
    if (!marketURL && chainId === DEFAULT_NET.chainId) {
      getMarketURL();
    }
  }, [address, chainId]);

  return externalMarket === "" && !marketURL ? (
    <></>
  ) : (
    <Button
      variant={isOutlined ? "outlined" : "contained"}
      startIcon={
        <SvgLogo
          alt="opensea-logo"
          icon={isOutlined ? OpenseaColorLogo : OpenseaBlackLogo}
          height={28}
          width={28}
        />
      }
      target="_blank"
      href={marketURL ? marketURL : externalMarket}>
      OpenSea
    </Button>
  );
};

export default OpenseaButton;
