import { useState } from 'react'
import { Button, Card, CardBody } from 'windmill-react-ui'

const BUTTONS = [
  { label: 'AC', type: 'action', wide: false },
  { label: '+/-', type: 'action', wide: false },
  { label: '%', type: 'operator', wide: false },
  { label: '÷', type: 'operator', wide: false },
  { label: '7', type: 'number', wide: false },
  { label: '8', type: 'number', wide: false },
  { label: '9', type: 'number', wide: false },
  { label: '×', type: 'operator', wide: false },
  { label: '4', type: 'number', wide: false },
  { label: '5', type: 'number', wide: false },
  { label: '6', type: 'number', wide: false },
  { label: '−', type: 'operator', wide: false },
  { label: '1', type: 'number', wide: false },
  { label: '2', type: 'number', wide: false },
  { label: '3', type: 'number', wide: false },
  { label: '+', type: 'operator', wide: false },
  { label: '0', type: 'number', wide: true },
  { label: '.', type: 'number', wide: false },
  { label: '=', type: 'equals', wide: false },
]

function evaluate(a, op, b) {
  const numA = parseFloat(a)
  const numB = parseFloat(b)
  switch (op) {
    case '+': return numA + numB
    case '−': return numA - numB
    case '×': return numA * numB
    case '÷': return numB !== 0 ? numA / numB : 'Error'
    default: return numB
  }
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  function handleNumber(digit) {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }

  function handleDecimal() {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
      return
    }
    if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  function handleOperator(op) {
    const current = parseFloat(display)
    if (prevValue !== null && operator && !waitingForOperand) {
      const result = evaluate(prevValue, operator, current)
      const resultStr = String(parseFloat(result.toPrecision ? result.toPrecision(10) : result))
      setDisplay(resultStr)
      setPrevValue(resultStr)
    } else {
      setPrevValue(display)
    }
    setOperator(op)
    setWaitingForOperand(true)
  }

  function handleEquals() {
    if (operator && prevValue !== null) {
      const result = evaluate(prevValue, operator, parseFloat(display))
      const resultStr = typeof result === 'number'
        ? String(parseFloat(result.toPrecision(10)))
        : result
      setDisplay(resultStr)
      setPrevValue(null)
      setOperator(null)
      setWaitingForOperand(true)
    }
  }

  function handleAction(action) {
    if (action === 'AC') {
      setDisplay('0')
      setPrevValue(null)
      setOperator(null)
      setWaitingForOperand(false)
    } else if (action === '+/-') {
      setDisplay(String(parseFloat(display) * -1))
    } else if (action === '%') {
      setDisplay(String(parseFloat(display) / 100))
    }
  }

  function handleClick(btn) {
    if (btn.type === 'number') {
      if (btn.label === '.') handleDecimal()
      else handleNumber(btn.label)
    } else if (btn.type === 'operator') {
      handleOperator(btn.label)
    } else if (btn.type === 'equals') {
      handleEquals()
    } else if (btn.type === 'action') {
      handleAction(btn.label)
    }
  }

  function getButtonClassName(btn) {
    const base =
      'h-16 text-xl font-semibold rounded-2xl transition-all duration-100 active:scale-95 focus:outline-none '
    if (btn.type === 'operator' || btn.type === 'equals') {
      return base + 'bg-purple-600 hover:bg-purple-500 text-white'
    }
    if (btn.type === 'action') {
      return base + 'bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white'
    }
    return base + 'bg-gray-100 hover:bg-gray-200 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="w-80 shadow-2xl rounded-3xl overflow-hidden">
        <CardBody className="p-0">
          {/* Display */}
          <div className="bg-gray-800 dark:bg-gray-950 px-6 py-6 text-right">
            <p className="text-gray-400 text-sm h-5 mb-1">
              {prevValue !== null ? `${prevValue} ${operator ?? ''}` : ''}
            </p>
            <p
              className="text-white font-light overflow-hidden text-ellipsis whitespace-nowrap"
              style={{ fontSize: display.length > 10 ? '1.5rem' : '2.5rem' }}
            >
              {display}
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-1 p-3 bg-gray-50 dark:bg-gray-800">
            {BUTTONS.map((btn) => (
              <button
                key={btn.label}
                onClick={() => handleClick(btn)}
                className={`${getButtonClassName(btn)}${btn.wide ? ' col-span-2' : ''}`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
