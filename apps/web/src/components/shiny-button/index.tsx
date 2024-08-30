import React from "react";

import styles from "@/components/shiny-button/shiny.module.css";
import cn from "classnames";

export const ShinyButton = (props: React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>) => {
  return <button {...props} className={cn(styles.shiny, props.className)} />;
};
