import InfoIcon from "@mui/icons-material/Info";
import Tooltip from "@mui/material/Tooltip";

const InfoTooltip = ({ text }: { text: string }) => (
  <Tooltip title={text}>
    <InfoIcon color="primary" />
  </Tooltip>
);

export default InfoTooltip;
