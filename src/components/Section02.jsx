const brands = [
    { name: "Nike", logo: "👟" },
    { name: "Adidas", logo: "👟" },
    { name: "ASICS", logo: "👟" },
    { name: "Hoka", logo: "👟" },
    { name: "Brooks", logo: "👟" },
    { name: "Saucony", logo: "👟" },
];

export default function Section02() {
    return (
        <section className="bg-black text-white py-20 lg:py-32 px-6 lg:px-8">
            <div className="mx-auto max-w-[1560px]">
                <div className="mb-16">
                    <p className="text-[13px] font-semibold text-[#C3FF51] uppercase tracking-[0.35em] mb-4">
                        -------- AVAILABLE BRANDS
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold">
                        Top Tier Brands
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {brands.map((brand) => (
                        <div
                            key={brand.name}
                            className="rounded-lg border border-[#1f2937] bg-[#0b0c10] p-8 flex flex-col items-center justify-center gap-4 hover:border-[#C3FF51] hover:bg-[#0b0c10]/80 transition cursor-pointer"
                        >
                            <div className="text-5xl">{brand.logo}</div>
                            <p className="text-center font-semibold text-[15px]">{brand.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}