import Link from "next/link";

type Props = {
  href: string;
  label?: string;
};

export function HelpTooltip({ href, label = "Learn more" }: Props) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center w-5 h-5 bg-gray-700 hover:bg-gray-600 rounded-full text-xs text-gray-300 hover:text-white transition ml-1"
      title={label}
    >
      ?
    </Link>
  );
}
