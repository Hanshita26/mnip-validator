// main page 
"use client" // no need of backend, everything runs on client side only

import { useState } from "react"
// shadcn/ui reusable components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { Shield, ShieldAlert, Calendar, User, TestTube } from "lucide-react"
import { MPINValidator, type Demographics, type ValidationResult } from "@/lib/mpin-validator"
import { TestRunner } from "@/components/test-runner"

export default function MPINValidatorApp() {
  const [mpin, setMpin] = useState("") // use of react hook33
  const [demographics, setDemographics] = useState<Demographics>({
    dob: "",
    spouseDob: "",
    anniversary: "",
  })
  const [result, setResult] = useState<ValidationResult | null>(null)
  const [pinLength, setPinLength] = useState<4 | 6>(4) // initial value set to 4

  const validator = new MPINValidator()

  const handleValidate = () => {
    if (mpin.length !== pinLength) {
      alert(`Please enter a ${pinLength}-digit PIN`)
      return
    }

    const validationResult = validator.validateMPIN(mpin, demographics)
    setResult(validationResult)
  }

  const handleDemographicChange = (field: keyof Demographics, value: string) => {
    setDemographics((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Shield className="h-8 w-8 text-blue-600" />
            MPIN Security Validator
          </h1>
          {/* <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced MPIN strength analysis using demographic data and pattern recognition
          </p> */}
        </div>

        <Tabs defaultValue="validator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="validator" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              MPIN Validator
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              Test Suite
            </TabsTrigger>
          </TabsList>

          <TabsContent value="validator" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Input Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    MPIN & Demographics
                  </CardTitle>
                  <CardDescription>Enter your MPIN and personal information for security analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* PIN Length Selection */}
                  <div className="space-y-2">
                    <Label>PIN Length</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={pinLength === 4 ? "default" : "outline"}
                        onClick={() => setPinLength(4)}
                        size="sm"
                      >
                        4-digit
                      </Button>
                      <Button
                        variant={pinLength === 6 ? "default" : "outline"}
                        onClick={() => setPinLength(6)}
                        size="sm"
                      >
                        6-digit
                      </Button>
                    </div>
                  </div>

                  {/* MPIN Input */}
                  <div className="space-y-2">
                    <Label htmlFor="mpin">MPIN</Label>
                    <Input
                      id="mpin"
                      type="password"
                      placeholder={`Enter ${pinLength}-digit MPIN`}
                      value={mpin}
                      onChange={(e) => setMpin(e.target.value.replace(/\D/g, "").slice(0, pinLength))}
                      maxLength={pinLength}
                    />
                  </div>

                  {/* Demographics */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="h-4 w-4" />
                      Demographics (Optional)
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={demographics.dob}
                        onChange={(e) => handleDemographicChange("dob", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="spouse-dob">Spouse Date of Birth</Label>
                      <Input
                        id="spouse-dob"
                        type="date"
                        value={demographics.spouseDob}
                        onChange={(e) => handleDemographicChange("spouseDob", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="anniversary" className="flex items-center gap-2">
                        {/* <Heart className="h-4 w-4" /> */}
                        Wedding Anniversary
                      </Label>
                      <Input
                        id="anniversary"
                        type="date"
                        value={demographics.anniversary}
                        onChange={(e) => handleDemographicChange("anniversary", e.target.value)}
                      />
                    </div>
                  </div>

                  <Button onClick={handleValidate} className="w-full" disabled={!mpin}>
                    Validate MPIN Security
                  </Button>
                </CardContent>
              </Card>

              {/* Results Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {result?.strength === "STRONG" ? (
                      <Shield className="h-5 w-5 text-green-600" />
                    ) : (
                      <ShieldAlert className="h-5 w-5 text-red-600" />
                    )}
                    Security Analysis
                  </CardTitle>
                  <CardDescription>Detailed analysis of your MPIN strength</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result ? (
                    <>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Strength:</span>
                        <Badge variant={result.strength === "STRONG" ? "default" : "destructive"} className="text-sm">
                          {result.strength}
                        </Badge>
                      </div>

                      
                      {result.weaknessReasons.length > 0 && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-red-600">Security Issues:</span>
                          <div className="space-y-1">
                            {result.weaknessReasons.map((reason, index) => (
                              <Alert key={index} variant="destructive">
                                <AlertDescription className="text-sm">{getReasonDescription(reason)}</AlertDescription>
                              </Alert>
                            ))}
                          </div>
                        </div>
                      )}

                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Security Score</span>
                          <span className="font-medium">{result.securityScore}/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              result.securityScore >= 70
                                ? "bg-green-500"
                                : result.securityScore >= 40
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                            }`}
                            style={{ width: `${result.securityScore}%` }}
                          />
                        </div>
                      </div>

                      
                      {result.strength === "WEAK" && (
                        <div className="space-y-2">
                          <span className="text-sm font-medium text-blue-600">Recommendations:</span>
                          <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                            {/*added certain points to show basic 4-digit pattern */}
                            <li>Avoid common patterns like 1234, 1111, or 0000</li>
                            <li>Dont use dates related to you or your family</li>
                            <li>Use a random combination of digits</li>
                            <li>Consider using a longer PIN for better security</li>
                          </ul>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <Shield className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Enter an MPIN to see security analysis</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="testing">
            <TestRunner />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function getReasonDescription(reason: string): string {
  const descriptions = {
    COMMONLY_USED: "This PIN is commonly used and easily guessable",
    DEMOGRAPHIC_DOB_SELF: "PIN contains patterns from your date of birth",
    DEMOGRAPHIC_DOB_SPOUSE: "PIN contains patterns from your spouse's date of birth",
    DEMOGRAPHIC_ANNIVERSARY: "PIN contains patterns from your wedding anniversary",
  }
  return descriptions[reason as keyof typeof descriptions] || reason
}
