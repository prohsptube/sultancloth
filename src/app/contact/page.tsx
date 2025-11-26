import { Container } from "@/components/layout/Container";

export default function ContactPage() {
  return (
    <Container className="py-10 text-sm text-zinc-300 space-y-3">
      <h1 className="text-2xl font-semibold text-zinc-50 mb-2">Contact</h1>
      <p>Email: support@sultancloth.com</p>
      <p>WhatsApp: +92-XXX-XXXXXXX</p>
      <p>Instagram: @sultancloth</p>
    </Container>
  );
}
