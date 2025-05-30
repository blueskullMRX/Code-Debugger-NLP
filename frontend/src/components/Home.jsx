import { Link } from 'react-router-dom'
import { FaCode, FaBug, FaLightbulb, FaRocket, FaCog, FaChartLine, FaArrowRight, FaPlay } from 'react-icons/fa'
import ThemeSwitch from '../assets/themeSwitch'

function Home() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-neutral-50 via-neutral-100 to-neutral-200 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-800 relative overflow-hidden'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Code Symbols */}
        <div className="absolute top-20 left-10 text-6xl text-indigo-200/20 dark:text-indigo-800/20 animate-bounce">
          &lt;/&gt;
        </div>
        <div className="absolute top-40 right-20 text-4xl text-purple-200/20 dark:text-purple-800/20 animate-pulse">
          {}
        </div>
        <div className="absolute bottom-32 left-20 text-5xl text-blue-200/20 dark:text-blue-800/20 animate-bounce delay-75">
          []
        </div>
        <div className="absolute bottom-20 right-32 text-3xl text-cyan-200/20 dark:text-cyan-800/20 animate-pulse delay-150">
          ()
        </div>
        
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-indigo-400/30 to-purple-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-gradient-to-r from-purple-400/25 to-pink-600/25 rounded-full blur-2xl animate-pulse delay-700"></div>
      </div>

      {/* Enhanced Navigation */}
      <nav className='fixed top-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl shadow-lg border-b border-neutral-200/50 dark:border-neutral-700/50 h-16 w-full px-6 flex items-center z-50 transition-all duration-300'>
        <div className="flex flex-1 items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-200">
            <FaCode className="text-white text-lg" />
          </div>
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent hover:from-indigo-700 hover:to-purple-700 transition-all duration-300">
            CodeDebugger AI
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link 
            to="/debug" 
            className="px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors duration-200"
          >
            Debug Tool
          </Link>
          <ThemeSwitch withLabel={false} />
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-20 px-4 flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          
          {/* Main Hero Content */}
          <div className="space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full text-sm font-medium text-indigo-700 dark:text-indigo-300 animate-fade-in">
              <FaRocket className="text-indigo-500" />
              Powered by Advanced NLP & AI
            </div>
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold leading-tight">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                Debug Smarter
              </span>
              <br />
              <span className="text-neutral-800 dark:text-neutral-100">
                Code Better
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-300 max-w-4xl mx-auto leading-relaxed">
              Transform your debugging experience with our AI-powered solution that analyzes your code, 
              understands error patterns, and provides intelligent recommendations for faster problem resolution.
            </p>
          </div>          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-16">
            <Link
              to="/debug"
              className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-2xl transition-all duration-300 hover:from-indigo-700 hover:to-purple-700 hover:shadow-3xl hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <div className="flex items-center gap-3">
                <FaPlay className="group-hover:translate-x-1 transition-transform duration-200" />
                <span>Start Debugging Now</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Feature 1 */}
            <div className="group p-8 rounded-3xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaLightbulb className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                Intelligent Analysis
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Our NLP engine understands your code context and error patterns to provide precise, actionable insights.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 rounded-3xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaCog className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                Auto-Fix Suggestions
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Get corrected code snippets and step-by-step solutions tailored to your specific debugging needs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 rounded-3xl bg-white/70 dark:bg-neutral-800/70 backdrop-blur-sm shadow-xl border border-neutral-200/50 dark:border-neutral-700/50 transition-all duration-300 hover:shadow-2xl hover:scale-105">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <FaChartLine className="text-white text-2xl" />
              </div>
              <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                Performance Insights
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                Identify performance bottlenecks and optimization opportunities with detailed code analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
              Why Choose CodeDebugger AI?
            </h2>
            <p className="text-xl text-neutral-600 dark:text-neutral-300 max-w-3xl mx-auto">
              Built with cutting-edge Natural Language Processing and Machine Learning technologies 
              to revolutionize how developers approach debugging challenges.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <FaCode className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                    Multi-Language Support
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Supports Python, JavaScript, Java, C++, and many more programming languages with specialized debugging patterns.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <FaBug className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                    Error Pattern Recognition
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Advanced ML algorithms that learn from millions of code examples to identify and solve common programming issues.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
                  <FaRocket className="text-white text-lg" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
                    Lightning Fast Results
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    Get instant analysis and recommendations, reducing debugging time from hours to minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 flex items-center justify-center shadow-2xl">
                <div className="text-center space-y-4">
                  <div className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    95%
                  </div>
                  <p className="text-xl font-semibold text-neutral-700 dark:text-neutral-300">
                    Success Rate
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-xs">
                    Average problem resolution rate across all supported languages
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10 dark:from-indigo-900/20 dark:to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-100 mb-6">
            Ready to Debug Like a Pro?
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who have transformed their debugging workflow with CodeDebugger AI.
          </p>
          <Link
            to="/debug"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl hover:from-indigo-700 hover:to-purple-700 hover:shadow-3xl hover:scale-105 transition-all duration-300"
          >
            <FaPlay />
            Get Started Free
            <FaArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
