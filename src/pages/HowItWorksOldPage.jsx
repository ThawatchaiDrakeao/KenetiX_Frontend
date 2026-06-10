// src/pages/HowItWorks.jsx


export default function HowItWorks() {


  return (
    <div className="min-h-screen bg-[#E4E6EB] text-[#1A1A1A] px-6 md:px-16 py-14">
      {/* HERO */}
      <div className="mb-16">
        <p className="text-[10px] uppercase tracking-[3px] text-[#808090] font-bold mb-3">
          วิธีเช่า
        </p>

        <h1 className="text-[32px] md:text-[48px] font-extrabold leading-tight mb-5">
          เช่ารองเท้าวิ่ง <br />
          ได้ง่ายใน 3 ขั้นตอน
        </h1>

        <p className="text-[13px] text-[#808090] max-w-[700px] leading-relaxed">
          ระบบเช่ารองเท้าวิ่งออนไลน์สำหรับคนที่อยากลองรองเท้าหลายรุ่น
          ก่อนตัดสินใจซื้อจริง
        </p>
      </div>

      {/* STEPS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* CARD */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="w-12 h-12 rounded-xl bg-[#C3FF51] flex items-center justify-center text-black font-extrabold mb-5">
            1
          </div>

          <h2 className="text-[20px] font-bold mb-3">
            เลือกรองเท้า
          </h2>

          <p className="text-[13px] text-[#808090] leading-relaxed">
            เลือกแบรนด์ รุ่น และไซซ์ที่ต้องการจากรายการรองเท้าในระบบ
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="w-12 h-12 rounded-xl bg-[#00E5FF] flex items-center justify-center text-black font-extrabold mb-5">
            2
          </div>

          <h2 className="text-[20px] font-bold mb-3">
            จองวันเช่า
          </h2>

          <p className="text-[13px] text-[#808090] leading-relaxed">
            เลือกวันเริ่มเช่า ระยะเวลา และกรอกข้อมูลการจัดส่ง
          </p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-[#00FF41] to-[#00E5FF] flex items-center justify-center text-black font-extrabold mb-5">
            3
          </div>

          <h2 className="text-[20px] font-bold mb-3">
            รับรองเท้า
          </h2>

          <p className="text-[13px] text-[#808090] leading-relaxed">
            รองเท้าจะถูกจัดส่งถึงบ้าน พร้อมใช้งานทันที
          </p>
        </div>
      </div>
    </div>
  );
}