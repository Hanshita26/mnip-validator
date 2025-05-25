// "use client"

// import { useState } from "react"
// // shadcn/ui reusable componenets for design
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import type { Demographics } from "@/lib/mpin-validator"

// import { CheckCircle, XCircle, Play, RotateCcw } from "lucide-react"
// import { MPINValidator, type ValidationResult } from "@/lib/mpin-validator"

// interface TestCase {
//   id: number
//   mpin: string
//   demographics: Demographics
//   expected: Partial<ValidationResult>
//   actual?: ValidationResult
//   passed?: boolean
// }

// export function TestRunner() {
//   const [testResults, setTestResults] = useState<TestCase[]>([])
//   const [isRunning, setIsRunning] = useState(false)
//   const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0 })

//   const validator = new MPINValidator()

//   const runTests = async () => {
//     setIsRunning(true)
//     const testCases = validator.generateTestCases()
//     const results: TestCase[] = []

//     for (let i = 0; i < testCases.length; i++) {
//       const testCase = testCases[i]
//       const actual = validator.validateMPIN(testCase.mpin, testCase.demographics)

//       const passed =
//         actual.strength === testCase.expected.strength &&
//         JSON.stringify(actual.weaknessReasons.sort()) ===
//           JSON.stringify(testCase.expected.weaknessReasons?.sort() || [])

//       results.push({
//         id: i + 1,
//         mpin: testCase.mpin,
//         demographics: testCase.demographics,
//         expected: testCase.expected,
//         actual,
//         passed,
//       })

//       await new Promise((resolve) => setTimeout(resolve, 100))
//       setTestResults([...results])
//     }

//     const passed = results.filter((r) => r.passed).length
//     const failed = results.length - passed
//     setSummary({ total: results.length, passed, failed })
//     setIsRunning(false)
//   }

//   const resetTests = () => {
//     setTestResults([])
//     setSummary({ total: 0, passed: 0, failed: 0 })
//   }

//   return (
//     <div className="space-y-6">
//       {/* Test Controls */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Play className="h-5 w-5" />
//             Test Suite Runner
//           </CardTitle>
//           <CardDescription>Comprehensive testing of MPIN validation logic with 20+ test cases</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="flex gap-2">
//             <Button onClick={runTests} disabled={isRunning}>
//               {isRunning ? "Running Tests..." : "Run All Tests"}
//             </Button>
//             <Button variant="outline" onClick={resetTests} disabled={isRunning}>
//               <RotateCcw className="h-4 w-4 mr-2" />
//               Reset
//             </Button>
//           </div>

          
//           {summary.total > 0 && (
//             <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
//               <div className="text-center">
//                 <div className="text-2xl font-bold">{summary.total}</div>
//                 <div className="text-sm text-gray-600">Total Tests</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-green-600">{summary.passed}</div>
//                 <div className="text-sm text-gray-600">Passed</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
//                 <div className="text-sm text-gray-600">Failed</div>
//               </div>
//               <div className="text-center">
//                 <div className="text-2xl font-bold text-blue-600">
//                   {summary.total > 0 ? Math.round((summary.passed / summary.total) * 100) : 0}%
//                 </div>
//                 <div className="text-sm text-gray-600">Success Rate</div>
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

      
//       {testResults.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Test Results</CardTitle>
//             <CardDescription>Detailed results for each test case</CardDescription>
//           </CardHeader>
//           <CardContent>
//             <ScrollArea className="h-96">
//               <div className="space-y-2">
//                 {testResults.map((test) => (
//                   <div
//                     key={test.id}
//                     className={`p-3 rounded-lg border ${
//                       test.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between mb-2">
//                       <div className="flex items-center gap-2">
//                         {test.passed ? (
//                           <CheckCircle className="h-4 w-4 text-green-600" />
//                         ) : (
//                           <XCircle className="h-4 w-4 text-red-600" />
//                         )}
//                         <span className="font-medium">Test #{test.id}</span>
//                         <Badge variant="outline" className="font-mono">
//                           {test.mpin}
//                         </Badge>
//                       </div>
//                       <Badge variant={test.passed ? "default" : "destructive"}>{test.passed ? "PASS" : "FAIL"}</Badge>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4 text-sm">
//                       <div>
//                         <div className="font-medium text-gray-700">Expected:</div>
//                         <div>Strength: {test.expected.strength}</div>
//                         <div>Reasons: {test.expected.weaknessReasons?.join(", ") || "None"}</div>
//                       </div>
//                       <div>
//                         <div className="font-medium text-gray-700">Actual:</div>
//                         <div>Strength: {test.actual?.strength}</div>
//                         <div>Reasons: {test.actual?.weaknessReasons.join(", ") || "None"}</div>
//                       </div>
//                     </div>

//                     {Object.keys(test.demographics).some((key) => test.demographics[key]) && (
//                       <div className="mt-2 text-xs text-gray-600">
//                         Demographics: {JSON.stringify(test.demographics)}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </ScrollArea>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useMemo } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Demographics } from "@/lib/mpin-validator"

import {
  CheckCircle,
  XCircle,
  Play,
  RotateCcw,
} from "lucide-react"
import {
  MPINValidator,
  type ValidationResult,
} from "@/lib/mpin-validator"

interface TestCase {
  id: number
  mpin: string
  demographics: Demographics
  expected: Partial<ValidationResult>
  actual?: ValidationResult
  passed?: boolean
}

export function TestRunner() {
  const [testResults, setTestResults] = useState<TestCase[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [summary, setSummary] = useState({
    total: 0,
    passed: 0,
    failed: 0,
  })

  // Instantiate once
  const validator = useMemo(() => new MPINValidator(), [])

  const runTests = async () => {
    setIsRunning(true)
    setTestResults([])
    setSummary({ total: 0, passed: 0, failed: 0 })

    try {
      const testCases = validator.generateTestCases()
      const results: TestCase[] = testCases.map((t, idx) => {
        const actual = validator.validateMPIN(t.mpin, t.demographics)

        const expReasons = [...(t.expected.weaknessReasons ?? [])].sort()
        const actReasons = [...actual.weaknessReasons].sort()

        const passed =
          actual.strength === t.expected.strength &&
          JSON.stringify(actReasons) === JSON.stringify(expReasons)

        return {
          id: idx + 1,
          mpin: t.mpin,
          demographics: t.demographics,
          expected: t.expected,
          actual,
          passed,
        }
      })

      setTestResults(results)
      const passedCount = results.filter((r) => r.passed).length
      setSummary({
        total: results.length,
        passed: passedCount,
        failed: results.length - passedCount,
      })
    } catch (err) {
      // Surface the error for debugging but don’t fail the UI
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setIsRunning(false)
    }
  }

  const resetTests = () => {
    setTestResults([])
    setSummary({ total: 0, passed: 0, failed: 0 })
  }

  /* ---------- helpers ---------- */
  const hasDemographicData = (d: Demographics) =>
    Object.values(d).some(Boolean)

  /* ---------- UI ---------- */
  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Play className="h-5 w-5" />
            Test Suite Runner
          </CardTitle>
          <CardDescription>
            Comprehensive testing of MPIN validation logic with
            20&nbsp;+ automatic test cases
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runTests} disabled={isRunning}>
              {isRunning ? "Running …" : "Run All Tests"}
            </Button>
            <Button
              variant="outline"
              onClick={resetTests}
              disabled={isRunning}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>

          {summary.total > 0 && (
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              {[
                ["Total Tests", summary.total],
                ["Passed", summary.passed],
                ["Failed", summary.failed],
                [
                  "Success Rate",
                  `${((summary.passed / summary.total) * 100).toFixed(
                    1,
                  )}%`,
                ],
              ].map(([label, value]) => (
                <div className="text-center" key={label}>
                  <div
                    className={`text-2xl font-bold ${
                      label === "Passed"
                        ? "text-green-600"
                        : label === "Failed"
                        ? "text-red-600"
                        : label === "Success Rate"
                        ? "text-blue-600"
                        : ""
                    }`}
                  >
                    {value}
                  </div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              Detailed results for each test case
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-96">
              <div className="space-y-2">
                {testResults.map((t) => (
                  <div
                    key={t.id}
                    className={`p-3 rounded-lg border ${
                      t.passed
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {t.passed ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        <span className="font-medium">
                          Test #{t.id}
                        </span>
                        <Badge variant="outline" className="font-mono">
                          {t.mpin}
                        </Badge>
                      </div>
                      <Badge
                        variant={t.passed ? "default" : "destructive"}
                      >
                        {t.passed ? "PASS" : "FAIL"}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium text-gray-700">
                          Expected
                        </div>
                        <div>Strength: {t.expected.strength}</div>
                        <div>
                          Reasons:&nbsp;
                          {t.expected.weaknessReasons?.join(", ") ||
                            "None"}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-gray-700">
                          Actual
                        </div>
                        <div>Strength: {t.actual?.strength}</div>
                        <div>
                          Reasons:&nbsp;
                          {t.actual?.weaknessReasons.join(", ") ||
                            "None"}
                        </div>
                      </div>
                    </div>

                    {hasDemographicData(t.demographics) && (
                      <div className="mt-2 text-xs text-gray-600">
                        Demographics:{" "}
                        {JSON.stringify(t.demographics)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
