type Classname = string | boolean | null | undefined;

export default function cx(...classnames: Classname[]): string {
  return classnames.filter(x => x).join(" ");
}