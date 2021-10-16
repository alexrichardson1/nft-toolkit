interface PropsT {
  icon: string;
  width: string;
  height: string;
}

const SvgLogo = (props: PropsT): JSX.Element => (
  <img width={props.width} height={props.height} src={props.icon} />
);

export default SvgLogo;
