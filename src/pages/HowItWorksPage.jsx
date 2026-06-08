import { useLanguage } from "../context/useLanguage.js";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useRef } from "react";

function RunningShoeVisualizer() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const LIME = "#C3FF51";
    const L = (a) => `rgba(195,255,81,${a})`;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ── Shoe drawing (side profile, pointing right) ───────────────────
    const drawShoe = (cx, cy, sc, alpha) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(sc, sc);
      ctx.globalAlpha = alpha;

      // outsole (bottom thick band)
      ctx.beginPath();
      ctx.moveTo(-62, 22);
      ctx.bezierCurveTo(-62, 32, -40, 38, 10, 38);
      ctx.bezierCurveTo(50, 38, 72, 30, 78, 20);
      ctx.bezierCurveTo(72, 14, 50, 14, 10, 14);
      ctx.bezierCurveTo(-30, 14, -62, 14, -62, 22);
      ctx.closePath();
      ctx.fillStyle   = L(0.12);
      ctx.strokeStyle = L(0.7);
      ctx.lineWidth   = 1.5;
      ctx.fill();
      ctx.stroke();

      // midsole stripe
      ctx.beginPath();
      ctx.moveTo(-58, 16);
      ctx.bezierCurveTo(-20, 10, 30, 10, 74, 18);
      ctx.strokeStyle = L(0.35);
      ctx.lineWidth   = 2.5;
      ctx.stroke();

      // upper body
      ctx.beginPath();
      ctx.moveTo(-58, 14);
      ctx.bezierCurveTo(-58, -14, -28, -28, 10, -22);
      ctx.bezierCurveTo(42, -16, 68, 0, 76, 14);
      ctx.lineTo(-58, 14);
      ctx.closePath();
      ctx.fillStyle   = L(0.07);
      ctx.strokeStyle = L(0.6);
      ctx.lineWidth   = 1.5;
      ctx.fill();
      ctx.stroke();

      // heel counter curve
      ctx.beginPath();
      ctx.moveTo(-58, 14);
      ctx.bezierCurveTo(-58, -14, -42, -22, -22, -20);
      ctx.strokeStyle = L(0.25);
      ctx.lineWidth   = 1;
      ctx.stroke();

      // toe box arc
      ctx.beginPath();
      ctx.arc(72, 8, 14, -Math.PI * 0.55, Math.PI * 0.45);
      ctx.strokeStyle = L(0.3);
      ctx.lineWidth   = 1;
      ctx.stroke();

      // laces (4 crossbars)
      for (let i = 0; i < 4; i++) {
        const lx = -18 + i * 18;
        ctx.beginPath();
        ctx.moveTo(lx - 6, -18);
        ctx.lineTo(lx + 6, 6);
        ctx.strokeStyle = L(0.18);
        ctx.lineWidth   = 1.8;
        ctx.stroke();
      }

      // tongue
      ctx.beginPath();
      ctx.moveTo(-22, -20);
      ctx.bezierCurveTo(-22, -36, 4, -40, 14, -30);
      ctx.bezierCurveTo(4, -20, -10, -18, -22, -20);
      ctx.strokeStyle = L(0.22);
      ctx.lineWidth   = 1;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    // ── Footprint (sole imprint from above) ───────────────────────────
    const drawFootprint = (fx, fy, alpha) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = LIME;
      ctx.lineWidth   = 1;
      // heel
      ctx.beginPath();
      ctx.ellipse(fx, fy + 14, 9, 13, 0, 0, Math.PI * 2);
      ctx.stroke();
      // ball
      ctx.beginPath();
      ctx.ellipse(fx, fy - 6, 11, 8, 0, 0, Math.PI * 2);
      ctx.stroke();
      // toes
      [-10, -5, 0, 5, 10].forEach((tx, i) => {
        ctx.beginPath();
        ctx.arc(fx + tx, fy - 18 + (i === 0 || i === 4 ? 3 : 0), 2.5, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.restore();
    };

    // ── State ─────────────────────────────────────────────────────────
    let tick      = 0;
    let shoeX     = -120;
    const SPEED   = 2.2;
    const GROUND  = 0; // % from bottom, set each frame
    let stepCount = 0;
    let nextStep  = 180;

    // footprints array
    const prints  = [];

    // speed lines
    const speedLines = Array.from({ length: 8 }, (_, i) => ({
      yOff : -30 + i * 10,
      len  : 30 + Math.random() * 40,
      alpha: 0.1 + Math.random() * 0.25,
    }));

    let frameId;
    const draw = () => {
      const w  = canvas.width;
      const h  = canvas.height;
      const gy = h * 0.72; // ground Y
      tick++;

      // background
      ctx.fillStyle = "#07090b";
      ctx.fillRect(0, 0, w, h);

      // subtle grid
      ctx.strokeStyle = L(0.04);
      ctx.lineWidth   = 0.5;
      for (let gx = 0; gx < w; gx += 40) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke();
      }
      for (let gy2 = 0; gy2 < h; gy2 += 40) {
        ctx.beginPath(); ctx.moveTo(0, gy2); ctx.lineTo(w, gy2); ctx.stroke();
      }

      // ground line
      ctx.beginPath();
      ctx.moveTo(0, gy + 32);
      ctx.lineTo(w, gy + 32);
      ctx.strokeStyle = L(0.15);
      ctx.lineWidth   = 1;
      ctx.stroke();

      // ground glow
      const gGrad = ctx.createLinearGradient(0, gy + 32, 0, h);
      gGrad.addColorStop(0, L(0.06));
      gGrad.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = gGrad;
      ctx.fillRect(0, gy + 32, w, h - gy - 32);

      // shoe bob (vertical sine)
      const bobY = gy - 2 * Math.abs(Math.sin(tick * 0.12)) * 12;
      shoeX += SPEED;
      if (shoeX > w + 150) {
        shoeX     = -140;
        stepCount = 0;
        prints.length = 0;
      }

      // drop a footprint every ~nextStep px
      if (shoeX > nextStep && shoeX < w + 80) {
        prints.push({ x: shoeX - 30, y: gy + 34, life: 1 });
        stepCount++;
        nextStep = shoeX + 90 + Math.random() * 20;
      }

      // draw footprints (fade over time)
      prints.forEach((p) => {
        p.life -= 0.004;
        if (p.life > 0) drawFootprint(p.x, p.y, Math.min(p.life, 0.55));
      });

      // speed lines (behind shoe)
      speedLines.forEach((sl) => {
        const lx = shoeX - 80;
        ctx.beginPath();
        ctx.moveTo(lx, bobY + sl.yOff);
        ctx.lineTo(lx - sl.len, bobY + sl.yOff);
        ctx.strokeStyle = L(sl.alpha);
        ctx.lineWidth   = 1;
        ctx.stroke();
      });

      // shoe glow under
      const shoeGlow = ctx.createRadialGradient(shoeX, gy + 32, 0, shoeX, gy + 32, 80);
      shoeGlow.addColorStop(0, L(0.14));
      shoeGlow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = shoeGlow;
      ctx.beginPath();
      ctx.arc(shoeX, gy + 32, 80, 0, Math.PI * 2);
      ctx.fill();

      // shoe (scale 1.15 for visibility)
      ctx.shadowColor = LIME;
      ctx.shadowBlur  = 18;
      drawShoe(shoeX, bobY, 1.15, 1);
      ctx.shadowBlur  = 0;

      // HUD — top left
      ctx.font      = "bold 10px monospace";
      ctx.fillStyle = L(0.5);
      ctx.fillText("KINETIX RENTAL", 16, 22);
      ctx.font      = "10px monospace";
      ctx.fillStyle = L(0.3);
      ctx.fillText(`STEPS  ${String(stepCount).padStart(3, "0")}`, 16, 38);
      ctx.fillText(`SPEED  ${SPEED.toFixed(1)} m/s`, 16, 52);
      ctx.fillText(`DIST   ${((shoeX < 0 ? 0 : shoeX) / 100).toFixed(2)} km`, 16, 66);

      // pace dot (blinking)
      if (Math.floor(tick / 30) % 2 === 0) {
        ctx.beginPath();
        ctx.arc(w - 18, 18, 4, 0, Math.PI * 2);
        ctx.fillStyle   = LIME;
        ctx.shadowColor = LIME;
        ctx.shadowBlur  = 10;
        ctx.fill();
        ctx.shadowBlur  = 0;
      }
      ctx.font      = "10px monospace";
      ctx.fillStyle = L(0.3);
      ctx.textAlign = "right";
      ctx.fillText("REC", w - 26, 22);
      ctx.textAlign = "left";

      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

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

      <section className="border-y border-kinetix-border/80 mt-20">
        <div className="mx-auto grid max-w-[1440px] items-start gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-12 lg:py-20">
          <div className="flex flex-col justify-center">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-kinetix-lime">
              {copy.eyebrow}
            </p>
            <h1 className="mt-6 max-w-4xl font-display text-5xl font-bold leading-[1.02] text-white lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
              {copy.intro}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/catalog"
                className="inline-flex h-12 items-center justify-center rounded-full bg-kinetix-lime px-6 text-sm font-bold text-black transition-transform hover:scale-[1.02]"
              >
                {copy.primaryCta}
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-2 gap-3 sm:grid-cols-4">
              {copy.checkpoints.map((item) => (
                <div key={item} className="border-l border-kinetix-lime/60 pl-3">
                  <p className="text-xs leading-5 text-zinc-300">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[520px] overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950 sm:h-[620px] lg:h-[656px]">
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
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex flex-col justify-between gap-6 border-b border-zinc-800 pb-8 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-kinetix-aqua">
              {copy.flowEyebrow}
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
              {copy.flowTitle}
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-zinc-400">
            {copy.flowDescription}
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-5">
          {copy.steps.map((step) => (
            <article
              key={step.number}
              className="flex min-h-[300px] flex-col justify-between rounded-lg border border-zinc-800 bg-white/[0.03] p-5 transition-colors hover:border-kinetix-lime/70"
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
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-zinc-800 bg-zinc-950/70">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-kinetix-lime">
              {copy.simpleEyebrow}
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight text-white sm:text-5xl">
              {copy.simpleTitle}
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {copy.systemCards.map(([title, desc]) => (
              <div key={title} className="rounded-lg border border-zinc-800 bg-black p-5">
                <h3 className="text-lg font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex flex-col items-start justify-between gap-8 rounded-lg border border-kinetix-lime/40 bg-kinetix-lime px-6 py-8 text-black sm:px-8 lg:flex-row lg:items-center">
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
        </div>
      </section>
      <Footer />
    </div>
  );
}
