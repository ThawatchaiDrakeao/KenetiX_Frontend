import "./Section01.css";

function Section01() {

    return (
        <>
            {/* <!-- Section 01 --> */}
            <section id="brand" className="flex flex-col ">

                {/* <!-- Nav Bar เคลื่อนที่--> */}
                <div className="marquee-strip">
                    <div className="marquee-inner">
                        {/* <!-- duplicate for seamless loop --> */}
                        <span className="marquee-item">NIKE <span className="marquee-dot"></span></span>
                        <span className="marquee-item">ADIDAS <span className="marquee-dot"></span></span>
                        <span className="marquee-item">ASICS <span className="marquee-dot"></span></span>
                        <span className="marquee-item">BROOKS <span className="marquee-dot"></span></span>
                        <span className="marquee-item">HOKA <span className="marquee-dot"></span></span>
                        <span className="marquee-item">NEW BALANCE <span className="marquee-dot"></span></span>
                        <span className="marquee-item">SALOMON <span className="marquee-dot"></span></span>
                        <span className="marquee-item">MIZUNO <span className="marquee-dot"></span></span>
                        <span className="marquee-item">SAUCONY <span className="marquee-dot"></span></span>
                        <span className="marquee-item">NIKE <span className="marquee-dot"></span></span>
                        <span className="marquee-item">ADIDAS <span className="marquee-dot"></span></span>
                        <span className="marquee-item">ASICS <span className="marquee-dot"></span></span>
                        <span className="marquee-item">BROOKS <span className="marquee-dot"></span></span>
                        <span className="marquee-item">HOKA <span className="marquee-dot"></span></span>
                        <span className="marquee-item">NEW BALANCE <span className="marquee-dot"></span></span>
                        <span className="marquee-item">SALOMON <span className="marquee-dot"></span></span>
                        <span className="marquee-item">MIZUNO <span className="marquee-dot"></span></span>
                        <span className="marquee-item">SAUCONY <span className="marquee-dot"></span></span>
                    </div>
                </div>

                {/* <!-- หัวข้อ --> */}

                <div className="mt-20 ml-15 mb-5">
                    <div>
                        <span className="text-[#C3FF51] text-sm">———— PARTNER BRANDS</span>
                    </div>
                </div>

                <div>
                    <div className="ml-15 text-white">
                        <span className="text-5xl">Choose your brand</span>
                    </div>
                </div>

                {/* <!-- กล่องแบรนด์ --> */}
                <div className="flex justify-center">
                    <div className="mt-15 w-fit h-fit flex gap-10">
                        <div className="w-50 h-50 bg-[rgba(248,250,244,0.05)] text-white flex flex-col items-center justify-center gap-5">
                            <img src="./shoe logo/Nike.jpg" className="w-10 h-10 rounded-md" />
                            <span>Nike</span>
                            <span>10 Models</span>
                        </div>
                        <div className="w-50 h-50 bg-[rgba(248,250,244,0.05)] text-white flex flex-col items-center justify-center gap-5">
                            <img src="./shoe logo/Adidas.jpg" className="w-10 h-10 rounded-md" />
                            <span>Adidas</span>
                            <span>10 Models</span>
                        </div>
                        <div className="w-50 h-50 bg-[rgba(248,250,244,0.05)] text-white flex flex-col items-center justify-center gap-5">
                            <img src="./shoe logo/ASICS.jpg" className="w-10 h-10 rounded-md" />
                            <span>ASIC</span>
                            <span>10 Models</span>
                        </div>
                        <div className="w-50 h-50 bg-[rgba(248,250,244,0.05)] text-white flex flex-col items-center justify-center gap-5">
                            <img src="./shoe logo/Brooks.jpg" className="w-10 h-10 rounded-md" />
                            <span>brooks</span>
                            <span>10 Models</span>
                        </div>
                        <div className="w-50 h-50 bg-[rgba(248,250,244,0.05)] text-white flex flex-col items-center justify-center gap-5">
                            <img src="./shoe logo/Hoka.png" className="w-10 h-10 rounded-md" />
                            <span>Hoka</span>
                            <span>10 Models</span>
                        </div>
                        <div className="w-50 h-50 bg-[rgba(248,250,244,0.05)] text-white flex flex-col items-center justify-center gap-5">
                            <img src="./shoe logo/New Balance.jpg" className="w-10 h-10 rounded-md" />
                            <span>New Balance</span>
                            <span>10 Models</span>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Section01
