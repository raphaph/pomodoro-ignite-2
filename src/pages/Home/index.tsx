import { Play } from 'phosphor-react'
import {
  CountDownCotnainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartsCountdownButton,
  TaskInput,
} from './styles'

export function Home() {
  return (
    <HomeContainer>
      <form action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            id="task"
          />

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            step={5}
            max={60}
            min={5}
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

        <StartsCountdownButton type="submit">
          <Play />
          Começar
        </StartsCountdownButton>
      </form>
    </HomeContainer>
  )
}
