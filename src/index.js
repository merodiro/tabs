import React, {
  createContext,
  useState,
  useMemo,
  useContext,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useRef
} from 'react'

const TabsState = createContext()
const Elements = createContext()

export const Tabs = ({ state: outerState, children }) => {
  const innerState = useState(0)
  const [, setElements] = useState(() => ({ tabs: 0, panels: 0 }))
  const state = outerState || innerState

  return (
    <Elements.Provider value={setElements}>
      <TabsState.Provider value={state}>{children}</TabsState.Provider>
    </Elements.Provider>
  )
}

export const useTabState = () => {
  const [activeIndex, setActive] = useContext(TabsState)
  const setElements = useContext(Elements)
  const tabIndex = useRef()

  useEffect(() => {
    setElements(elements => {
      tabIndex.current = elements.tabs
      return {
        ...elements,
        tabs: elements.tabs + 1
      }
    })
  }, [setElements])

  const onClick = useCallback(() => setActive(tabIndex.current), [setActive])

  const state = useMemo(
    () => ({
      isActive: activeIndex === tabIndex.current,
      onClick
    }),
    [activeIndex, onClick]
  )

  return state
}

export const usePanelState = () => {
  const [activeIndex] = useContext(TabsState)
  const setElements = useContext(Elements)

  const panelIndex = useRef()

  useEffect(() => {
    setElements(elements => {
      panelIndex.current = elements.panels
      return {
        ...elements,
        panels: elements.panels + 1
      }
    })
  }, [setElements])

  return panelIndex.current === activeIndex
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
