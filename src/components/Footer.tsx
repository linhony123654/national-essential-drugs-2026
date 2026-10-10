import { Link } from 'react-router'

const MARQUEE_ITEMS = ['剂型适宜', '价格合理', '保障供应', '公平可及']

export default function Footer() {
  return (
    <footer className="mt-auto">
      {/* marquee strip */}
      <div className="overflow-hidden border-y border-line py-3">
        <div className="animate-marquee flex w-max gap-0 hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {Array.from({ length: 4 }).flatMap((_, r) =>
                MARQUEE_ITEMS.map((t) => (
                  <span key={`${r}-${t}`} className="flex items-center font-serif text-sm tracking-[0.3em] text-ink-2">
                    <span className="px-8">{t}</span>
                    <span className="text-gold">·</span>
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-deep text-[#E8EDE9] dark:bg-bg-elev dark:text-ink">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-10 px-6 py-16 md:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[#3BC08E]">
              <img src="/logo.svg" alt="" className="h-7 w-7" />
              <span className="font-serif font-bold text-[#E8EDE9] dark:text-ink">国家基本药物目录</span>
              <span className="font-mono text-[10px] text-gold">2026年版</span>
            </div>
            <p className="text-xs leading-6 opacity-70">国家级基本药物目录的可视化检索与数据洞察平台。</p>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">站点导航</h4>
            <ul className="space-y-2 text-sm">
              <li><Link className="opacity-80 transition-opacity hover:opacity-100" to="/">首页</Link></li>
              <li><Link className="opacity-80 transition-opacity hover:opacity-100" to="/drugs">药品检索</Link></li>
              <li><Link className="opacity-80 transition-opacity hover:opacity-100" to="/insights">数据洞察</Link></li>
              <li><Link className="opacity-80 transition-opacity hover:opacity-100" to="/guide">目录说明</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">目录构成</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><Link className="transition-opacity hover:opacity-100" to="/drugs?tab=chem">化学药品和生物制品 · 476</Link></li>
              <li><Link className="transition-opacity hover:opacity-100" to="/drugs?tab=tcm">中成药 · 318</Link></li>
              <li><Link className="transition-opacity hover:opacity-100" to="/guide">中药饮片 · 国家标准</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-mono text-xs uppercase tracking-widest opacity-60">数据说明</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>依据《中华人民共和国药典》（2025年版）</li>
              <li>发布机构：国家卫生健康委员会</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 dark:border-line">
          <p className="mx-auto max-w-[1200px] px-6 py-5 text-center text-xs opacity-60">
            本网站为数据可视化演示，目录内容以国家卫生健康委员会正式发布为准。
          </p>
        </div>
      </div>
    </footer>
  )
}
