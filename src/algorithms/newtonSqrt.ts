export type NewtonSqrtStep = {
  readonly type: 'start' | 'iterate' | 'done'
  readonly activeLines: readonly number[]
  readonly n: number
  readonly iteration: number
  readonly guess: number
  readonly quotient: number
  readonly nextGuess: number
  readonly answer: number
  readonly message: string
}

const clampInput = (value: number): number => {
  if (!Number.isFinite(value)) return 2
  return Math.max(0, Math.min(9999, Math.floor(value)))
}

export const buildNewtonSqrtSteps = (input: number): readonly NewtonSqrtStep[] => {
  const n = clampInput(input)
  const answer = Math.floor(Math.sqrt(n))

  if (n < 2) {
    return [
      {
        type: 'done',
        activeLines: [2, 3],
        n,
        iteration: 0,
        guess: n,
        quotient: n,
        nextGuess: n,
        answer: n,
        message: `${n} の平方根の整数部分は、そのまま ${n} です。`,
      },
    ]
  }

  const steps: NewtonSqrtStep[] = [
    {
      type: 'start',
      activeLines: [5],
      n,
      iteration: 0,
      guess: n,
      quotient: 1,
      nextGuess: Math.floor((n + 1) / 2),
      answer,
      message: `最初の推定値 x を ${n} にします。ここから大きすぎる値を少しずつ縮めます。`,
    },
  ]

  let guess = n
  let iteration = 1

  while (guess > n / guess) {
    const quotient = Math.floor(n / guess)
    const nextGuess = Math.floor((guess + quotient) / 2)

    steps.push({
      type: 'iterate',
      activeLines: [7, 8],
      n,
      iteration,
      guess,
      quotient,
      nextGuess,
      answer,
      message: `x = ${guess} は大きいので、n / x = ${quotient} と平均を取り、次の x を ${nextGuess} にします。`,
    })

    guess = nextGuess
    iteration += 1
  }

  steps.push({
    type: 'done',
    activeLines: [10],
    n,
    iteration,
    guess,
    quotient: Math.floor(n / guess),
    nextGuess: guess,
    answer,
    message: `${guess} * ${guess} <= ${n} になったので停止します。答えは ${guess} です。`,
  })

  return steps
}
