// app/fabric-guide/page.tsx
import { Container } from "@/components/layout/Container";

export default function FabricGuidePage() {
  return (
    <div className="border-b border-zinc-800 bg-black">
      <Container className="py-10 md:py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-400">
            Fabric Guide
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
            Sultan Cloth Fabric Guide
          </h1>
          <p className="max-w-2xl text-sm text-zinc-400">
            Sultan is a fabric-first brand. Before you choose stitched or
            unstitched, understand which fabric suits your weather, occasion
            and personal style.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Lawn – For Pakistani Summers
          </h2>
          <p className="text-sm text-zinc-400">
            Lawn is a lightweight, breathable cotton-based fabric perfect for
            high temperatures. It feels cool on the skin and is ideal for daily
            wear in Pakistani and GCC summers. Sultan lawn is designed to be
            soft, colorfast and easy to iron.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Khaddar – For Winter Comfort
          </h2>
          <p className="text-sm text-zinc-400">
            Khaddar is a thicker, warmer fabric with a slightly textured feel.
            It is best suited for late autumn and winter. Sultan khaddar is
            woven to balance warmth with comfort so you can layer without
            feeling too heavy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Wash &amp; Wear – All-Season Ease
          </h2>
          <p className="text-sm text-zinc-400">
            Wash &amp; wear is a blended fabric engineered for minimal ironing
            and all-season usability. It is especially popular for men&apos;s
            shalwar kameez and kurtas because it drapes well and resists
            wrinkles. Sultan wash &amp; wear is selected for its fall, color
            depth and durability.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Boski &amp; Luxury Weaves
          </h2>
          <p className="text-sm text-zinc-400">
            For special occasions, luxury weaves like boski stand out with a
            subtle sheen and smooth finish. These fabrics are best suited for
            formal events, Eid wear and weddings.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-zinc-100">
            Care Instructions
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-400">
            <li>Always do the first wash gently, preferably by hand.</li>
            <li>Use mild detergents and avoid strong bleach.</li>
            <li>Turn garments inside-out before washing.</li>
            <li>For dark colors, wash separately to avoid color transfer.</li>
            <li>Follow ironing temperature according to fabric type.</li>
          </ul>
        </section>
      </Container>
    </div>
  );
}
