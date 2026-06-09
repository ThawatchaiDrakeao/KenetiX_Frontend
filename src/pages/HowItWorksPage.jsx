import { useLanguage } from "../context/useLanguage";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ScrollArrow from "../components/ScrollArrow";

const fadeUp  = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } } };
const fadeRight = { hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const pageCopy = {
  th: {
    eyebrow: "How KenetiX Works",
    title: "เช่ารองเท้าวิ่งให้พร้อมซ้อม ในไม่กี่ขั้นตอน",
    intro:
      "KenetiX ช่วยให้คุณทดลองรองเท้าวิ่งระดับพรีเมียมก่อนตัดสินใจซื้อจริง เลือกรุ่น จองวัน ชำระเงิน รับรองเท้า และคืนผ่านระบบเดียวที่ติดตามสถานะได้ตั้งแต่ต้นจนจบ",
    primaryCta: "เริ่มเช่าเลย",
    imageAlt: "รองเท้าวิ่งสำหรับระบบเช่า KenetiX",
    stats: [
      ["5", "ขั้นตอน"],
      ["24h", "รับรองเท้า"],
      ["100%", "ติดตามได้"],
    ],
    checkpoints: [
      "เลือกไซส์และรุ่นจากข้อมูลจริง",
      "เห็นยอดค่าเช่าและเงินประกันก่อนจ่าย",
      "ติดตามสถานะคำสั่งเช่าได้",
      "มีขั้นตอนคืนและ refund ชัดเจน",
    ],
    flowEyebrow: "เส้นทางการเช่า",
    flowTitle: "ทุกขั้นตอนของการเช่า เชื่อมต่อเป็นประสบการณ์เดียว",
    flowDescription:
      "KenetiX ถูกออกแบบให้เป็นมากกว่าการเช่ารองเท้า แต่คือพื้นที่สำหรับทุกคนที่ใส่ใจสุขภาพและรักการเคลื่อนไหว ทุกขั้นตอนตั้งแต่การเลือกไอเท็ม จอง ชำระเงิน ติดตามสถานะ ไปจนถึงคืนสินค้า ถูกขับเคลื่อนด้วยเทคโนโลยีเพื่อมอบประสบการณ์ที่ลื่นไหล ทันสมัย และเชื่อมต่อผู้คนที่มี passion เดียวกันไว้ในคอมมูนิตี้แห่งอนาคต",
    simpleEyebrow: "Why it feels simple",
    simpleTitle: "ทุกสถานะถูกออกแบบให้ตรวจสอบได้",
    finalEyebrow: "Ready to run",
    finalTitle:
      "เลือกรองเท้าคู่ต่อไป แล้วเริ่มทดสอบฟีลจริงบนเส้นทางของคุณ",
    finalCta: "สมัครและเริ่มเช่า",
    steps: [
      {
        number: "01",
        title: "สมัครและยืนยันตัวตน",
        description:
          "สร้างบัญชี KenetiX พร้อมข้อมูลติดต่อ ไซส์รองเท้า และข้อมูลสำหรับเงินประกัน เพื่อให้ระบบเตรียมการเช่าได้ถูกต้อง",
        meta: "Profile setup",
      },
      {
        number: "02",
        title: "เลือกรองเท้าที่เหมาะกับคุณ",
        description:
          "เลือกแบรนด์ รุ่น ไซส์ และประเภทการวิ่งจาก catalog ก่อนตรวจสอบสถานะรองเท้าว่าพร้อมให้เช่าในช่วงวันที่ต้องการ",
        meta: "Shoe catalog",
      },
      {
        number: "03",
        title: "จองวันและชำระเงิน",
        description:
          "กำหนดวันรับ-คืน ตรวจสอบค่าเช่า เงินประกัน และรายละเอียดคำสั่งเช่า จากนั้นชำระเงินเพื่อยืนยัน booking",
        meta: "Booking payment",
      },
      {
        number: "04",
        title: "รับรองเท้าไปใช้งาน",
        description:
          "รับรองเท้าที่หน้าร้านหรือเลือกจัดส่งตามที่อยู่ ระบบจะอัปเดตสถานะการเช่าให้ติดตามได้ตลอดช่วงใช้งาน",
        meta: "Pickup delivery",
      },
      {
        number: "05",
        title: "คืนรองเท้าและรับเงินประกัน",
        description:
          "คืนรองเท้าตามกำหนด ทีมงานตรวจสภาพ แล้วระบบสรุปยอดคืนเงินประกันหรือค่าเสียหายอย่างโปร่งใส",
        meta: "Return refund",
      },
    ],
    systemCards: [
      ["Booking", "ระบบบันทึกวันรับ-คืน ยอดชำระ และสถานะคำสั่งเช่า"],
      [
        "Inventory",
        "รองเท้าแต่ละคู่มีสถานะพร้อมเช่า กำลังเช่า หรือรอตรวจสภาพ",
      ],
      [
        "Payment",
        "แยกค่าเช่า เงินประกัน และข้อมูล refund หลังคืนรองเท้า",
      ],
      [
        "Customer",
        "ข้อมูลผู้ใช้ช่วยให้แนะนำไซส์และติดต่อระหว่างการเช่าได้ง่าย",
      ],
    ],
  },
  en: {
    eyebrow: "How KenetiX Works",
    title: "Rent running shoes for your next training block in a few steps",
    intro:
      "KenetiX lets you test premium running shoes before buying. Choose a model, book dates, pay securely, pick up the shoes, and return them through one trackable rental flow.",
    primaryCta: "Start Rental",
    imageAlt: "Running shoes for the KenetiX rental system",
    stats: [
      ["5", "Steps"],
      ["24h", "Pickup"],
      ["100%", "Trackable"],
    ],
    checkpoints: [
      "Choose size and model from real inventory",
      "See rental fee and deposit before payment",
      "Track every rental status",
      "Clear return and refund process",
    ],
    flowEyebrow: "Rental Journey",
    flowTitle: "Every Step Connected Into One Seamless Experience",
    flowDescription:
      "KenetiX is designed to be more than just a sneaker rental platform — it is a space for people who value wellness, movement, and modern lifestyles. From discovering the right pair, booking, and seamless payments to real-time tracking and easy returns, every step is powered by technology to create a smooth, futuristic experience while connecting people through a shared passion-driven community.",
    simpleEyebrow: "Why it feels simple",
    simpleTitle: "Every status is designed to be visible",
    finalEyebrow: "Ready to run",
    finalTitle:
      "Pick your next pair and test the real feel on your own route",
    finalCta: "Sign up and rent",
    steps: [
      {
        number: "01",
        title: "Create and verify your account",
        description:
          "Set up your KenetiX profile with contact details, shoe size, and deposit information so the rental system can prepare your order correctly.",
        meta: "Profile setup",
      },
      {
        number: "02",
        title: "Choose the right running shoe",
        description:
          "Browse the catalog by brand, model, size, and running type, then check whether the shoes are available for your selected dates.",
        meta: "Shoe catalog",
      },
      {
        number: "03",
        title: "Book dates and pay",
        description:
          "Select pickup and return dates, review rental fee, deposit, and order details, then complete payment to confirm the booking.",
        meta: "Booking payment",
      },
      {
        number: "04",
        title: "Pick up and start running",
        description:
          "Collect the shoes in store or choose delivery. The system updates your rental status throughout the active rental period.",
        meta: "Pickup delivery",
      },
      {
        number: "05",
        title: "Return shoes and receive refund",
        description:
          "Return the shoes on time, let the team inspect their condition, and receive a transparent deposit refund or damage summary.",
        meta: "Return refund",
      },
    ],
    systemCards: [
      ["Booking", "Stores pickup and return dates, payment totals, and order status."],
      [
        "Inventory",
        "Tracks each shoe pair as available, rented, or waiting for inspection.",
      ],
      [
        "Payment",
        "Separates rental fee, deposit, and refund information after return.",
      ],
      [
        "Customer",
        "Keeps customer details ready for sizing support and rental communication.",
      ],
    ],
  },
};

export default function HowItWorks() {
  const { language = "en" } = useLanguage() || {};
  const copy = pageCopy[language] || pageCopy.en;

  return (
    <div className="min-h-screen bg-kinetix-black text-kinetix-white">
      <Navbar />

      <section id="hiw-hero" className="border-y border-kinetix-border/80 mt-20">
        <div className="mx-auto grid max-w-[1400px] gap-12 px-4 pt-14 pb-20 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:pt-20 lg:pb-28">
          <motion.div className="flex flex-col justify-center" initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }}>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-kinetix-lime">
              {copy.eyebrow}
            </motion.p>
            <motion.h1 variants={fadeUp} className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] text-white lg:text-6xl">
              {copy.title}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              {copy.intro}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center justify-center rounded-full bg-kinetix-lime px-6 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
              >
                {copy.primaryCta}
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {copy.checkpoints.map((item) => (
                <div key={item} className="border-l border-kinetix-lime/60 pl-3">
                  <p className="text-xs leading-5 text-zinc-300">{item}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" variants={fadeRight} viewport={{ once: true, margin: "-60px" }} className="relative overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 min-h-[420px]">
            <img
              src="/videoframe_5325.png"
              alt="Running"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/80 px-5 py-4 backdrop-blur-md sm:px-6">
              <div className="grid grid-cols-3 gap-3 text-center">
                {copy.stats.map(([value, label]) => (
                  <div key={label}>
                    <p className="text-2xl font-bold text-kinetix-lime">
                      {value}
                    </p>
                    <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-zinc-400">
                      {label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="hiw-steps" className="mx-auto max-w-[1400px] px-4 pt-8 pb-16 sm:px-6 lg:pt-10 lg:pb-24">
        <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }} className="flex flex-col justify-between gap-6 border-b border-zinc-800 pb-8 lg:flex-row lg:items-end">
          <div>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-white">
              {copy.flowEyebrow}
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              {copy.flowTitle}
            </motion.h2>
          </div>
          <motion.p variants={fadeUp} className="max-w-xl text-sm leading-7 text-zinc-400">
            {copy.flowDescription}
          </motion.p>
        </motion.div>

        <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-40px" }} className="mt-10 grid gap-4 lg:grid-cols-5">
          {copy.steps.map((step) => (
            <motion.article
              key={step.number}
              variants={fadeUp}
              className="flex min-h-[300px] flex-col justify-between rounded-lg border border-[#1e1e20] bg-white/[0.03] p-5"
            >
              <div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-4xl font-black leading-none text-kinetix-lime">
                    {step.number}
                  </span>
                  <span className="rounded-md border border-zinc-800 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                    {step.meta}
                  </span>
                </div>
                <h3 className="mt-8 text-2xl font-bold leading-tight text-white">
                  {step.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-zinc-400">
                  {step.description}
                </p>
              </div>
              <div className="mt-8 h-1 w-full rounded-full bg-zinc-800">
                <div className="h-1 rounded-full bg-gradient-to-r from-kinetix-lime to-kinetix-aqua" />
              </div>
            </motion.article>
          ))}
        </motion.div>
      </section>

      <section id="hiw-system" className="border-y border-zinc-800 bg-zinc-950/70">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-60px" }}>
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-[0.28em] text-kinetix-lime">
              {copy.simpleEyebrow}
            </motion.p>
            <motion.h2 variants={fadeUp} className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {copy.simpleTitle}
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" variants={stagger} viewport={{ once: true, margin: "-40px" }} className="grid gap-4 sm:grid-cols-2">
            {copy.systemCards.map(([title, desc]) => (
              <motion.div key={title} variants={fadeUp} className="rounded-lg border border-zinc-800 bg-black p-5">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section id="hiw-cta" className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6 lg:py-24">
        <motion.div initial="hidden" whileInView="show" variants={fadeUp} viewport={{ once: true, margin: "-60px" }} className="flex flex-col items-start justify-between gap-8 rounded-lg border border-kinetix-lime/40 bg-kinetix-lime px-6 py-8 text-black sm:px-8 lg:flex-row lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em]">
              {copy.finalEyebrow}
            </p>
            <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight lg:text-5xl">
              {copy.finalTitle}
            </h2>
          </div>
          <Link
            to="/signup"
            className="inline-flex h-12 shrink-0 items-center justify-center rounded-lg bg-black px-6 text-sm font-bold text-white transition-transform hover:scale-[1.02]"
          >
            {copy.finalCta}
          </Link>
        </motion.div>
      </section>
      <Footer />
      <ScrollArrow sections={["hiw-hero", "hiw-steps", "hiw-system", "hiw-cta"]} />
    </div>
  );
}
