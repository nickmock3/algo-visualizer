export type LowerBoundStep =
  | {
      readonly type: 'inspect'
      readonly activeLines: readonly number[]
      readonly left: number
      readonly right: number
      readonly mid: number
      readonly target: number
      readonly values: readonly number[]
      readonly message: string
    }
  | {
      readonly type: 'move-left'
      readonly activeLines: readonly number[]
      readonly left: number
      readonly right: number
      readonly mid: number
      readonly target: number
      readonly values: readonly number[]
      readonly message: string
    }
  | {
      readonly type: 'move-right'
      readonly activeLines: readonly number[]
      readonly left: number
      readonly right: number
      readonly mid: number
      readonly target: number
      readonly values: readonly number[]
      readonly message: string
    }
  | {
      readonly type: 'found'
      readonly activeLines: readonly number[]
      readonly index: number
      readonly target: number
      readonly values: readonly number[]
      readonly message: string
    }

export const buildLowerBoundSteps = (
  values: readonly number[],
  target: number,
): readonly LowerBoundStep[] => {
  const steps: LowerBoundStep[] = []
  let left = 0
  let right = values.length

  while (left < right) {
    const mid = Math.floor((left + right) / 2)
    const value = values[mid]

    steps.push({
      type: 'inspect',
      activeLines: [4, 5, 6],
      left,
      right,
      mid,
      target,
      values,
      message: `探索範囲 [${left}, ${right}) の中央 index ${mid} を見る`,
    })

    if (value >= target) {
      right = mid
      steps.push({
        type: 'move-left',
        activeLines: [7],
        left,
        right,
        mid,
        target,
        values,
        message: `${value} >= ${target} なので、答えは index ${mid} 以前にある`,
      })
    } else {
      left = mid + 1
      steps.push({
        type: 'move-right',
        activeLines: [9],
        left,
        right,
        mid,
        target,
        values,
        message: `${value} < ${target} なので、index ${mid} までは候補から外す`,
      })
    }
  }

  steps.push({
    type: 'found',
    activeLines: [11],
    index: left,
    target,
    values,
    message:
      left === values.length
        ? `${target} は末尾に挿入する`
        : `${target} は index ${left} の前に挿入する`,
  })

  return steps
}

export const parseSortedNumbers = (input: string): readonly number[] => {
  return input
    .split(',')
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isFinite(value))
    .toSorted((a, b) => a - b)
}
