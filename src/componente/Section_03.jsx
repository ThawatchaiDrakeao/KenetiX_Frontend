const steps = [
  {
    number: "01",
    title: "เลือกรองเท้า",
    description:
      "เลือกรุ่น แบรนด์ และไซส์ที่ต้องการจาก catalog ออนไลน์",
  },
  {
    number: "02",
    title: "จองวันที่",
    description:
      "เลือกรับ-คืน ชำระเงินออนไลน์ปลอดภัย รับ confirmation ทันที",
  },
  {
    number: "03",
    title: "รับรองเท้า",
    description:
      "รับหน้าร้าน หรือเลือกจัดส่งถึงที่อยู่ภายใน 24 ชั่วโมง",
  },
  {
    number: "04",
    title: "คืนรองเท้า",
    description:
      "คืนเมื่อหมดสัญญา ไม่ต้องทำความสะอาด เราดูแลให้ทั้งหมด",
  },
];

export default function Section_03() {
  return (
    <section
      aria-labelledby="section-03-heading"
      className="bg-kinetix-black px-6 py-16 text-kinetix-white sm:px-8 lg:px-12 lg:py-24 xl:px-14 xl:py-28"
    >
      <div className="mx-auto max-w-[1520px]">
        <header className="max-w-5xl">
          <p className="font-display text-[11px] font-semibold tracking-[0.38em] text-kinetix-lime sm:text-xs">
            -------- ขั้นตอนง่ายๆ
          </p>
          <h2
            id="section-03-heading"
            className="mt-7 font-display text-[3.25rem] font-semibold leading-[0.92] tracking-[-0.075em] text-kinetix-white sm:text-[4.5rem] lg:text-[5.5rem]"
          >
            เช่า ใน 4 ขั้นตอน
          </h2>
        </header>

        <div className="mt-24 grid grid-cols-1 gap-y-14 md:mt-28 md:grid-cols-2 md:gap-x-14 lg:gap-x-16 xl:mt-32 xl:grid-cols-4 xl:gap-x-16">
          {steps.map((step) => (
            <article
              key={step.number}
              className="group relative flex min-h-[320px] flex-col items-start justify-start rounded-[28px] border border-transparent px-4 py-4 transition-all duration-300 ease-out hover:-translate-y-1 hover:border-kinetix-border/80"
            >
              <div
                aria-hidden="true"
                className="absolute left-4 top-0 h-px w-16 bg-transparent transition-all duration-300 group-hover:w-24 group-hover:bg-kinetix-lime/70"
              />

              <span className="font-display text-[4.6rem] font-bold leading-[0.86] tracking-[-0.1em] text-kinetix-lime underline decoration-kinetix-lime decoration-[3px] underline-offset-[10px] sm:text-[5rem] lg:text-[5.2rem]">
                {step.number}
              </span>

              <div
                aria-hidden="true"
                className="mt-6 flex h-16 w-16 items-center justify-center rounded-[20px] border border-kinetix-border bg-white/2 transition-all duration-300 group-hover:border-kinetix-aqua/50 group-hover:bg-kinetix-aqua/8"
              >
                <div className="relative h-7 w-7">
                  <div className="absolute inset-x-1 top-1 h-[2px] rounded-full bg-kinetix-aqua/70" />
                  <div className="absolute inset-x-0 top-3 h-[2px] rounded-full bg-kinetix-lime/75" />
                  <div className="absolute bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border border-kinetix-white/80" />
                </div>
              </div>

              <div className="mt-8 max-w-[320px]">
                <h3 className="font-display text-[2.4rem] font-semibold leading-[0.98] tracking-[-0.07em] text-kinetix-white sm:text-[2.8rem]">
                  {step.title}
                </h3>
                <p className="mt-5 max-w-[350px] text-[1rem] leading-[1.65] text-kinetix-gray sm:text-[1.05rem]">
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
