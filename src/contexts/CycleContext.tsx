import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from 'react'
import {
  ActionTypes,
  addNewCycleAction,
  interruptCycleAction,
  markCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'

interface CreateCycleDate {
  task: string
  minutesAmount: number
}

interface CyclesContextType {
  cycles: Cycle[]
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (secods: number) => void
  createNewCycle: (data: CreateCycleDate) => void
  interruptCycle: () => void
}

export const CycleContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // const [cycles, setCycles] = useState<Cycle[]>([]) // cria um novo state referenciando a interface acima

  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (initialState) => {
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON) // EU ACHO QUE ESSE FUNÇÃO AQUI RETORNA OS DADOS ANTERIORES SALVOS NO LOCALSTORAGE PRA NOSSA LISTA
      }

      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState

  // const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // recupera o activeCycleId do cycle
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId) // retorna o cycle ativo com id

  useEffect(() => {
    const statejSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', statejSON)
  }, [cyclesState])

  function markCurrentCycleAsFinished() {
    dispatch(markCycleAsFinishedAction())
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
    // setActiveCycleId(null)
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleDate) {
    // data retorna os dados do formulário
    const id = String(new Date().getTime()) // armazena o id com uma string que recebe um valor unixtime

    const newCycle: Cycle = {
      // define os dados novo cycle
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))

    // setCycles((state) => [...state, newCycle]) // atualiza a lista de cycles executados
    // setActiveCycleId(newCycle.id) // atualiza o state com id atual do cycle ativo | FOI PRO REDUCER
    setAmountSecondsPassed(0)

    // reset()
  }

  function interruptCycle() {
    dispatch(interruptCycleAction())
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
    // setActiveCycleId(null)
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
