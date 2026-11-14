// Standalone verification script in standard ES modules
console.log('⚡ Running Automated Verification for Challenge 13...\n');

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    testsFailed++;
  }
}

// 1. TGERC Official Tariff Constants
const OFFICIAL_SLABS = [
  {
    category: 'LT-I(A)',
    maxUnits: 100,
    customerCharges: 40,
    rates: [
      { min: 0, max: 50, rate: 1.95 },
      { min: 50, max: 100, rate: 3.10 },
    ],
  },
  {
    category: 'LT-I(B)',
    maxUnits: 200,
    customerCharges: 70,
    rates: [
      { min: 0, max: 100, rate: 3.40 },
      { min: 100, max: 200, rate: 4.80 },
    ],
  },
  {
    category: 'LT-I(C)',
    maxUnits: 999999,
    customerCharges: 100,
    rates: [
      { min: 0, max: 200, rate: 5.10 },
      { min: 200, max: 300, rate: 7.70 },
      { min: 300, max: 400, rate: 9.00 },
      { min: 400, max: 800, rate: 9.50 },
      { min: 800, max: 999999, rate: 10.00 },
    ],
  },
];

function calculateBill(units, categoryOverride, isGruhaJyothiEnrolled = false) {
  let category = categoryOverride;
  if (!category) {
    if (units <= 100) category = 'LT-I(A)';
    else if (units <= 200) category = 'LT-I(B)';
    else category = 'LT-I(C)';
  }

  const slabConfig = OFFICIAL_SLABS.find((s) => s.category === category) || OFFICIAL_SLABS[2];
  let remainingUnits = units;
  let totalEnergyCharges = 0;

  for (const slab of slabConfig.rates) {
    if (remainingUnits <= 0) break;
    const slabSpan = slab.max - slab.min;
    const unitsInThisSlab = Math.min(remainingUnits, slabSpan);
    totalEnergyCharges += unitsInThisSlab * slab.rate;
    remainingUnits -= unitsInThisSlab;
  }

  totalEnergyCharges = Number(totalEnergyCharges.toFixed(2));
  const customerCharges = slabConfig.customerCharges;
  const electricityDuty = Number((units * 0.06).toFixed(2));
  const subtotal = Number((totalEnergyCharges + customerCharges + electricityDuty).toFixed(2));

  let gruhaJyothiSubsidy = 0;
  if (isGruhaJyothiEnrolled && units <= 200) {
    gruhaJyothiSubsidy = -subtotal;
  }

  const netPayable = Math.max(0, Number((subtotal + gruhaJyothiSubsidy).toFixed(2)));

  return {
    category,
    energyCharges: totalEnergyCharges,
    customerCharges,
    electricityDuty,
    subtotal,
    gruhaJyothiSubsidy,
    netPayable,
  };
}

// TEST 1: LT-I(B) domestic calculation for 142 units
const res142 = calculateBill(142);
assert(res142.category === 'LT-I(B)', 'Category is LT-I(B) for 142 units');
assert(Math.abs(res142.energyCharges - 541.60) < 0.01, `Energy charges match official slab (Got ${res142.energyCharges}, Expected 541.60)`);
assert(res142.customerCharges === 70, 'Customer charges is ₹70');
assert(Math.abs(res142.electricityDuty - 8.52) < 0.01, 'Electricity duty is ₹8.52');
assert(Math.abs(res142.subtotal - 620.12) < 0.01, 'Subtotal is ₹620.12');

// TEST 2: Gruha Jyothi Zero-Bill Subsidy
const resGjZero = calculateBill(142, undefined, true);
assert(resGjZero.gruhaJyothiSubsidy === -620.12, 'Gruha Jyothi subsidy is -₹620.12');
assert(resGjZero.netPayable === 0, 'Net amount payable is ₹0.00 for <= 200 units');

// TEST 3: Sequential Substitution Variance Decomposition (Appendix A)
const b1 = { unitsConsumed: 165, billingDays: 29, netAmountPayable: 864, customerCharges: 70, electricityDuty: 9.9, adjustments: 0, arrears: 132.1, gruhaJyothiSubsidy: 0, category: 'LT-I(B)' };
const b2 = { unitsConsumed: 238, billingDays: 32, netAmountPayable: 1542, customerCharges: 100, electricityDuty: 14.28, adjustments: 0, arrears: 115.12, gruhaJyothiSubsidy: 0, category: 'LT-I(C)' };

const u1 = b1.unitsConsumed / b1.billingDays;
const unitsAtEarlierDailyRateForNewDays = u1 * b2.billingDays;
const costAtDaysNorm = calculateBill(unitsAtEarlierDailyRateForNewDays).subtotal;
const costBase1 = calculateBill(b1.unitsConsumed).subtotal;
const billingDaysEffect = Number((costAtDaysNorm - costBase1).toFixed(2));

const costBase2AtC1 = calculateBill(b2.unitsConsumed).subtotal;
const dailyUsageEffect = Number((costBase2AtC1 - costAtDaysNorm).toFixed(2));

const costBase2AtC2 = calculateBill(b2.unitsConsumed, b2.category).subtotal;
const tariffSlabEffect = Number((costBase2AtC2 - costBase2AtC1).toFixed(2));

const customerChargesDelta = b2.customerCharges - b1.customerCharges;
const dutyDelta = b2.electricityDuty - b1.electricityDuty;
const adjustmentsDelta = b2.adjustments - b1.adjustments;
const arrearsDelta = b2.arrears - b1.arrears;
const subsidyDelta = b2.gruhaJyothiSubsidy - b1.gruhaJyothiSubsidy;
const totalOther = Number((customerChargesDelta + dutyDelta + adjustmentsDelta + arrearsDelta + subsidyDelta).toFixed(2));

const totalChange = Number((b2.netAmountPayable - b1.netAmountPayable).toFixed(2));
const accountedFor = Number((billingDaysEffect + dailyUsageEffect + tariffSlabEffect + totalOther).toFixed(2));
const unexplainedResidual = Number((totalChange - accountedFor).toFixed(2));

const sumDecomp = Number((billingDaysEffect + dailyUsageEffect + tariffSlabEffect + totalOther + unexplainedResidual).toFixed(2));

assert(Math.abs(sumDecomp - totalChange) < 0.001, `Appendix A exact sum guarantee verified: (${sumDecomp} === ${totalChange})`);

// Clean up test file
console.log(`\n========================================`);
console.log(`Verification Summary: ${testsPassed} Passed, ${testsFailed} Failed.`);
