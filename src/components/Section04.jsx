import { useKinetix } from "../../context/KinetixContext";
import { productsData } from "../data/products";

export default function Section04() {
    const { addRental, user } = useKinetix();

    const handleRent = (product) => {
        if (!user) {
            alert("Please login before renting shoes");
            return;
        }

        addRental({
            name: product.model_name,
            brand: product.brand,
            price: product.rental_price["1_day"],
            period: "/วัน",
            image: "👟",
        });
        alert(`Added ${product.model_name} to rental list!`);
    };

    const featuredProducts = productsData.slice(0, 3);

    return (
        <section className="bg-black text-white py-20 lg:py-32 px-6 lg:px-8">
            <div className="mx-auto max-w-390">
                <div className="mb-16">
                    <p className="text-[13px] font-semibold text-[#C3FF51] uppercase tracking-[0.35em] mb-4">
                        -------- RECOMMENDED
                    </p>
                    <h2 className="text-4xl md:text-5xl font-extrabold">
                        Popular Shoes
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {featuredProducts.map((product, index) => (
                        <div
                            key={index}
                            className="rounded-lg border border-[#1f2937] bg-[#0b0c10] overflow-hidden hover:border-[#C3FF51] transition group"
                        >
                            <div className="h-64 bg-gradient-to-br from-[#1f2937] to-[#090a0d] flex items-center justify-center text-7xl group-hover:scale-105 transition">
                                👟
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-[12px] font-bold text-[#C3FF51] uppercase tracking-wider">
                                        {product.brand}
                                    </span>
                                    <span className="text-[12px] text-[#8f94a5]">
                                        {product.category}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold mb-4">{product.model_name}</h3>
                                <div className="flex items-center gap-2 mb-6">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <span key={i} className="text-[#C3FF51]">★</span>
                                        ))}
                                    </div>
                                    <span className="text-[13px] text-[#8f94a5]">(4.9 Reviews)</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-3xl font-extrabold text-[#C3FF51]">
                                            ฿{product.rental_price["1_day"]}
                                        </p>
                                        <p className="text-[12px] text-[#8f94a5]">/วัน</p>
                                    </div>
                                    <button
                                        onClick={() => handleRent(product)}
                                        className="rounded-3xl bg-[#C3FF51] text-black px-6 py-3 font-semibold hover:bg-[#D3FE51] transition text-[13px]"
                                    >
                                        Rent
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}