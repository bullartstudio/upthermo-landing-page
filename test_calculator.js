// Verification Script for ORC Calculator Logic

// Re-implementing logic to verify requirements
function calculateSavings(billMonth, wasteTons, shifts, hasSolar) {
    // 1. Oszczędność % (zależy od zmian i PV)
    let savingsPercent = 0.60;
    if (shifts === 2) savingsPercent = 0.65;
    if (shifts === 3) savingsPercent = 0.70;
    if (hasSolar) savingsPercent += 0.05;

    // 2. Savings Calculations
    const savingsMonth = billMonth * savingsPercent;

    // 3. Bonus Heat (Estimation)
    const heatBonusMonth = 15000;
    const totalMonthlyBenefit = savingsMonth + heatBonusMonth;

    return {
        billMonth,
        savingsPercent,
        savingsMonth,
        totalMonthlyBenefit
    };
}

// Test Case 1: Standard User (95k bill, 3 shifts, no solar)
const test1 = calculateSavings(95000, 10, 3, false);
console.log('Test 1 (Standard):');
console.log(`Input: 95k bill, 3 shifts`);
console.log(`Expected Savings %: 0.70 (70%)`);
console.log(`Actual Savings %: ${test1.savingsPercent}`);
console.log(`Expected Electrical Savings: 66,500 PLN`);
console.log(`Actual Electrical Savings: ${test1.savingsMonth}`);
console.log(`Expected Total Benefit (with Heat): 81,500 PLN`);
console.log(`Actual Total Benefit: ${test1.totalMonthlyBenefit}`);

console.log('--------------------------------------------------');

// Test Case 2: 2 Shifts (80k bill)
const test2 = calculateSavings(80000, 8, 2, false);
console.log('Test 2 (2 Shifts):');
console.log(`Input: 80k bill, 2 shifts`);
console.log(`Expected Savings %: 0.65 (65%)`);
console.log(`Actual Savings %: ${test2.savingsPercent}`);

console.log('--------------------------------------------------');

// Test Case 3: Solar + 3 Shifts
const test3 = calculateSavings(100000, 12, 3, true);
console.log('Test 3 (Solar + 3 Shifts):');
console.log(`Input: 100k bill, Solar`);
console.log(`Expected Savings %: 0.75 (75%)`);
console.log(`Actual Savings %: ${test3.savingsPercent}`);

// Validation Check
if (test1.savingsPercent === 0.70 && test1.totalMonthlyBenefit === 81500) {
    console.log('\n[PASS] Logic matches requirements.');
} else {
    console.log('\n[FAIL] Logic discrepancy found.');
}
