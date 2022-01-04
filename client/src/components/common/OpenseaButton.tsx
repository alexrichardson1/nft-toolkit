import { Button } from "@mui/material";
import OpenseaBlackLogo from "images/opensea-black.svg";
import OpenseaColorLogo from "images/opensea-colour.svg";
import SvgLogo from "./SvgLogo";

interface PropsT {
  externalMarket: string;
  isOutlined?: boolean;
}

const OpenseaButton = ({ externalMarket, isOutlined }: PropsT): JSX.Element => {
  return (
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
