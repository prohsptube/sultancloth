import { Container } from "@/components/layout/Container";

export default function UnstitchedCollectionPage() {
  return (
    <Container className="py-12 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
        Unstitched · Collections
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Unstitched Collections</h1>
      <p className="mt-2 text-sm text-gray-700 max-w-2xl">
        Fabric cuts across men, women, and premium ranges will be listed here soon.
      </p>
    </Container>
  );
}
