import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaArrowUp, FaCode, FaBug, FaLightbulb, FaCheckCircle, FaCopy, FaHome } from "react-icons/fa"
import ThemeSwitch from '../assets/themeSwitch'

function Debug() {
  const [code, setCode] = useState('')
  const [logs, setLogs] = useState('')
  const [report, setReport] = useState('')
  const [correctedCode, setCorrectedCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copySuccess, setCopySuccess] = useState('')

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

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(type)
      setTimeout(() => setCopySuccess(''), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSubmit = async () => {
    if (!code.trim() && !logs.trim()) return
    
    setIsLoading(true)
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
    } catch {
      setReport('Error: Could not fetch result.')
      setCorrectedCode('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 transition-all duration-500'>
      {/* Enhanced Navigation */}
      <nav className='fixed top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-lg duration-300 shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50 h-16 w-full px-6 flex items-center z-50'>
        <div className="flex flex-1 items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <FaCode className="text-white text-lg" />
          </div>
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
            CodeDebugger AI
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            <FaHome />
            Home
          </Link>
          <ThemeSwitch withLabel={false} />
        </div>
      </nav>
      
      {/* Main Content Container with proper scrolling */}
      <div className="pt-20 pb-96 px-4 flex flex-col items-center min-h-screen">
        <div className="w-full max-w-6xl space-y-8">
        
        {/* Enhanced Input Preview */}
        <div className='flex w-full flex-row-reverse mb-8'>
          <div className='flex flex-col max-w-2/3 p-6 rounded-3xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm text-neutral-800 dark:text-neutral-200 shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 divide-y divide-neutral-300 dark:divide-neutral-600 transition-all duration-300 hover:shadow-2xl'>
            
            <div className='pb-4'>
              <div className="flex items-center gap-2 mb-3">
                <FaCode className="text-indigo-500 text-lg" />
                <label className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Your Code
                </label>
              </div>
              <div className='whitespace-pre-wrap font-mono text-sm bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 min-h-[60px] transition-all duration-200'>
                {code || <span className="text-neutral-400 italic">No code provided yet...</span>}
              </div>
            </div>

            <div className='pt-4'>
              <div className="flex items-center gap-2 mb-3">
                <FaBug className="text-red-500 text-lg" />
                <label className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Error Logs
                </label>
              </div>
              <div className='whitespace-pre-wrap font-mono text-sm bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 min-h-[60px] transition-all duration-200'>
                {logs || <span className="text-neutral-400 italic">No logs provided yet...</span>}
              </div>
            </div>

          </div>
        </div>

        {/* Enhanced Results Section - Only show when there are results or loading */}
        {(report || correctedCode || isLoading) && (
          <div className='flex w-full flex-row justify-center items-center mb-8'>
            <div className='w-full p-8 text-neutral-900 dark:text-neutral-100 rounded-3xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl'>
              
              {/* AI Report Section */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                      <FaLightbulb className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text">
                      AI Analysis Report
                    </h3>
                  </div>
                  {report && report !== 'No report yet.' && report !== 'Error: Could not fetch result.' && (
                    <button
                      onClick={() => copyToClipboard(report, 'report')}
                      className="flex items-center gap-2 px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                    >
                      <FaCopy />
                      {copySuccess === 'report' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className='whitespace-pre-wrap font-mono text-sm bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 shadow-inner min-h-[120px] transition-all duration-200'>
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                      <span className="text-blue-600 dark:text-blue-400 animate-pulse">Analyzing your code...</span>
                    </div>
                  ) : (
                    <span className={report && report !== 'No report yet.' ? '' : 'text-neutral-400 italic'}>
                      {report || 'No report yet. Submit your code and logs to get AI analysis.'}
                    </span>
                  )}
                </div>
              </div>

              {/* Corrected Code Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <FaCheckCircle className="text-white text-lg" />
                    </div>
                    <h3 className="text-xl font-bold text-transparent bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text">
                      Corrected Code
                    </h3>
                  </div>
                  {correctedCode && correctedCode !== 'No corrected code yet.' && (
                    <button
                      onClick={() => copyToClipboard(correctedCode, 'code')}
                      className="flex items-center gap-2 px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                    >
                      <FaCopy />
                      {copySuccess === 'code' ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
                <div className='whitespace-pre-wrap font-mono text-sm bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow-inner min-h-[120px] transition-all duration-200'>
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-500"></div>
                      <span className="text-green-600 dark:text-green-400 animate-pulse">Generating corrected code...</span>
                    </div>
                  ) : (
                    <span className={correctedCode && correctedCode !== 'No corrected code yet.' ? '' : 'text-neutral-400 italic'}>
                      {correctedCode || 'No corrected code yet. Submit your code and logs to get AI suggestions.'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        </div>
      </div>

      {/* Enhanced Input Section */}
      <div className='flex justify-center fixed bottom-6 w-full px-4 z-40'>
        <div className='flex flex-col w-full max-w-6xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-neutral-200/50 dark:border-neutral-700/50 divide-y divide-neutral-200/50 dark:divide-neutral-700/50 transition-all duration-300 hover:shadow-3xl'>
          
          <div className='flex flex-row px-6 py-6 gap-6'>
            {/* Code Input */}
            <div className='flex flex-col w-full justify-center items-center gap-3'>
              <div className="flex items-center gap-2">
                <FaCode className="text-indigo-500 text-lg" />
                <label htmlFor="code" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Your Code
                </label>
              </div>
              <textarea
                id="code"
                ref={codeRef}
                value={code}
                onChange={handleCodeChange}
                rows={2}
                placeholder="Paste your code here..."
                className='bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl w-full resize-none outline-none border-2 border-transparent focus:border-indigo-400 dark:focus:border-indigo-500 p-4 overflow-y-auto text-neutral-900 dark:text-neutral-100 transition-all duration-300 placeholder-neutral-400 shadow-inner'
                style={{ maxHeight: `${MAX_ROWS * LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
              />
            </div>

            {/* Logs Input */}
            <div className='flex flex-col w-full justify-center items-center gap-3'>
              <div className="flex items-center gap-2">
                <FaBug className="text-red-500 text-lg" />
                <label htmlFor="logs" className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Error Logs
                </label>
              </div>
              <textarea
                id="logs"
                ref={logsRef}
                value={logs}
                onChange={handleLogsChange}
                rows={2}
                placeholder="Paste your error logs here..."
                className='bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur-sm rounded-2xl w-full resize-none outline-none border-2 border-transparent focus:border-red-400 dark:focus:border-red-500 p-4 overflow-y-auto text-neutral-900 dark:text-neutral-100 transition-all duration-300 placeholder-neutral-400 shadow-inner'
                style={{ maxHeight: `${MAX_ROWS * LINE_HEIGHT}px`, lineHeight: `${LINE_HEIGHT}px` }}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div className='flex flex-row-reverse items-center justify-between px-6 py-4'>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isLoading || (!code.trim() && !logs.trim())}
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-xl hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="flex items-center gap-2">
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FaArrowUp className="group-hover:translate-y-[-2px] transition-transform duration-200" />
                    <span>Analyze Code</span>
                  </>
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {code.trim() || logs.trim() ? '✓ Ready to analyze' : 'Enter code or logs to get started'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Debug
