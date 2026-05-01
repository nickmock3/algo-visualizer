import { Link, createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import {
  type LowerBoundStep,
  buildLowerBoundSteps,
  parseSortedNumbers,
} from '~/algorithms/lowerBound'

const initialInput = '2, 4, 4, 7, 9, 13, 18, 21'
const initialTarget = 8

export const Route = createFileRoute('/algorithms/lower-bound')({
  component: LowerBoundPage,
})

function LowerBoundPage() {
  const [arrayInput, setArrayInput] = useState(initialInput)
  const [targetInput, setTargetInput] = useState(String(initialTarget))
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(700)

  const values = useMemo(() => parseSortedNumbers(arrayInput), [arrayInput])
  const target = Number(targetInput)
  const steps = useMemo(
    () => buildLowerBoundSteps(values, Number.isFinite(target) ? target : 0),
    [target, values],
  )
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]
  const lastStep = steps[steps.length - 1]
  const resultIndex = lastStep.type === 'found' ? lastStep.index : 0

  useEffect(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [arrayInput, targetInput])

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
                lower_bound
              </h1>
              <span className="rounded-full border border-indigo-100 bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
                二分探索
              </span>
            </div>
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              整列済み配列で、target 以上になる最初の位置を二分探索で探します。
            </p>
          </header>

          <div className="grid items-stretch gap-3 xl:grid-cols-[minmax(0,1.65fr)_minmax(420px,1fr)]">
            <section className="grid min-w-0 gap-3 xl:grid-rows-[auto_1fr]">
              <Panel>
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_210px]">
                  <Field label="配列">
                    <input
                      className="input-surface"
                      value={arrayInput}
                      onChange={(event) => setArrayInput(event.target.value)}
                    />
                  </Field>
                  <Field label="target">
                    <input
                      className="input-surface"
                      inputMode="numeric"
                      value={targetInput}
                      onChange={(event) => setTargetInput(event.target.value)}
                    />
                  </Field>
                </div>

                <div className="mt-4">
                  <ArrayVisualizer
                    step={currentStep}
                    resultIndex={resultIndex}
                    stepIndex={stepIndex}
                  />
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-[auto_minmax(240px,1fr)] lg:items-center">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => setIsPlaying((current) => !current)}
                      disabled={stepIndex >= steps.length - 1}
                    >
                      <span aria-hidden="true">{isPlaying ? '⏸' : '▷'}</span>
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
                      min="150"
                      max="1200"
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

              <Panel className="flex min-h-0 flex-col justify-between bg-indigo-50/55">
                <div>
                <p className="mb-3 text-sm font-semibold text-indigo-600">
                  現在のステップ
                </p>
                <p className="text-base leading-7 text-slate-900">
                  {currentStep.message}
                </p>
                </div>
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
                  <Metric label="時間計算量" value="O(log n)" />
                  <Metric label="メモリ計算量" value="O(1)" />
                </dl>
              </Panel>

              <Panel>
                <p className="mb-2 text-sm font-semibold text-indigo-600">
                  ♢ アルゴリズムのヒント
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  探索範囲を半分ずつ絞り込み、効率的に位置を特定します。
                </p>
              </Panel>
            </aside>
          </div>
        </section>
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
      <div className="flex items-center gap-3">
        <div className="hidden items-center rounded-full border border-white/70 bg-white/65 p-1 shadow-sm sm:flex">
          <button className="grid size-7 place-items-center rounded-full bg-white text-sm text-slate-500 shadow-sm" type="button">
            ☼
          </button>
          <button className="grid size-7 place-items-center rounded-full text-sm text-slate-500" type="button">
            ◐
          </button>
        </div>
        <button className="grid size-7 place-items-center rounded-full bg-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-600/20" type="button">
          ?
        </button>
        <button className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700" type="button">
          更新を完了
        </button>
      </div>
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

function ArrayVisualizer({
  step,
  resultIndex,
  stepIndex,
}: {
  readonly step: LowerBoundStep
  readonly resultIndex: number
  readonly stepIndex: number
}) {
  const activeLeft = step.type === 'found' ? step.index : step.left
  const activeRight = step.type === 'found' ? step.index : step.right
  const mid = step.type === 'found' ? undefined : step.mid

  return (
    <div className="min-w-0 rounded-lg bg-[#f3f5ff] p-3">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-slate-700">
        <span>
          探索範囲: [{activeLeft}, {activeRight})
        </span>
        <span>挿入位置: {resultIndex}</span>
      </div>
      <div className="grid max-w-full auto-cols-max grid-flow-col gap-2 overflow-x-auto pb-1">
        {step.values.map((value, index) => (
          <ArrayCell
            key={`${value}-${index}-${stepIndex}`}
            value={value}
            index={index}
            isInRange={index >= activeLeft && index < activeRight}
            isMid={index === mid}
            isInsertPosition={step.type === 'found' && index === step.index}
          />
        ))}
        {resultIndex === step.values.length ? (
          <div className="flex min-w-[82px] flex-col items-center justify-end gap-2 rounded-md border border-dashed border-emerald-300 bg-emerald-50/80 p-2.5">
            <div className="h-16 w-7 rounded bg-emerald-500" />
            <span className="text-sm font-bold text-emerald-700">end</span>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function ArrayCell({
  value,
  index,
  isInRange,
  isMid,
  isInsertPosition,
}: {
  readonly value: number
  readonly index: number
  readonly isInRange: boolean
  readonly isMid: boolean
  readonly isInsertPosition: boolean
}) {
  const height = Math.max(24, Math.min(78, value * 3.4))
  const barClassName = isMid || isInsertPosition ? 'bg-emerald-500' : 'bg-slate-400'
  const cellClassName = [
    'flex min-w-[82px] flex-col items-center justify-end gap-2 rounded-md border p-2.5 transition',
    isMid || isInsertPosition
      ? 'border-emerald-200 bg-emerald-100/60 text-emerald-800 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]'
      : isInRange
        ? 'border-white bg-white/72 text-slate-800'
        : 'border-white bg-white/55 text-slate-500 opacity-75',
  ].join(' ')

  return (
    <div className={cellClassName}>
      <div
        className={`w-7 rounded ${barClassName}`}
        style={{ height: `${height}px` }}
      />
      <div className="text-center">
        <div className="text-lg font-bold">{value}</div>
        <div className="text-sm font-medium text-slate-500">#{index}</div>
      </div>
    </div>
  )
}

const rustLowerBoundCode = [
  'fn lower_bound(values: &Vec<i32>, target: i32) -> usize {',
  '    let mut left = 0;',
  '    let mut right = values.len();',
  '    while left < right {',
  '        let mid = (left + right) / 2;',
  '        if values[mid] >= target {',
  '            right = mid;',
  '        } else {',
  '            left = mid + 1;',
  '        }',
  '    }',
  '    left',
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
        {rustLowerBoundCode.map((line, index) => {
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
    await window.navigator.clipboard.writeText(rustLowerBoundCode.join('\n'))
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
