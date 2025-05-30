import { useState, useRef, useEffect } from 'react'
import './App.css'
import ThemeSwitch from './assets/themeSwitch'
import { FaArrowUp } from "react-icons/fa"

function App() {
  const [code, setCode] = useState('')
  const [logs, setLogs] = useState('')
  const [report, setReport] = useState('')
  const [correctedCode, setCorrectedCode] = useState('')

  const codeRef = useRef(null)
  const logsRef = useRef(null)

  const MAX_ROWS = 5
  const LINE_HEIGHT = 24

  const syncHeights = () => {
    if (codeRef.current && logsRef.current) {
      const maxHeight = MAX_ROWS * LINE_HEIGHT

      codeRef.current.style.height = 'auto'
      logsRef.current.style.height = 'auto'

      const codeHeight = Math.min(codeRef.current.scrollHeight, maxHeight)
      const logsHeight = Math.min(logsRef.current.scrollHeight, maxHeight)
      const syncedHeight = Math.max(codeHeight, logsHeight)

      codeRef.current.style.height = `${syncedHeight}px`
      logsRef.current.style.height = `${syncedHeight}px`
    }
  }

  const handleCodeChange = (e) => {
    setCode(e.target.value)
  }

  const handleLogsChange = (e) => {
    setLogs(e.target.value)
  }

  useEffect(() => {
    syncHeights()
  }, [code, logs])

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8000/debug', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, log: logs }),
      })

      if (!response.ok) throw new Error('Something went wrong')

      const data = await response.json()
      setReport(data.report)
      setCorrectedCode(data.corrected_code)
    } catch (error) {
      setReport('Error: Could not fetch result.')
      setCorrectedCode('')
    }
  }

  return (
    <div className='flex flex-col justify-center items-center pt-14'>
      <nav className='fixed top-0 bg-neutral-100 dark:bg-neutral-900 duration-200 shadow-lg h-12 w-full py-8 px-4 flex items-center'>
        <div className="flex flex-1">
          <a href="/" className="text-2xl font-semibold tracking-tight text-balance duration-200 hover:text-indigo-400 dark:hover:text-indigo-300 text-indigo-600 dark:text-indigo-500">
            Bot
          </a>
        </div>
        <ThemeSwitch withLabel={false} />
      </nav>

      <div className='flex w-4/5 flex-row-reverse'>
        <div className='flex flex-col max-w-2/3 py-3 my-7 rounded-2xl bg-neutral-300 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-400 duration-200 divide-y divide-neutral-400 dark:divide-neutral-700'>

          <div className='pb-2 px-4'>
            <label htmlFor="logs" className="block text-sm font-medium text-indigo-600 dark:text-indigo-500">
              Code
            </label>
            <div className='whitespace-pre-wrap font-mono text-sm bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg'>
              {code || 'No code provided.'}
            </div>
          </div>

          <div className='pt-2 px-4'>
            <label htmlFor="logs" className="block text-sm font-medium text-indigo-600 dark:text-indigo-500">
              Logs
            </label>
            <div className='whitespace-pre-wrap font-mono text-sm bg-neutral-100 dark:bg-neutral-800 p-2 rounded-lg'>
              {logs || 'No logs provided.'}
            </div>
          </div>

        </div>
      </div>

      <div className='flex w-4/5 flex-row justify-center items-center'>
        <div className='w-full my-7 text-neutral-900 dark:text-neutral-300 rounded-xl bg-neutral-200 dark:bg-neutral-800 px-5 py-4'>
          <p className="mb-3 font-semibold text-indigo-600 dark:text-indigo-400">Report:</p>
          <div className='whitespace-pre-wrap font-mono text-sm mb-4'>{report || 'No report yet.'}</div>
          <p className="mb-3 font-semibold text-indigo-600 dark:text-indigo-400">Corrected Code:</p>
          <div className='whitespace-pre-wrap font-mono text-sm'>{correctedCode || 'No corrected code yet.'}</div>
        </div>
      </div>

      <div className='h-60'></div>

      <div className='flex justify-center fixed bottom-10 w-full'>
        <div id='To_extend' className='flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800 bg-neutral-100 dark:bg-neutral-900 w-4/5 rounded-4xl shadow-lg duration-200'>
          <div className='flex flex-row px-3 py-3 gap-3'>
            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <label htmlFor="code" className="block text-sm font-medium text-indigo-600 dark:text-indigo-500">
                Code
              </label>
              <textarea
                id="code"
                ref={codeRef}
                value={code}
                onChange={handleCodeChange}
                rows={2}
                className='bg-neutral-200/50 dark:bg-neutral-800/50 rounded-xl w-full resize-none outline-none border-none p-4 overflow-y-auto text-neutral-900 dark:text-neutral-100 duration-200'
                style={{ maxHeight: `${MAX_ROWS * LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
              />
            </div>

            <div className='flex flex-col w-full justify-center items-center gap-2'>
              <label htmlFor="logs" className="block text-sm font-medium text-indigo-600 dark:text-indigo-500">
                Logs
              </label>
              <textarea
                id="logs"
                ref={logsRef}
                value={logs}
                onChange={handleLogsChange}
                rows={2}
                className='bg-neutral-200/50 dark:bg-neutral-800/50 rounded-xl w-full resize-none outline-none border-none p-4 overflow-y-auto text-neutral-900 dark:text-neutral-100 duration-200'
                style={{ maxHeight: `${MAX_ROWS * LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
              />
            </div>
          </div>
          <div className='flex flex-row-reverse px-5 py-2'>
            <button
              type="submit"
              onClick={handleSubmit}
              className="rounded-full cursor-pointer bg-indigo-600 px-3 py-3 text-sm font-semibold text-neutral-50 shadow-xs duration-200 hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <FaArrowUp />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
