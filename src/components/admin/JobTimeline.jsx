const mockTimeline = {
  "JOB-000001": {
    jobNo: "JOB-000001", customer: "สมชาย", type: "DELIVERY", status: "IN_TRANSIT",
    steps: [
      { status: "WAITING_FOR_ADMIN_CONFIRMATION",  done: true,  time: "06 Jun 2026 10:00", role: "USER"   },
      { status: "WAITING_FOR_DRIVER_CONFIRMATION", done: true,  time: "06 Jun 2026 10:30", role: "ADMIN"  },
      { status: "DRIVER_CONFIRMED",                done: true,  time: "06 Jun 2026 10:45", role: "DRIVER" },
      { status: "PICKED_UP",                       done: true,  time: "06 Jun 2026 11:00", role: "DRIVER" },
      { status: "IN_TRANSIT",                      done: true,  time: "06 Jun 2026 11:30", role: "DRIVER" },
      { status: "DELIVERED",                       done: false, time: null,                role: "DRIVER" },
    ],
  },
};

const defaultTimeline = { jobNo: "—", customer: "—", type: "—", status: "—", steps: [] };

const card = { background: "#FFFFFF", border: "1px solid #E2E8F0", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" };

export default function JobTimeline({ jobId }) {
  const data = (jobId && mockTimeline[jobId]) || defaultTimeline;

  return (
    <div className="rounded-2xl p-5" style={card}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold font-sora text-[14px]" style={{ color: "#0F172A" }}>Job Timeline</h3>
        <div className="flex gap-2 items-center">
          <span className="text-[12px] font-sora" style={{ color: "#94A3B8" }}>{data.jobNo}</span>
          {data.status !== "—" && (
            <span className="text-xs px-2 py-0.5 rounded-full border font-sora text-[#0369A1] bg-[#E0F2FE] border-[#BAE6FD]">
              {data.status.replace(/_/g, " ")}
            </span>
          )}
        </div>
      </div>

      {data.steps.length === 0 ? (
        <p className="text-sm font-sora text-center py-8" style={{ color: "#94A3B8" }}>
          เลือก Job เพื่อดู Timeline
        </p>
      ) : (
        <div className="flex flex-col gap-0">
          {data.steps.map((step, i) => (
            <div key={step.status} className="flex gap-3 items-start">
              <div className="flex flex-col items-center">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-sora"
                  style={step.done
                    ? { background: "rgba(195,255,81,0.15)", color: "#4D7C0F", border: "1px solid rgba(195,255,81,0.40)" }
                    : { background: "#F8FAFC", color: "#CBD5E1", border: "1px solid #E2E8F0" }}
                >
                  {step.done ? "✓" : "○"}
                </div>
                {i < data.steps.length - 1 && (
                  <div className="w-px h-8" style={{ background: step.done ? "rgba(195,255,81,0.35)" : "#E2E8F0" }} />
                )}
              </div>
              <div className="pb-4">
                <p className="text-sm font-sora font-medium" style={{ color: step.done ? "#0F172A" : "#CBD5E1" }}>
                  {step.status.replace(/_/g, " ")}
                </p>
                <p className="text-xs font-sora" style={{ color: "#94A3B8" }}>
                  {step.done ? step.time : "รอดำเนินการ"} · {step.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
