interface PropsT {
  icon: string;
  width: string | number;
  height: string | number;
  margins?: boolean;
}

const SvgLogo = (props: PropsT): JSX.Element => (
  <img
    style={{ margin: props.margins ? "0 5px" : "0" }}
    width={props.width}
    height={props.height}
    src={props.icon}
    alt="logo"
  />
);

export default SvgLogo;
