import classes from "./LoadingSpinner.module.css";
import * as React from "react";
import Skeleton from "@mui/material/Skeleton";
import { Box } from "@mui/material";
import Typography, { TypographyProps } from "@mui/material/Typography";

const variants = [
  "h1",
  "h3",
  "body1",
  "caption",
] as readonly TypographyProps["variant"][];

const LoadingSpinner = () => {
  //* spinner convencional
  //return <div className={`${classes.spinner} center`}></div>;

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          width: "84%",
          alignContent: "center",
          justifyContent: "center",
          marginLeft: "8%",
          marginRight: "8%",
          marginTop: "3%",
        }}
      >
        <Typography component="div" variant={"h1"}>
          <Skeleton />
        </Typography>
        <Typography component="div" variant={"h3"}>
          <Skeleton />
        </Typography>{" "}
        <Typography component="div" variant={"body1"}>
          <Skeleton />
        </Typography>
        <Skeleton />
        <Skeleton animation="wave" />
        <Skeleton animation={false} />
      </Box>
    </Box>
  );
};

export default LoadingSpinner;
