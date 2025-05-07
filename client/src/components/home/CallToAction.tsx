import { Link } from "wouter";

export default function CallToAction() {
  return (
    <section className="section bg-primary">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl text-white mb-6">Pronto para revolucionar seu conteúdo?</h2>
        <p className="text-white/90 max-w-2xl mx-auto mb-8">Junte-se a milhares de criadores que economizam tempo e aumentam seu engajamento com o ContentPro.</p>
        <Link href="/dashboard">
          <a className="inline-block bg-white text-primary font-medium px-8 py-3 rounded-lg hover:bg-gray-100 transition">
            Começar Grátis por 7 Dias
          </a>
        </Link>
        <p className="text-white/70 mt-4">Sem necessidade de cartão de crédito</p>
      </div>
    </section>
  );
}
