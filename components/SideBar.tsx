export default function SideBar() {
  const data = [
    {
      title: "Selected Exhibitions",
      items: [
        { year: 2023, label: "일상의실천 단독전시 <운동의방식>, 탈영역우정국" },
        {
          year: 2017,
          label:
            "<Everyday Practice Poster Show 2013 - 2018>, 복합문화 예술공간 행성동 1층",
        },
      ],
    },
    {
      title: "Awards",
      items: [
        { year: 2023, label: "한국 타이포그라피학회 회원전" },
        {
          year: 2017,
          label: "<리얼-리얼시티(REAL-Real City)>, 아르코미술관 ",
        },
      ],
    },
  ];

  return (
    <aside className="sticky top-0 font-normal !h-full min-w-[40rem] w-[29%] border-l border-px border-gray">
      <header className="flex flex-row px-margin w-full justify-end items-center gap-spacing-10 h-headerH border-b border-px border-gray text-m">
        <button type="button">Contact</button>
        <button type="button">CV</button>
        <button type="button">Client</button>
      </header>
      <section className="flex flex-col gap-12 p-margin">
        {data.map((section) => (
          <table
            key={section.title}
            className="flex flex-col gap-spacing-10 w-full border-collapse"
          >
            <thead>
              <tr>
                <th colSpan={2}>
                  <h2 className="uppercase">{section.title}</h2>
                </th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item, index) => (
                <tr key={index} className="text-start align-top">
                  <td className="pr-spacing-20">{item.year}</td>
                  <td>{item.label}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ))}
      </section>
    </aside>
  );
}
