import React, { FunctionComponent } from "react";
import { AppNavigation } from "@app/components/AppNavigation";
import "./style.scss";

const Topics: FunctionComponent = () => {
  return <AppNavigation eventKey={1} />;
};

export { Topics };

export default Topics;
