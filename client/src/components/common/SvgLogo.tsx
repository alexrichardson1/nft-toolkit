import React from "react";

interface PropsT {
  icon: string;
  width: string | number;
  height: string | number;
  margins?: boolean;
  alt: string;
}

const SvgIcon = ({
  alt,
  icon,
  width,
  height,
  margins,
}: PropsT): JSX.Element => (
  <img
    style={{ margin: margins ? "0 5px" : "0" }}
    width={width}
    height={height}
    src={icon}
    alt={alt}
  />
);

export default React.memo(SvgIcon);
