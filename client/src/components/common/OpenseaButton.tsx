import { Button } from "@mui/material";
import OpenseaBlackLogo from "images/opensea-black.svg";
import OpenseaColorLogo from "images/opensea-colour.svg";
import { useEffect, useState } from "react";
import { getExternalMarket } from "utils/mintingPageUtils";
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
      const url = await getExternalMarket(chainId, address);
      setExternalMarket(url);
    };
    if (!marketURL) {
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
