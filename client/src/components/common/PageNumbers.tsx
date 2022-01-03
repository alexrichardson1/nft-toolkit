import { Box, Pagination } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface PropsT {
  page: number;
  setPage: Dispatch<SetStateAction<number>>;
  arrayLength: number;
}

const MAX_PER_PAGE = 24;

export const getItemsPerPage = <T extends unknown>(
  page: number,
  array: T[]
): T[] => array.slice((page - 1) * MAX_PER_PAGE, page * MAX_PER_PAGE);

export const PageNumbers = ({
  page,
  setPage,
  arrayLength,
}: PropsT): JSX.Element => {
  return (
    <Box gap={2} display="flex" flexWrap="wrap" justifyContent="center">
      <Pagination
        count={Math.ceil(arrayLength / MAX_PER_PAGE)}
        size="large"
        page={page}
        onChange={(_e, page) => {
          setPage(page);
        }}
      />
    </Box>
  );
};
