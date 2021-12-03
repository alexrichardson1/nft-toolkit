import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SvgLogo from "components/common/SvgLogo";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { getLogoByChainId } from "utils/constants";
import "./displaycard.css";

interface PropsT {
  data: TokenI;
  to: string;
  loading?: boolean;
  chainId: number;
}

const priceCard = (logo: string, price?: string) => {
  if (!price) {
    return <p></p>;
  }
  return (
    <>
      <Typography variant="h6" color="primary" className="card-price">
        Price: {price}
      </Typography>
      <SvgLogo icon={logo} width="20px" height="20px" margins />
    </>
  );
};

const DisplayCard = ({ chainId, to, data, loading }: PropsT): JSX.Element => {
  const logo = useMemo(() => getLogoByChainId(chainId), [chainId]);

  return (
    <Box tabIndex={0} component={Link} to={to} className="marketplace-card">
      <Box
        color="text.primary"
        sx={{ bgcolor: "background.paper", boxShadow: 3 }}
        className="card-wrapper">
        {loading ? (
          <>
            <Skeleton
              height="100%"
              variant="rectangular"
              className="card-front"
            />
            <Skeleton
              height="100%"
              variant="rectangular"
              className="card-back"
            />
          </>
        ) : (
          <>
            <Box bgcolor="background.paper" className="card-front">
              <img src={data.image} alt={data.name} className="card-img" />
              <Box className="card-price-container">
                {priceCard(logo, data.price)}
              </Box>
            </Box>
            <Box bgcolor="background.paper" className="card-back">
              <Box className="card-title-container">
                <Typography noWrap variant="h5" color="primary">
                  {data.name}
                </Typography>
                <Typography noWrap variant="h6">
                  {data.attributes["tier"]}
                </Typography>
              </Box>
              <Box className="card-text">
                <Typography className="card-description">
                  {data.description}
                </Typography>
                <Box className="card-price-container">
                  {priceCard(logo, data.price)}
                </Box>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DisplayCard;
