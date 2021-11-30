import { Skeleton } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "./displaycard.css";

interface PropsT {
  data: CardInfoI;
  loading?: boolean;
}

const DisplayCard = ({ data, loading }: PropsT): JSX.Element => {
  return (
    <Box tabIndex={0} className="marketplace-card">
      <Box
        sx={{ bgcolor: "background.paper" }}
        className="marketplace-card-container">
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
            <img
              src={data.image}
              alt={data.name}
              className="card-img card-front"
            />
            <Box className="card-back">
              <Box className="card-title-container">
                <Typography noWrap variant="h5" color="primary">
                  {data.name}
                </Typography>
                <Typography noWrap variant="h6">
                  {/* eslint-disable-next-line dot-notation */}
                  {data.attributes["tier"]}
                </Typography>
              </Box>
              <Typography className="card-description" variant="body2">
                {data.description}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default DisplayCard;
