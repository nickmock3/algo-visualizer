import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f8f9ff] text-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_50%_26%,rgba(99,102,241,0.08),transparent_34%),radial-gradient(circle_at_50%_64%,rgba(129,140,248,0.07),transparent_34%),linear-gradient(180deg,#fbfcff_0%,#f7f8ff_100%)]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-8 py-7">
        <TopBar />

        <section className="flex flex-1 flex-col items-center justify-center pb-10 pt-20 text-center">
          <h1 className="text-6xl font-black tracking-normal text-slate-950 sm:text-7xl lg:text-8xl">
            Algo<span className="text-indigo-600">Vis</span>
          </h1>
          <p className="mt-8 text-2xl font-bold text-slate-600">
            アルゴリズムの動きを、見て・学ぶ。
          </p>
          <p className="mt-7 max-w-2xl text-base font-medium leading-8 text-slate-500">
            配列の状態変化やコードの実行ステップを視覚的に確認できる、
            <br className="hidden sm:block" />
            アルゴリズム学習のためのビジュアライザーです。
          </p>

          <div className="mt-16 grid w-full max-w-[960px] gap-4">
            <AlgorithmLink
              to="/algorithms/lower-bound"
              title="lower_bound"
              tag="二分探索"
              icon="≡"
              description="整列済み配列で、target 以上になる最初の位置を二分探索で探します。"
            />
            <AlgorithmLink
              to="/algorithms/newton-sqrt"
              title="integer_sqrt"
              tag="ニュートン法"
              icon="√"
              description="Rustで整数 x の平方根を求める反復計算を、推定値の動きと一緒に見ます。"
            />
          </div>
        </section>

        <footer className="flex items-center justify-center gap-3 pb-8 text-sm font-semibold text-slate-500">
          <span className="text-lg" aria-hidden="true">
            ▱
          </span>
          <span>アルゴリズムを、もっと直感的に。</span>
        </footer>
      </div>
    </main>
  )
}

function TopBar() {
  return (
    <nav className="flex h-12 items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        <div className="grid size-9 place-items-center rounded-lg bg-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-600/25">
          A
        </div>
        <span className="text-xl font-black text-slate-950">AlgoVis</span>
      </Link>
      <Link
        to="/algorithms/newton-sqrt"
        className="rounded-lg bg-indigo-600 px-7 py-3 text-base font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        はじめる
      </Link>
    </nav>
  )
}

function AlgorithmLink({
  to,
  title,
  tag,
  icon,
  description,
}: {
  readonly to: '/algorithms/lower-bound' | '/algorithms/newton-sqrt'
  readonly title: string
  readonly tag: string
  readonly icon: string
  readonly description: string
}) {
  const toneClassName = {
    icon: 'bg-indigo-50 text-indigo-600',
    tag: 'border-indigo-100 bg-indigo-50 text-indigo-600',
    arrow: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600',
    focus: 'hover:border-indigo-200 focus:ring-indigo-200',
  }

  return (
    <Link
      to={to}
      className={`group grid grid-cols-[96px_minmax(0,1fr)_80px] items-center gap-8 rounded-xl border border-slate-200/80 bg-white/86 p-7 text-left shadow-[0_16px_48px_rgba(79,70,229,0.08)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:shadow-[0_20px_56px_rgba(79,70,229,0.11)] focus:outline-none focus:ring-2 max-sm:grid-cols-1 max-sm:gap-5 max-sm:p-6 ${toneClassName.focus}`}
    >
      <div className={`grid size-20 place-items-center rounded-lg ${toneClassName.icon}`}>
        <span className="text-4xl leading-none">{icon}</span>
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-black tracking-normal text-slate-950">
            {title}
          </h2>
          <span
            className={`rounded-full border px-3 py-1 text-sm font-bold ${toneClassName.tag}`}
          >
            {tag}
          </span>
        </div>
        <p className="text-base font-medium leading-7 text-slate-600">
          {description}
        </p>
      </div>

      <div
        className={`grid size-16 place-items-center justify-self-end rounded-full text-4xl font-bold transition group-hover:text-white max-sm:justify-self-start ${toneClassName.arrow}`}
      >
        →
      </div>
    </Link>
  )
}
