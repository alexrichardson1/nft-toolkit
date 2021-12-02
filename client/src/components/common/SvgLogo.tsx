interface PropsT {
  icon: string;
  width: string | number;
  height: string | number;
  margins?: boolean;
}

const SvgLogo = ({ icon, width, height, margins }: PropsT): JSX.Element => (
  <img
    style={{ margin: margins ? "0 5px" : "0" }}
    width={width}
    height={height}
    src={icon}
    alt="logo"
  />
);

export default SvgLogo;
