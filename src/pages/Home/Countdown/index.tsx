import { differenceInSeconds } from 'date-fns'
import { useContext, useEffect } from 'react'
import { CycleContext } from '../../../contexts/CycleContext'
import { CountDownCotnainer, Separator } from './styles'

export function Countdown() {
  const {
    activeCycle,
    activeCycleId,
    markCurrentCycleAsFinished,
    amountSecondsPassed,
    setSecondsPassed,
  } = useContext(CycleContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // retorna o total de segundos cycle active

  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // retorna o total de segundos que ja se passaram

  const minutesAmount = Math.floor(currentSeconds / 60) // converte os segundos em minutos e arredonda com floor
  const secondsAmount = currentSeconds % 60 // pega o resto de segundos faltando

  const minutes = String(minutesAmount).padStart(2, '0') // completa um caracter vazio em uma string, quando outro caracter esta em falta
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} left`
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        const secondsDiff = differenceInSeconds(
          new Date(),
          new Date(activeCycle.startDate),
        )

        if (secondsDiff >= totalSeconds) {
          markCurrentCycleAsFinished()
          // setCycles((state) =>
          //   state.map((cycle) => {
          //     if (cycle.id === activeCycleId) {
          //       return { ...cycle, finishedDate: new Date() }
          //     } else {
          //       return cycle
          //     }
          //   }),
          // )

          setSecondsPassed(totalSeconds)
          clearInterval(interval)
        } else {
          setSecondsPassed(secondsDiff)
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  }, [
    activeCycle,
    totalSeconds,
    activeCycleId,
    markCurrentCycleAsFinished,
    setSecondsPassed,
  ])
  return (
    <CountDownCotnainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownCotnainer>
  )
}
