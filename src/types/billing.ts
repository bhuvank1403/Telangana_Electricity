export type DISCOMType = 'TGSPDCL' | 'TGNPDCL';

export type TariffCategory = 'LT-I(A)' | 'LT-I(B)' | 'LT-I(C)';

export type ValueCertainty = 'VERIFIED' | 'CALCULATED' | 'ESTIMATED';

export interface BoundingBox {
  id: string;
  field: string;
  labelTe: string;
  labelEn: string;
  topPct: number;    // % from top of bill image
  leftPct: number;   // % from left of bill image
  widthPct: number;  // % width
  heightPct: number; // % height
  value: string | number;
  confidence: number; // 0 to 1
  certainty: ValueCertainty;
}

export interface BillData {
  id: string;
  discom: DISCOMType;
  discomFullNameTe: string;
  discomFullNameEn: string;
  circle: string;
  section: string;
  ero: string;
  uscno: string;          // Unique Service Connection Number
  meterNo: string;
  consumerName: string;
  address: string;
  category: TariffCategory;
  sanctionedLoadKw: number;
  
  // Dates
  billDate: string;
  dueDate: string;
  billingPeriodFrom: string;
  billingPeriodTo: string;
  billingDays: number;
  
  // Readings
  previousReading: number;
  currentReading: number;
  multiplyingFactor: number;
  unitsConsumed: number;
  readingStatus: 'NORMAL' | 'ESTIMATED' | 'FAULTY';
  
  // Charges breakdown
  energyCharges: number;
  energyChargesSlabs: {
    slabRange: string;
    unitsInSlab: number;
    ratePerUnit: number;
    amount: number;
  }[];
  customerCharges: number;
  electricityDuty: number;
  adjustments: number;
  arrears: number;
  gruhaJyothiSubsidy: number; // Negative or 0
  netAmountPayable: number;
  
  // Verification
  recalculatedTotal: number;
  matchStatus: 'MATCH' | 'MISMATCH' | 'NOT_VERIFIABLE';
  toleranceDifference: number;
  
  // OCR & Image metadata
  ocrConfidence: number;
  imageQualityScore: number;
  boundingBoxes: BoundingBox[];
  
  // Historical consumption if printed on bill
  priorConsumptionHistory?: {
    month: string;
    units: number;
  }[];
}

export interface VarianceDecomposition {
  earlierBill: BillData;
  currentBill: BillData;
  billingDaysEffect: number;
  dailyUsageEffect: number;
  tariffSlabEffect: number;
  otherVisibleItemsEffect: {
    customerChargesDelta: number;
    dutyDelta: number;
    adjustmentsDelta: number;
    arrearsDelta: number;
    subsidyDelta: number;
    totalOther: number;
  };
  unexplainedResidual: number;
  totalChange: number;
  orderDisclosed: string;
}

export interface ForecastRange {
  lowerUnits: number;
  centralUnits: number;
  upperUnits: number;
  lowerBillAmount: number;
  centralBillAmount: number;
  upperBillAmount: number;
  assumedDays: number;
  historyLengthCycles: number;
  method: string;
  uncertaintyMarginPct: number;
}

export interface GruhaJyothiStatus {
  isEligible: boolean;
  thresholdUnits: number; // 200
  currentUnits: number;
  unitsRemaining: number;
  benefitAmount: number;
  status: 'FULL_SUBSIDY_ZERO_BILL' | 'SUBSIDY_APPLIED' | 'THRESHOLD_EXCEEDED' | 'NOT_ENROLLED';
  governmentOrderRef: string;
  verificationDate: string;
  sourceDoc: string;
}
