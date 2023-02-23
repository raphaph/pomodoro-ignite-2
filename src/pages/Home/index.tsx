import { Play, Stop } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { useEffect, useState } from 'react'
import { differenceInSeconds } from 'date-fns'

import {
  CountDownCotnainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(5, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

// interface NewCycleFormProps {
//   task: string
//   minutesAmount: number
// }

type NewCycleFormProps = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]) // cria um novo state referenciando a interface acima
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // recupera o activeCycleId do cycle
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // retorna o cycle ativo com id

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0 // retorna o total de segundos cycle active
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0 // retorna o total de segundos que ja se passaram

  const minutesAmount = Math.floor(currentSeconds / 60) // converte os segundos em minutos e arredonda com floor
  const secondsAmount = currentSeconds % 60 // pega o resto de segundos faltando

  const minutes = String(minutesAmount).padStart(2, '0') // completa um caracter vazio em uma string, quando outro caracter esta em falta
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        setAmountSecondsPassed(
          differenceInSeconds(new Date(), activeCycle.startDate),
        )
      }, 1000)
    }

    return () => {
      clearInterval(interval)
    }
  })

  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutes}:${seconds} left`
    }
  }, [minutes, seconds, activeCycle])

  function handleCreateNewCycle(data: NewCycleFormProps) {
    // data retorna os dados do formulário
    const id = String(new Date().getTime()) // armazena o id com uma string que recebe um valor unixtime

    const newCycle: Cycle = {
      // define os dados novo cycle
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle]) // atualiza a lista de cycles executados
    setActiveCycleId(newCycle.id) // atualiza o state com id atual do cycle ativo
    setAmountSecondsPassed(0)

    reset()
  }

  function handleInterruptCycle() {
    setCycles(
      cycles.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    )
    setActiveCycleId(null)
  }

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormProps>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  const task = watch('task')
  const minutesAmountValidation = watch('minutesAmount')
  const isSubmitDisabled = !task || !minutesAmountValidation

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            {...register('task')}
            disabled={!!activeCycle}
          />

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            max={60}
            min={5}
            {...register('minutesAmount', { valueAsNumber: true })}
            disabled={!!activeCycle}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Projeto 4" />
          </datalist>

          <span>minutos.</span>
        </FormContainer>

        <CountDownCotnainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountDownCotnainer>

        {activeCycle ? (
          <StopCountdownButton onClick={handleInterruptCycle} type="button">
            <Stop />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
