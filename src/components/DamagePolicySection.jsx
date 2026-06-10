const GRADES = [
  {
    grade: 'A',
    label: 'Perfect',
    criteria: 'สภาพเหมือนใหม่ ไม่มีรอยใดๆ',
    cost: 'ไม่มี',
    refund: 'คืนเต็มจำนวน ภายใน 1 วันทำการ',
    color: 'text-neon border-neon/30 bg-neon/5',
  },
  {
    grade: 'B',
    label: 'Normal Wear',
    criteria: 'รอยใช้งานปกติ ฝุ่นเล็กน้อย',
    cost: 'ไม่มี',
    refund: 'คืนเต็มจำนวน ภายใน 1 วันทำการ',
    color: 'text-neon border-neon/30 bg-neon/5',
  },
  {
    grade: 'C',
    label: 'Minor Damage',
    criteria: 'รอยขีดข่วน เปื้อนถาวร พื้นสึก (ซ่อมได้)',
    cost: 'ค่าซ่อมตามจริง',
    refund: 'คืนส่วนต่าง รอ 48 ชม. Dispute Window',
    color: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/5',
  },
  {
    grade: 'D',
    label: 'Major Damage',
    criteria: 'เสียหายหนัก ซ่อมไม่คุ้ม',
    cost: 'ค่าเสียหาย ≤ ราคาขายปลีก',
    refund: 'คืนส่วนต่าง รอ 48 ชม. Dispute Window',
    color: 'text-orange-400 border-orange-400/30 bg-orange-400/5',
  },
  {
    grade: 'E',
    label: 'Lost',
    criteria: 'สูญหาย / ไม่คืนรองเท้า',
    cost: 'ราคาขายปลีกเต็ม',
    refund: 'ไม่คืน + เรียกเก็บส่วนต่าง',
    color: 'text-red-400 border-red-400/30 bg-red-400/5',
  },
]

export default function DamagePolicySection() {
  return (
    <section id="damage" className="py-16 lg:py-20 bg-dark-card/20 border-t border-dark-border">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <span className="text-neon text-xs font-semibold tracking-widest uppercase">
            Damage Policy
          </span>
          <h2 className="mt-3 text-3xl lg:text-4xl font-extrabold text-white">
            นโยบายความเสียหาย
          </h2>
          <p className="mt-3 text-sm text-white/50 leading-relaxed max-w-xl">
            หลังรับรองเท้าคืน ทีม Admin ตรวจสภาพและให้เกรด A–E พร้อมรูปภาพหลักฐาน
            ผลเกรดกำหนดการคืนเงินมัดจำดังนี้
          </p>
        </div>

        {/* Grade cards */}
        <div className="flex flex-col gap-3">
          {GRADES.map((g) => (
            <div
              key={g.grade}
              className="bg-dark-elevated border border-dark-border rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:border-white/10 transition-colors duration-200"
            >
              {/* Badge */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full border font-extrabold text-sm flex items-center justify-center ${g.color}`}>
                {g.grade}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1">
                  <span className="text-sm font-bold text-white">{g.label}</span>
                  <span className="text-white/30 text-xs">·</span>
                  <span className="text-xs text-white/45">{g.criteria}</span>
                </div>
                <p className="text-xs text-white/35">{g.refund}</p>
              </div>

              {/* Cost pill */}
              <div className="flex-shrink-0">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${g.cost === 'ไม่มี' ? 'border-neon/20 text-neon/70 bg-neon/5' : 'border-white/10 text-white/50 bg-white/5'}`}>
                  {g.cost}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Dispute callout */}
        <div className="mt-8 border border-neon/20 bg-neon/5 rounded-xl px-5 py-4">
          <p className="text-sm font-semibold text-neon mb-1">Dispute Window (48 ชั่วโมง)</p>
          <p className="text-sm text-white/50 leading-relaxed">
            กรณีเกรด C หรือ D ลูกค้ามีเวลา 48 ชั่วโมงเพื่อโต้แย้งผลการตรวจ
            โดยติดต่อ{' '}
            <a href="mailto:hello@kinetix.run" className="text-neon hover:underline underline-offset-2 transition-colors">
              hello@kinetix.run
            </a>{' '}
            พร้อมหลักฐาน (รูปภาพ/วีดีโอ)
          </p>
        </div>
      </div>
    </section>
  )
}
