import { FormContainer, MinutesAmountInput, TaskInput } from './styles'

import { useContext } from 'react'

import { useFormContext } from 'react-hook-form'
import { CycleContext } from '../../../contexts/CycleContext'

// interface NewCycleFormProps {
//   task: string
//   minutesAmount: number
// }

export function NewCycleForm() {
  const { activeCycle } = useContext(CycleContext)
  const { register } = useFormContext() // só funciona se tiver um FormProvider em volta do NewCycleForm
  return (
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
  )
}
