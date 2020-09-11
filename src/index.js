import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect
} from 'react'

const TabsState = createContext()
const Elements = createContext()

export const Tabs = ({ state: outerState, children }) => {
  const innerState = useState(0)
  const [elements] = useState(() => ({ tabs: 0, panels: 0 }))
  const state = outerState || innerState

  return (
    <Elements.Provider value={elements}>
      <TabsState.Provider value={state}>{children}</TabsState.Provider>
    </Elements.Provider>
  )
}

export const useTabState = () => {
  const [activeIndex, setActive] = useContext(TabsState)
  const elements = useContext(Elements)
  const [tabIndex, setTabIndex] = useState(0)

  useEffect(() => {
    if (elements.tabs !== 0) {
      setTabIndex(elements.tabs)
    }
    elements.tabs += 1
  }, [elements])

  const onClick = useCallback(() => setActive(tabIndex), [tabIndex, setActive])

  const state = useMemo(
    () => ({
      isActive: activeIndex === tabIndex,
      onClick
    }),
    [activeIndex, onClick, tabIndex]
  )

  return state
}

export const usePanelState = () => {
  const [activeIndex] = useContext(TabsState)
  const elements = useContext(Elements)

  const [panelIndex, setPanelIndex] = useState(0)

  useEffect(() => {
    if (elements.panels !== 0) {
      setPanelIndex(elements.panels)
    }
    elements.panels += 1
  }, [elements])

  return panelIndex === activeIndex
}

export const Tab = ({ children }) => {
  const state = useTabState()

  if (typeof children === 'function') {
    return children(state)
  }

  return isValidElement(children) ? cloneElement(children, state) : children
}

export const Panel = ({ active, children }) => {
  const isActive = usePanelState()

  return isActive || active ? children : null
}
