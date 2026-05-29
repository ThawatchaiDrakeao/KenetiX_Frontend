import { useMemo, useState } from "react";
import { useLanguage } from "../context/useLanguage";
import Navbar from "./Navbar";

const productCopy = {
  th: {
    breadcrumb: "หน้าแรก / รองเท้า / Nike Pegasus 41",
    badge: "พร้อมเช่า",
    label: "Single Product",
    brand: "Nike",
    name: "Pegasus 41",
    title: "รองเท้าวิ่งซ้อมประจำวันที่พร้อมให้คุณทดลองก่อนซื้อจริง",
    description:
      "รองเท้าวิ่งสาย daily trainer สำหรับซ้อมระยะสั้นถึงกลาง ให้ฟีลนุ่ม เด้ง และมั่นคง เหมาะกับนักวิ่งที่อยากทดลองรองเท้าพรีเมียมก่อนตัดสินใจซื้อ",
    imageAlt: "Nike Pegasus 41 สำหรับเช่าบน KenetiX",
    rentalFeeLabel: "ค่าเช่า",
    rentalFee: "฿290",
    rentalUnit: "/ วัน",
    depositLabel: "เงินประกัน",
    deposit: "฿2,000",
    selectedSizeLabel: "ไซส์ที่เลือก",
    selectSize: "เลือกไซส์",
    planLabel: "แพ็กเกจเช่า",
    pickupLabel: "วันรับรองเท้า",
    returnLabel: "วันคืนรองเท้า",
    deliveryLabel: "วิธีรับรองเท้า",
    primaryCta: "เริ่มจองรองเท้า",
    secondaryCta: "กลับไปดูวิธีเช่า",
    note:
      "ยอดจริงจะสรุปอีกครั้งก่อนชำระเงิน เมื่อระบบ booking เชื่อมต่อ backend แล้ว",
    plans: [
      { id: "daily", label: "รายวัน", value: "฿290 / วัน" },
      { id: "weekend", label: "สุดสัปดาห์", value: "฿790 / 3 วัน" },
      { id: "weekly", label: "รายสัปดาห์", value: "฿1,690 / 7 วัน" },
    ],
    deliveryOptions: ["รับที่หน้าร้าน", "จัดส่งถึงบ้าน"],
    specsTitle: "ข้อมูลรองเท้า",
    specs: [
      ["ประเภท", "Daily trainer"],
      ["พื้นผิว", "Road running"],
      ["น้ำหนัก", "ประมาณ 270g"],
      ["Drop", "10mm"],
      ["Cushioning", "นุ่มและเด้ง"],
      ["สถานะ", "ผ่านการตรวจสภาพ"],
    ],
    highlightsTitle: "เหมาะกับใคร",
    highlights: [
      "นักวิ่งที่ต้องการลองฟีลก่อนซื้อจริง",
      "ซ้อม tempo, easy run และ long run ระยะกลาง",
      "คนที่อยากเทียบไซส์และฟีลรองเท้ากับรุ่นอื่น",
    ],
    assuranceTitle: "KenetiX rental assurance",
    assurance: [
      "รองเท้าทุกคู่ถูกตรวจสภาพก่อนปล่อยเช่า",
      "เห็นค่าเช่าและเงินประกันก่อนยืนยันรายการ",
      "ติดตามสถานะ booking, pickup และ return ได้ใน flow เดียว",
    ],
    processTitle: "Rental flow",
    process: [
      ["01", "เลือกไซส์", "เลือกไซส์และแพ็กเกจที่เหมาะกับแผนซ้อม"],
      ["02", "จองวัน", "ระบุวันรับและวันคืนเพื่อเช็ก slot"],
      ["03", "ชำระเงิน", "ยืนยันค่าเช่าและเงินประกันก่อนจ่าย"],
      ["04", "รับและคืน", "รับรองเท้าไปทดลอง แล้วคืนตามกำหนด"],
    ],
  },
  en: {
    breadcrumb: "Home / Shoes / Nike Pegasus 41",
    badge: "Available",
    label: "Single Product",
    brand: "Nike",
    name: "Pegasus 41",
    title: "A daily running shoe you can test before you buy",
    description:
      "A premium daily trainer for short to medium training sessions. It feels soft, responsive, and stable for runners who want real miles before making a purchase decision.",
    imageAlt: "Nike Pegasus 41 available for rent on KenetiX",
    rentalFeeLabel: "Rental fee",
    rentalFee: "฿290",
    rentalUnit: "/ day",
    depositLabel: "Deposit",
    deposit: "฿2,000",
    selectedSizeLabel: "Selected size",
    selectSize: "Select size",
    planLabel: "Rental plan",
    pickupLabel: "Pickup date",
    returnLabel: "Return date",
    deliveryLabel: "Pickup method",
    primaryCta: "Start booking",
    secondaryCta: "View rental flow",
    note:
      "The final total will be reviewed before payment once booking is connected to the backend.",
    plans: [
      { id: "daily", label: "Daily", value: "฿290 / day" },
      { id: "weekend", label: "Weekend", value: "฿790 / 3 days" },
      { id: "weekly", label: "Weekly", value: "฿1,690 / 7 days" },
    ],
    deliveryOptions: ["Store pickup", "Home delivery"],
    specsTitle: "Shoe details",
    specs: [
      ["Type", "Daily trainer"],
      ["Surface", "Road running"],
      ["Weight", "Around 270g"],
      ["Drop", "10mm"],
      ["Cushioning", "Soft and responsive"],
      ["Status", "Inspection passed"],
    ],
    highlightsTitle: "Best for",
    highlights: [
      "Runners who want to test the feel before buying",
      "Tempo, easy, and medium long-run sessions",
      "Comparing fit and ride against other models",
    ],
    assuranceTitle: "KenetiX rental assurance",
    assurance: [
      "Every pair is inspected before each rental",
      "Rental fee and deposit are visible before confirmation",
      "Booking, pickup, and return status stay in one flow",
    ],
    processTitle: "Rental flow",
    process: [
      ["01", "Choose size", "Pick the size and rental plan for your training block"],
      ["02", "Book dates", "Set pickup and return dates to check the slot"],
      ["03", "Pay securely", "Confirm rental fee and deposit before payment"],
      ["04", "Run and return", "Test the shoes, then return them on schedule"],
    ],
  },
};

const sizes = ["US 7", "US 8", "US 9", "US 10", "US 11", "US 12"];

export default function SingleProductPage() {
  const { language } = useLanguage();
  const copy = productCopy[language];
  const [selectedSize, setSelectedSize] = useState("US 9");
  const [selectedPlan, setSelectedPlan] = useState(copy.plans[0].id);
  const [deliveryMethod, setDeliveryMethod] = useState(copy.deliveryOptions[0]);

  const selectedPlanCopy = useMemo(
    () => copy.plans.find((plan) => plan.id === selectedPlan) ?? copy.plans[0],
    [copy.plans, selectedPlan],
  );

  return (
    <main className="min-h-screen bg-kinetix-black text-kinetix-white">
      <Navbar active="rental" />

      <section className="border-b border-white/10">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-12 lg:py-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
              {copy.breadcrumb}
            </p>

            <div className="mt-6 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
              <div className="relative h-[420px] sm:h-[560px] lg:h-[650px]">
                <img
                  src="/how-it-works-shoe.png"
                  alt={copy.imageAlt}
                  className="h-full w-full object-cover"
                />
                <div className="absolute left-5 top-5 rounded-full border border-kinetix-lime/60 bg-black/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-kinetix-lime backdrop-blur-md">
                  {copy.badge}
                </div>
              </div>
              <div className="grid grid-cols-3 border-t border-zinc-800">
                {[copy.brand, copy.name, selectedPlanCopy.label].map((item) => (
                  <div key={item} className="border-r border-zinc-800 px-4 py-4 last:border-r-0">
                    <p className="text-sm font-semibold text-white">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-kinetix-aqua">
              {copy.label}
            </p>
            <h1 className="mt-5 max-w-3xl font-display text-5xl font-bold leading-[1.02] text-white sm:text-6xl">
              {copy.brand} <span className="text-kinetix-lime">{copy.name}</span>
            </h1>
            <p className="mt-5 text-2xl font-semibold leading-tight text-white sm:text-3xl">
              {copy.title}
            </p>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-400">
              {copy.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-zinc-800 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {copy.rentalFeeLabel}
                </p>
                <p className="mt-3 text-4xl font-black text-kinetix-lime">
                  {copy.rentalFee}
                  <span className="text-sm font-semibold text-zinc-400">
                    {copy.rentalUnit}
                  </span>
                </p>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-white/[0.03] p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
                  {copy.depositLabel}
                </p>
                <p className="mt-3 text-4xl font-black text-white">
                  {copy.deposit}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <div>
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                    {copy.selectSize}
                  </h2>
                  <p className="text-sm text-zinc-500">
                    {copy.selectedSizeLabel}:{" "}
                    <span className="font-bold text-kinetix-lime">{selectedSize}</span>
                  </p>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 rounded-lg border text-sm font-bold transition-colors ${
                        selectedSize === size
                          ? "border-kinetix-lime bg-kinetix-lime text-black"
                          : "border-zinc-800 bg-white/[0.03] text-white hover:border-kinetix-aqua"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                  {copy.planLabel}
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {copy.plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`min-h-[86px] rounded-lg border p-4 text-left transition-colors ${
                        selectedPlan === plan.id
                          ? "border-kinetix-lime bg-kinetix-lime text-black"
                          : "border-zinc-800 bg-white/[0.03] text-white hover:border-kinetix-aqua"
                      }`}
                    >
                      <span className="block text-sm font-bold">{plan.label}</span>
                      <span className="mt-2 block text-xs font-semibold opacity-70">
                        {plan.value}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                    {copy.pickupLabel}
                  </span>
                  <input
                    type="date"
                    className="mt-3 h-12 w-full rounded-lg border border-zinc-800 bg-black px-4 text-sm text-white outline-none transition-colors focus:border-kinetix-lime"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                    {copy.returnLabel}
                  </span>
                  <input
                    type="date"
                    className="mt-3 h-12 w-full rounded-lg border border-zinc-800 bg-black px-4 text-sm text-white outline-none transition-colors focus:border-kinetix-lime"
                  />
                </label>
              </div>

              <div>
                <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-zinc-300">
                  {copy.deliveryLabel}
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {copy.deliveryOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setDeliveryMethod(option)}
                      className={`h-12 rounded-lg border text-sm font-bold transition-colors ${
                        deliveryMethod === option
                          ? "border-kinetix-lime bg-kinetix-lime text-black"
                          : "border-zinc-800 bg-white/[0.03] text-white hover:border-kinetix-aqua"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/#signup"
                className="inline-flex h-12 items-center justify-center rounded-lg bg-kinetix-lime px-6 text-sm font-black text-black transition-transform hover:scale-[1.02]"
              >
                {copy.primaryCta}
              </a>
              <a
                href="/how-it-works"
                className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-700 px-6 text-sm font-bold text-white transition-colors hover:border-kinetix-aqua hover:text-kinetix-aqua"
              >
                {copy.secondaryCta}
              </a>
            </div>
            <p className="mt-4 text-xs leading-6 text-zinc-500">{copy.note}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1440px] gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12 lg:py-20">
        <div>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {copy.specsTitle}
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {copy.specs.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-zinc-500">
                  {label}
                </p>
                <p className="mt-2 text-base font-bold text-white">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-2xl font-bold text-white">{copy.highlightsTitle}</h2>
            <ul className="mt-5 space-y-4">
              {copy.highlights.map((item) => (
                <li key={item} className="border-l border-kinetix-lime/70 pl-4 text-sm leading-7 text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-zinc-800 bg-zinc-950 p-5">
            <h2 className="text-2xl font-bold text-white">{copy.assuranceTitle}</h2>
            <ul className="mt-5 space-y-4">
              {copy.assurance.map((item) => (
                <li key={item} className="border-l border-kinetix-aqua/70 pl-4 text-sm leading-7 text-zinc-400">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-950/70">
        <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">
              {copy.processTitle}
            </h2>
            <a
              href="/how-it-works"
              className="text-sm font-bold text-kinetix-lime transition-colors hover:text-kinetix-aqua"
            >
              {copy.secondaryCta} -&gt;
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {copy.process.map(([number, title, description]) => (
              <article key={number} className="min-h-[220px] rounded-lg border border-zinc-800 bg-black p-5">
                <span className="text-4xl font-black text-kinetix-lime">{number}</span>
                <h3 className="mt-8 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
