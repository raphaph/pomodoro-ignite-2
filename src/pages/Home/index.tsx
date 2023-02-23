import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'

import {
  CountDownCotnainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartsCountdownButton,
  TaskInput,
} from './styles'
import { useState } from 'react'

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
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]) // cria um novo state referenciando a interface acima
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // recupera o activeCycleId do cycle

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // retorna o cycle ativo com id

  console.log(activeCycle)

  function handleCreateNewCycle(data: NewCycleFormProps) {
    // data retorna os dados do formulário
    const id = String(new Date().getTime()) // armazena o id com uma string que recebe um valor unixtime

    const newCycle: Cycle = {
      // define os dados novo cycle
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
    }

    setCycles((state) => [...state, newCycle]) // atualiza a lista de cycles executados
    setActiveCycleId(newCycle.id) // atualiza o state com id atual do cycle ativo

    reset()
  }

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormProps>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  const task = watch('task')
  const minutesAmount = watch('minutesAmount')
  const isSubmitDisabled = !task || !minutesAmount

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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownCotnainer>

        <StartsCountdownButton disabled={isSubmitDisabled} type="submit">
          <Play />
          Começar
        </StartsCountdownButton>
      </form>
    </HomeContainer>
  )
}
