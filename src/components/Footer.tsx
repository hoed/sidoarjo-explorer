export function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-16">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-accent text-xs font-black text-background">BP</span>
            <div>
              <div className="text-sm font-semibold tracking-widest">BPPD SIDOARJO</div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Badan Promosi Pariwisata Daerah</div>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm text-muted-foreground">
            The official tourism board of Sidoarjo Regency, East Java, Indonesia. Preserving heritage, celebrating culture, welcoming the world.
          </p>
          <form className="mt-8 flex max-w-md rounded-full glass p-1.5" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="your@email.com" className="flex-1 bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-foreground" />
            <button data-magnetic className="rounded-full bg-primary px-5 py-2 text-xs font-semibold uppercase tracking-widest text-background">
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Contact</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li>Jl. Pahlawan No. 141</li>
            <li>Sidoarjo 61213</li>
            <li>+62 31 8964 400</li>
            <li>hello@bppdsidoarjo.id</li>
          </ul>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Follow</div>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#" data-magnetic className="hover:text-primary">Instagram</a></li>
            <li><a href="#" data-magnetic className="hover:text-primary">YouTube</a></li>
            <li><a href="#" data-magnetic className="hover:text-primary">TikTok</a></li>
            <li><a href="#" data-magnetic className="hover:text-primary">Facebook</a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-16 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 px-6 pt-8 text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:flex-row">
        <span>© {new Date().getFullYear()} BPPD Sidoarjo. All rights reserved.</span>
        <span>Crafted with love in East Java</span>
      </div>
    </footer>
  );
}
