export interface Demographics {
    // initially optional 
  dob?: string 
  spouseDob?: string
  anniversary?: string
}

export interface ValidationResult {
  strength: "WEAK" | "STRONG"
  weaknessReasons: string[]
  securityScore: number
  detectedPatterns: string[]
}


{/*random 4 and 6 digit common pins */}
export class MPINValidator {
  private commonPins4Digit = new Set([
    
    "1234",
    "2345",
    "1111",
    "0000",
    "1212",
    "7777",
    "1004",
    "2000",
    "4444",
    "2222",
    "6969",
    "9999",
    "3333",
    "5555",
    "6666",
    "8888",
    "4321",
    "2580",
    "1122",
    "1313",
    "8520",
    "2001",
    "1010",
    "1001",
    "0123",
    "9876",
    "1357",
    "2468",
    "1478",
    "1593",
    "2846",
  ])

  
  private commonPins6Digit = new Set([
    "123456",
    "111111",
    "000000",
    "121212",
    "777777",
    "100400",
    "200000",
    "444444",
    "222222",
    "696969",
    "999999",
    "333333",
    "555555",
    "666666",
    "888888",
    "432100",
    "258000",
    "112200",
    "131300",
    "852000",
    "200100",
    "101000",
    "100100",
    "012345",
    "135790",
    "246810",
    "147852",
    "159357",
    "284691",
    "123123",
    "456456",
    "789789",
    "147147",
    "258258",
    "369369",
    "654321",
    "987654",
    "112233",
    "445566",
  ])

  validateMPIN(mpin: string, demographics: Demographics = {}): ValidationResult {
    const weaknessReasons: string[] = []
    let securityScore = 100 
    const detectedPatterns: string[] = []


    if (this.isCommonlyUsed(mpin)) {
      weaknessReasons.push("COMMONLY_USED")
      securityScore -= 40
      detectedPatterns.push("Common PIN")
    }


    const patterns = this.detectPatterns(mpin)
    if (patterns.length > 0) {
      securityScore -= patterns.length * 15
      detectedPatterns.push(...patterns)
    }

    const demographicIssues = this.checkDemographics(mpin, demographics)
    weaknessReasons.push(...demographicIssues)
    securityScore -= demographicIssues.length * 25

    
    securityScore = Math.max(0, securityScore)

    // classification of strong or weak
    const strength = weaknessReasons.length === 0 && securityScore >= 60 ? "STRONG" : "WEAK"

    return {
      strength,
      weaknessReasons,
      securityScore,
      detectedPatterns,
    }
  }

  private isCommonlyUsed(mpin: string): boolean {
    if (mpin.length === 4) {
      return this.commonPins4Digit.has(mpin)
    } else if (mpin.length === 6) {
      return this.commonPins6Digit.has(mpin)
    }
    return false
  }

  // pattern recognition - repeated patterns , keyboard patters, any sequence(odd or even number)
  private detectPatterns(mpin: string): string[] {
    const patterns: string[] = []


    if (this.hasRepeatedDigits(mpin)) { 
      patterns.push("Repeated digits")
    }

    if (this.hasSequentialPattern(mpin)) {
      patterns.push("Sequential pattern")
    }

    if (this.hasKeyboardPattern(mpin)) {
      patterns.push("Keyboard pattern")
    }

    return patterns
  }

  private hasRepeatedDigits(mpin: string): boolean { // logic 
    
    if (new Set(mpin).size === 1) return true

    
    if (mpin.length === 4) {
      return mpin[0] === mpin[1] && mpin[2] === mpin[3] // digits at all index are same
    } else if (mpin.length === 6) {
     
      return (
        (mpin[0] === mpin[1] && mpin[2] === mpin[3] && mpin[4] === mpin[5]) || // 112233
        mpin.slice(0, 3) === mpin.slice(3, 6) 
      )
    }

    return false
  }

  private hasSequentialPattern(mpin: string): boolean { // logic 
    const digits = mpin.split("").map(Number)

    
    let isAscending = true
    let isDescending = true

    for (let i = 1; i < digits.length; i++) {
      if (digits[i] !== digits[i - 1] + 1) isAscending = false 
      if (digits[i] !== digits[i - 1] - 1) isDescending = false
    }

    return isAscending || isDescending
  }

  private hasKeyboardPattern(mpin: string): boolean {
    const keyboardPatterns = [
        // common patterns
      "2580",
      "1470",
      "3690",
      "1590",
      "7410",
      "9630", 
      "147258",
      "159357",
      "258147",
      "357159", 
    ]

    return keyboardPatterns.includes(mpin)
  }

  private checkDemographics(mpin: string, demographics: Demographics): string[] {
    const issues: string[] = []

    if (demographics.dob && this.matchesDemographic(mpin, demographics.dob)) {
      issues.push("DEMOGRAPHIC_DOB_SELF")
    }

    if (demographics.spouseDob && this.matchesDemographic(mpin, demographics.spouseDob)) {
      issues.push("DEMOGRAPHIC_DOB_SPOUSE")
    }

    if (demographics.anniversary && this.matchesDemographic(mpin, demographics.anniversary)) {
      issues.push("DEMOGRAPHIC_ANNIVERSARY")
    }

    return issues
  }

  // data conversion
  private matchesDemographic(mpin: string, date: string): boolean {
    if (!date) return false

    const [year, month, day] = date.split("-")
    const dateVariations = [
      day + month,
      month + day, 
      year.slice(-2) + month, 
      year.slice(-2) + day, 
      month + year.slice(-2), 
      day + year.slice(-2), 
      day + month + year.slice(-2), 
      month + day + year.slice(-2),
      year.slice(-2) + month + day, 
      year.slice(-2) + day + month, 
    ]

    return dateVariations.some((variation) => {
      if (mpin.length === 4) {
        return variation.slice(0, 4) === mpin || variation.slice(-4) === mpin
      } else if (mpin.length === 6) {
        return variation === mpin || variation.slice(0, 6) === mpin
      }
      return false
    })
  }

  // Method to generate test cases
  generateTestCases(): Array<{ mpin: string; demographics: Demographics; expected: Partial<ValidationResult> }> {
    return [
      // basic common pins used
      { mpin: "1234", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "0000", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "1111", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "7392", demographics: {}, expected: { strength: "STRONG", weaknessReasons: [] } },

      // based on demographics
      {
        mpin: "0215",
        demographics: { dob: "1990-02-15", spouseDob: "", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_DOB_SELF"] },
      },
      {
        mpin: "1502",
        demographics: { dob: "1990-02-15", spouseDob: "", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_DOB_SELF"] },
      },
      {
        mpin: "9002",
        demographics: { dob: "1990-02-15", spouseDob: "", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_DOB_SELF"] },
      },

      // Spouse demographics
      {
        mpin: "0312",
        demographics: { dob: "", spouseDob: "1985-03-12", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_DOB_SPOUSE"] },
      },

      // Anniversary
      {
        mpin: "0614",
        demographics: { dob: "", spouseDob: "", anniversary: "2010-06-14" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_ANNIVERSARY"] },
      },

      
      {
        mpin: "1234",
        demographics: { dob: "1990-12-31", spouseDob: "", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] },
      },

      // 6-digits
      { mpin: "123456", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "000000", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      {
        mpin: "021590",
        demographics: { dob: "1990-02-15", spouseDob: "", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_DOB_SELF"] },
      },
      {
        mpin: "150290",
        demographics: { dob: "1990-02-15", spouseDob: "", anniversary: "" },
        expected: { strength: "WEAK", weaknessReasons: ["DEMOGRAPHIC_DOB_SELF"] },
      },

      
      {
        mpin: "7392",
        demographics: { dob: "1990-02-15", spouseDob: "1985-03-12", anniversary: "2010-06-14" },
        expected: { strength: "STRONG", weaknessReasons: [] },
      },
      { mpin: "8471", demographics: {}, expected: { strength: "STRONG", weaknessReasons: [] } },
      {
        mpin: "739284",
        demographics: { dob: "1990-02-15", spouseDob: "1985-03-12", anniversary: "2010-06-14" },
        expected: { strength: "STRONG", weaknessReasons: [] },
      },
      { mpin: "847193", demographics: {}, expected: { strength: "STRONG", weaknessReasons: [] } },

      // basic Edge cases like repeatition, sequence - ascending or descending
      { mpin: "1122", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "2468", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "9876", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
      { mpin: "112233", demographics: {}, expected: { strength: "WEAK", weaknessReasons: ["COMMONLY_USED"] } },
    ]
  }
}
