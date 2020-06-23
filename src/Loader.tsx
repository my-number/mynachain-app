import React, { useState, useEffect, CSSProperties } from "react";

import { CircularProgress, Link } from "@material-ui/core";
import { useHistory } from "react-router-dom";
const LoaderStyle = {
  textAlign: "center"
} as CSSProperties;
export default function Loader() {
  const history = useHistory();
  return (
    <div style={LoaderStyle}>
      <CircularProgress />
      <h1>ノードに接続中</h1>
      <Link onClick={() => history.push("/settings")}>接続できませんか？</Link>
    </div>
  );
}
