interface TagProps {
  color: string;
  label: string;
}

export function Tag({ color, label }: TagProps) {
  return (
    <li
      className={`font-inter text-xxs text-black leading-spacing-16 rounded-[0.4rem] h-spacing-16 px-spacing-4 list-none`}
      style={{ backgroundColor: color }}
    >
      {label}
    </li>
  );
}
