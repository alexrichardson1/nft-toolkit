import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import DisplayCard from "./DisplayCard";
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import ListItemText from "@mui/material/ListItemText";
import { SxProps } from "@mui/system/styleFunctionSx";

const dummyData: CollectionI =
    {
        name: "APE 1",
        description:
            "This is a collection where you can do something and get something done but also a collection where you can not do something and get nothing done because if you think about it carefully, you can basically get everything but nothing done at the same time which is a bit annoying.",
        image: "https://pbs.twimg.com/media/FFaFHBNXMAAR41l.jpg",
        attributes: { tier: "Legendary" },
        id: 0,
        price: "69",
    };

const paperStyle: SxProps = {
  bgcolor: 'background.paper',
  boxShadow: 3,
  borderRadius: 2,
  padding: 3,
  margin: 4, 
  width: '55%',
};

const PurchasePage = (): JSX.Element => {

    const { paramChainId } = useParams<ParamsI>();

    return (
        <Box alignItems="center" flexGrow={1} display="flex" gap={10} >
          <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
            <DisplayCard
              chainId={Number(paramChainId)}
              to="/purchase"
              key= {dummyData.id}
              data={dummyData}
            />
          </Box>
          <Box sx={paperStyle}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <ListItem>
                <Box>
                  <Typography textAlign="left" variant="h3" color="secondary" fontWeight="medium">
                    NFT name...
                  </Typography>
                  <Typography textAlign="left" color="primary" fontStyle="oblique">
                    Creator/s...
                  </Typography>
                </Box>
              </ListItem>
              <Divider variant="middle" flexItem={true}/> 
              <ListItem>
                <Button variant="contained" size="medium" border-radius="10px" disabled>
                  Rarity...
                </Button>
              </ListItem>
              <Divider variant="middle" /> 
              <ListItem>
                <Box>
                  <Stack direction="row" spacing={3}>
                    <Button variant="outlined" color="info" border-radius="5px">
                      <ListItem>
                        <ListItemText
                          primary= "Attribute 1"
                          secondary="Attr name 1"
                        />
                      </ListItem>
                    </Button>
                    <Button variant="outlined" color="info" border-radius="5px">
                      <ListItem>
                        <ListItemText
                          primary= "Attribute 2"
                          secondary="Attr name 2"
                        />
                      </ListItem>
                    </Button>
                    <Button variant="outlined" color="info" border-radius="5px">
                      <ListItem>
                        <ListItemText
                          primary= "Attribute 3"
                          secondary="Attr name 3"
                        />
                      </ListItem>
                    </Button>
                  </Stack>
                </Box>
              </ListItem>
              <Divider variant="middle"/> 
              <ListItem>
                <Box>
                  <Typography textAlign="left" color="secondary">
                    Floor Price: xx ETH
                  </Typography>
                </Box>
              </ListItem>
              <Box>
                <Button variant="contained" size="large" border-radius="10px">
                  Purchase
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
    );
  };
  
  export default PurchasePage;
  