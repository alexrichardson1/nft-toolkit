import { Button } from "@mui/material";
import OpenseaBlackLogo from "images/opensea-black.svg";
import OpenseaColorLogo from "images/opensea-colour.svg";
import { useEffect, useState } from "react";
import { getExternalMarket } from "utils/mintingPageUtils";
import SvgLogo from "./SvgLogo";

interface PropsT {
  chainId: number;
  address: string;
  isOutlined?: boolean;
}

const OpenseaButton = ({
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
    getMarketURL();
  }, [address, chainId]);

  return externalMarket === "" ? (
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
      href={externalMarket}>
      OpenSea
    </Button>
  );
};

export default OpenseaButton;
