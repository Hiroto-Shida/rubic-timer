import { ComponentProps } from "react";
import { Box } from "@mui/material";
import { BorderBox } from "./container";

type Props = ComponentProps<typeof BorderBox>;

export const BorderBoxPresenter = ({ children }: Props) => {
  return (
    <Box
      component="div"
      sx={(theme) => ({
        border: "solid 2px #333333",
        padding: theme.spacing(2),
        m: `${theme.spacing(1)} 0`,
      })}
    >
      {children}
    </Box>
  );
};
