interface PropsT {
  icon: string;
  width: string | number;
  height: string | number;
}

const SvgLogo = (props: PropsT): JSX.Element => (
  <img width={props.width} height={props.height} src={props.icon} />
);

export default SvgLogo;
