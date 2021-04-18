/* eslint-disable react/jsx-filename-extension */
import React from "react";
import { CssBaseline } from "@material-ui/core";

export const wrapRootElement = ({ element }) => {
  return (
    <>
      <CssBaseline />
      {element}
    </>
  );
};
