import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col gap-spacing-10 items-center justify-center h-full w-full text-center">
      <h1 className="text-[10rem] text-white font-extrabold leading-40!">
        404
      </h1>
      <p className="text-s text-gray">페이지를 찾을 수 없습니다</p>
      <Link
        href="/"
        aria-label="홈페이지로 이동"
        className="text-white! hover:text-gray!"
      >
        홈으로
      </Link>
    </div>
  );
}
