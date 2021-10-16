interface PropsT {
  logo: string;
  width: string;
  height: string;
}

const SvgLogo = (props: PropsT): JSX.Element => (
  <img width={props.width} height={props.height} src={props.logo} />
);

export default SvgLogo;
