import { Link, createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  type NewtonSqrtStep,
  buildNewtonSqrtSteps,
} from '~/algorithms/newtonSqrt'

export const Route = createFileRoute('/algorithms/newton-sqrt')({
  component: NewtonSqrtPage,
})

function NewtonSqrtPage() {
  const [input, setInput] = useState('875')
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(850)

  const n = Number(input)
  const steps = useMemo(
    () => buildNewtonSqrtSteps(Number.isFinite(n) ? n : 2),
    [n],
  )
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [input])

  useEffect(() => {
    if (!isPlaying) return
    if (stepIndex >= steps.length - 1) {
      setIsPlaying(false)
      return
    }

    const timerId = window.setTimeout(() => {
      setStepIndex((current) => Math.min(current + 1, steps.length - 1))
    }, speed)

    return () => window.clearTimeout(timerId)
  }, [isPlaying, speed, stepIndex, steps.length])

  return (
    <main className="min-h-screen overflow-hidden bg-[#f4f6ff] text-slate-950">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(99,102,241,0.18),transparent_34%),radial-gradient(circle_at_88%_12%,rgba(14,165,233,0.14),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(244,246,255,0.72))]" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] min-w-0 flex-col gap-3 px-5 py-3 sm:px-8">
        <TopBar />

        <section className="rounded-xl border border-white/70 bg-white/72 p-4 shadow-[0_24px_80px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-5">
          <header className="mb-4 flex flex-col gap-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-normal text-slate-950 sm:text-3xl">
                integer_sqrt
              </h1>
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                ニュートン法
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              Rustで x の平方根の整数部分を求める例題です。推定値を更新しながら、答えへ近づく様子を確認できます。
            </p>
          </header>

          <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.55fr)_minmax(430px,1fr)]">
            <section className="grid min-w-0 gap-3 xl:grid-rows-[auto_1fr]">
              <Panel>
                <div className="grid gap-3 md:grid-cols-[260px_minmax(0,1fr)] md:items-end">
                  <Field label="平方根を求める整数 x">
                    <input
                      className="input-surface"
                      inputMode="numeric"
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                    />
                  </Field>
                  <div className="grid grid-cols-3 gap-2">
                    <Metric label="現在の推定値" value={String(currentStep.guess)} />
                    <Metric label="次の推定値" value={String(currentStep.nextGuess)} />
                    <Metric label="答え" value={String(currentStep.answer)} />
                  </div>
                </div>

                <div className="mt-4">
                  <NewtonVisualizer step={currentStep} />
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[auto_minmax(240px,1fr)] lg:items-center">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setIsPlaying((current) => !current)}
                      disabled={stepIndex >= steps.length - 1}
                    >
                      <span aria-hidden="true">{isPlaying ? '||' : '▷'}</span>
                      {isPlaying ? '一時停止' : '再生'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setStepIndex((current) => Math.max(current - 1, 0))
                      }
                      disabled={stepIndex === 0}
                    >
                      <span aria-hidden="true">←</span>
                      戻る
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setStepIndex((current) =>
                          Math.min(current + 1, steps.length - 1),
                        )
                      }
                      disabled={stepIndex >= steps.length - 1}
                    >
                      <span aria-hidden="true">→</span>
                      次へ
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsPlaying(false)
                        setStepIndex(0)
                      }}
                    >
                      <span aria-hidden="true">↻</span>
                      リセット
                    </Button>
                  </div>

                  <label className="grid grid-cols-[44px_minmax(0,1fr)] items-center gap-x-3 gap-y-1 text-sm font-medium text-slate-500">
                    <span>速度</span>
                    <input
                      className="w-full accent-indigo-600"
                      type="range"
                      min="200"
                      max="1400"
                      step="50"
                      value={speed}
                      onChange={(event) => setSpeed(Number(event.target.value))}
                    />
                    <span className="col-start-2 flex justify-between text-xs font-normal text-slate-500">
                      <span>遅い</span>
                      <span>速い</span>
                    </span>
                  </label>
                </div>
              </Panel>

              <Panel className="bg-indigo-50/55">
                <p className="mb-2 text-sm font-semibold text-indigo-600">
                  現在のステップ
                </p>
                <p className="text-base leading-7 text-slate-900">
                  {currentStep.message}
                </p>
                <p className="mt-3 text-sm text-slate-500">
                  step {stepIndex + 1} / {steps.length}
                </p>
              </Panel>
            </section>

            <aside className="flex min-w-0 flex-col gap-3">
              <Panel>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h2 className="text-sm font-bold uppercase tracking-normal text-slate-600">
                    Rustコード
                  </h2>
                  <CopyButton />
                </div>
                <RustCodePanel activeLines={currentStep.activeLines} />
              </Panel>

              <Panel>
                <h2 className="mb-2 text-sm font-bold text-slate-600">計算量</h2>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  <Metric label="時間計算量" value="O(log log x)" />
                  <Metric label="メモリ計算量" value="O(1)" />
                </dl>
              </Panel>

              <Panel>
                <p className="mb-2 text-sm font-semibold text-indigo-600">
                  判定条件
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  <code>guess &gt; x / guess</code> の間は guess が平方根より大きい状態です。整数除算だけを使うので、<code>guess * guess</code> のオーバーフローも避けられます。
                </p>
              </Panel>
            </aside>

          </div>
        </section>

        <Explanation />
      </div>
    </main>
  )
}

function TopBar() {
  return (
    <nav className="flex h-10 items-center justify-between">
      <Link
        to="/"
        className="flex items-center gap-3 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        <div className="grid size-7 place-items-center rounded-lg bg-indigo-600 text-base font-bold text-white shadow-lg shadow-indigo-600/25">
          A
        </div>
        <span className="text-base font-bold text-indigo-600">AlgoVis</span>
      </Link>
      <Link
        to="/algorithms/lower-bound"
        className="rounded-lg border border-indigo-100 bg-white/75 px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      >
        lower_bound
      </Link>
    </nav>
  )
}

function Field({
  label,
  children,
}: {
  readonly label: string
  readonly children: ReactNode
}) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-600">
      {label}
      {children}
    </label>
  )
}

function NewtonVisualizer({ step }: { readonly step: NewtonSqrtStep }) {
  const maxValue = Math.max(step.n, step.guess, step.nextGuess, 1)
  const answerPercent = (step.answer / maxValue) * 100
  const guessPercent = (step.guess / maxValue) * 100
  const nextPercent = (step.nextGuess / maxValue) * 100

  return (
    <div className="rounded-lg bg-[#f3f5ff] p-4">
      <div className="grid gap-3 md:grid-cols-3">
        <NumberBlock label="x" value={step.n} tone="slate" />
        <NumberBlock label="x / guess" value={step.quotient} tone="amber" />
        <NumberBlock label="(guess + x / guess) / 2" value={step.nextGuess} tone="indigo" />
      </div>

      <div className="mt-6 min-w-0 rounded-md bg-white/78 p-4">
        <div className="relative h-20">
          <div className="absolute left-0 right-0 top-9 h-2 rounded-full bg-slate-200" />
          <Marker
            label="答え"
            value={step.answer}
            percent={answerPercent}
            className="bg-emerald-500 text-emerald-900"
          />
          <Marker
            label="現在"
            value={step.guess}
            percent={guessPercent}
            className="bg-slate-700 text-slate-900"
          />
          <Marker
            label="次"
            value={step.nextGuess}
            percent={nextPercent}
            className="bg-indigo-500 text-indigo-900"
          />
        </div>
        <div className="mt-2 flex justify-between text-xs font-semibold text-slate-500">
          <span>0</span>
          <span>{maxValue}</span>
        </div>
      </div>
    </div>
  )
}

function NumberBlock({
  label,
  value,
  tone,
}: {
  readonly label: string
  readonly value: number
  readonly tone: 'slate' | 'amber' | 'indigo'
}) {
  const toneClassName = {
    slate: 'bg-slate-900 text-white',
    amber: 'bg-indigo-50 text-indigo-700',
    indigo: 'bg-indigo-100 text-indigo-800',
  }[tone]

  return (
    <div className={`rounded-md p-4 ${toneClassName}`}>
      <p className="text-xs font-bold uppercase tracking-normal opacity-75">
        {label}
      </p>
      <p className="mt-1 text-3xl font-black tracking-normal">{value}</p>
    </div>
  )
}

function Marker({
  label,
  value,
  percent,
  className,
}: {
  readonly label: string
  readonly value: number
  readonly percent: number
  readonly className: string
}) {
  const left = `clamp(0.75rem, ${percent}%, calc(100% - 0.75rem))`

  return (
    <div
      className="absolute top-0 flex -translate-x-1/2 flex-col items-center gap-1"
      style={{ left }}
    >
      <span className="rounded bg-white/90 px-2 py-1 text-xs font-bold text-slate-700 shadow-sm">
        {label}: {value}
      </span>
      <span className={`size-4 rounded-full ring-4 ring-white ${className}`} />
    </div>
  )
}

function Explanation() {
  return (
    <section className="grid min-h-[calc(100vh-4rem)] place-items-center rounded-xl border border-white/70 bg-white/72 p-5 shadow-[0_24px_80px_rgba(79,70,229,0.12)] backdrop-blur-xl sm:p-8">
      <div className="w-full max-w-[720px]">
        <p className="mb-3 text-sm font-semibold text-indigo-600">
          アルゴリズムの説明
        </p>
        <h2 className="text-3xl font-black tracking-normal text-slate-950 sm:text-4xl">
          ニュートン法の考え方
        </h2>

        <div className="mt-8 grid gap-5 text-base leading-8 text-slate-600">
          <p>
            平方根は「a * a が x に近い a」を探す問題です。最初に大きめの推定値 guess を置き、答えより大きい間だけ更新します。
          </p>
          <p>
            guess が大きすぎると x / guess は小さくなります。この2つの平均を取ると、平方根に近い値へ一気に寄せられます。
          </p>
          <p>
            整数で求めるので割り算と平均は切り捨てです。最後に guess &lt;= x / guess になった時点の guess が、平方根の整数部分です。
          </p>
        </div>
      </div>
    </section>
  )
}

const rustNewtonCode = [
  'fn integer_sqrt(x: u64) -> u64 {',
  '    if x < 2 {',
  '        return x;',
  '    }',
  '    let mut guess = x;',
  '',
  '    while guess > x / guess {',
  '        guess = (guess + x / guess) / 2;',
  '    }',
  '    guess',
  '}',
] as const

function RustCodePanel({
  activeLines,
}: {
  readonly activeLines: readonly number[]
}) {
  return (
    <div className="max-w-full overflow-x-auto rounded-md bg-[#0b1220] p-3 shadow-inner">
      <ol className="min-w-max font-mono text-sm leading-5 text-slate-300">
        {rustNewtonCode.map((line, index) => {
          const lineNumber = index + 1
          const isActive = activeLines.includes(lineNumber)

          return (
            <li
              key={lineNumber}
              className={[
                'grid grid-cols-[2.25rem_minmax(0,1fr)] rounded px-2',
                isActive ? 'bg-white/14 text-white' : 'text-slate-300',
              ].join(' ')}
            >
              <span className="select-none text-right text-slate-500">
                {lineNumber}
              </span>
              <code className="pl-4 whitespace-pre">{line}</code>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function CopyButton() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await window.navigator.clipboard.writeText(rustNewtonCode.join('\n'))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <button
      className="rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
      type="button"
      onClick={handleCopy}
    >
      ⧉ {copied ? 'コピー済み' : 'コピー'}
    </button>
  )
}

function Panel({
  children,
  className = '',
}: {
  readonly children: ReactNode
  readonly className?: string
}) {
  return (
    <section
      className={`min-w-0 rounded-lg border border-white/80 bg-white/78 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] ${className}`}
    >
      {children}
    </section>
  )
}

function Metric({
  label,
  value,
}: {
  readonly label: string
  readonly value: string
}) {
  return (
    <div className="rounded-md bg-[#f5f7ff] p-3">
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-bold text-slate-950">{value}</dd>
    </div>
  )
}

function Button({
  children,
  disabled,
  onClick,
  variant = 'primary',
}: {
  readonly children: ReactNode
  readonly disabled?: boolean
  readonly onClick: () => void
  readonly variant?: 'primary' | 'secondary'
}) {
  const className =
    variant === 'primary'
      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none'
      : 'border border-indigo-100 bg-white/75 text-slate-800 hover:bg-indigo-50 active:bg-indigo-100 disabled:bg-slate-100 disabled:text-slate-400'

  return (
    <button
      className={`flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-indigo-200 disabled:cursor-not-allowed ${className}`}
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  )
}
