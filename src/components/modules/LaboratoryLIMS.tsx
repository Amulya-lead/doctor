import React, { useState } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  Clock,
  Play,
  Search,
  FileCheck,
  Plus,
  Send,
  Printer,
  Download,
  Sparkles,
  AlertTriangle,
  FileText,
  Check,
  X,
  QrCode,
  Tag,
  ShieldCheck,
  ChevronRight,
  User,
  Activity
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';
import { LabTestOrder, LabTestStatus } from '../../types';

// Tube color helper according to international vacutainer standards
const getTubeColor = (sampleType: string) => {
  const lower = sampleType.toLowerCase();
  if (lower.includes('edta') || lower.includes('lavender') || lower.includes('whole blood')) {
    return { name: 'Lavender (EDTA)', bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300', dot: 'bg-purple-600' };
  }
  if (lower.includes('serum') || lower.includes('gold') || lower.includes('red') || lower.includes('sst')) {
    return { name: 'Gold / Red (SST)', bg: 'bg-hospital-100', text: 'text-hospital-900', border: 'border-hospital-300', dot: 'bg-hospital-600' };
  }
  if (lower.includes('grey') || lower.includes('fluoride') || lower.includes('glucose')) {
    return { name: 'Grey (Fluoride)', bg: 'bg-hospital-300', text: 'text-hospital-900', border: 'border-hospital-300', dot: 'bg-hospital-800' };
  }
  if (lower.includes('citrate') || lower.includes('blue') || lower.includes('coagulation')) {
    return { name: 'Light Blue (Citrate)', bg: 'bg-sky-100', text: 'text-sky-800', border: 'border-sky-300', dot: 'bg-sky-600' };
  }
  if (lower.includes('urine')) {
    return { name: 'Yellow (Sterile Cup)', bg: 'bg-hospital-100', text: 'text-hospital-800', border: 'border-hospital-300', dot: 'bg-hospital-500' };
  }
  return { name: 'Clear Vial', bg: 'bg-hospital-50', text: 'text-hospital-900', border: 'border-hospital-300', dot: 'bg-hospital-700' };
};

// Preset catalog packages for direct ordering
const LAB_CATALOG = [
  {
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology' as const,
    sampleType: 'Whole Blood (EDTA - Lavender)',
    cost: 450,
    parameters: [
      { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', normalRange: '13.0 - 17.0', isAbnormal: false },
      { name: 'RBC Count', value: '4.8', unit: 'million/mcL', normalRange: '4.5 - 5.5', isAbnormal: false },
      { name: 'Total WBC Count', value: '7,400', unit: '/mcL', normalRange: '4,000 - 11,000', isAbnormal: false },
      { name: 'Platelet Count', value: '240,000', unit: '/mcL', normalRange: '150,000 - 450,000', isAbnormal: false },
      { name: 'Hematocrit (PCV)', value: '42.5', unit: '%', normalRange: '40.0 - 50.0', isAbnormal: false }
    ]
  },
  {
    name: 'Comprehensive Lipid Profile',
    category: 'Biochemistry' as const,
    sampleType: 'Serum (Gold / SST)',
    cost: 850,
    parameters: [
      { name: 'Total Cholesterol', value: '185', unit: 'mg/dL', normalRange: '< 200', isAbnormal: false },
      { name: 'Triglycerides', value: '142', unit: 'mg/dL', normalRange: '< 150', isAbnormal: false },
      { name: 'HDL (Good Cholesterol)', value: '54', unit: 'mg/dL', normalRange: '> 45', isAbnormal: false },
      { name: 'LDL (Bad Cholesterol)', value: '102', unit: 'mg/dL', normalRange: '< 100', isAbnormal: true },
      { name: 'VLDL', value: '28.4', unit: 'mg/dL', normalRange: '5.0 - 30.0', isAbnormal: false }
    ]
  },
  {
    name: 'Kidney Function Test (KFT / RFT)',
    category: 'Biochemistry' as const,
    sampleType: 'Serum (Gold / SST)',
    cost: 650,
    parameters: [
      { name: 'Serum Creatinine', value: '1.02', unit: 'mg/dL', normalRange: '0.7 - 1.3', isAbnormal: false },
      { name: 'Blood Urea Nitrogen (BUN)', value: '16.5', unit: 'mg/dL', normalRange: '7.0 - 20.0', isAbnormal: false },
      { name: 'Uric Acid', value: '5.8', unit: 'mg/dL', normalRange: '3.5 - 7.2', isAbnormal: false },
      { name: 'eGFR', value: '94', unit: 'mL/min/1.73m²', normalRange: '> 90', isAbnormal: false }
    ]
  },
  {
    name: 'Liver Function Test (LFT)',
    category: 'Biochemistry' as const,
    sampleType: 'Serum (Gold / SST)',
    cost: 750,
    parameters: [
      { name: 'Bilirubin Total', value: '0.9', unit: 'mg/dL', normalRange: '0.2 - 1.2', isAbnormal: false },
      { name: 'SGOT (AST)', value: '28', unit: 'U/L', normalRange: '10 - 40', isAbnormal: false },
      { name: 'SGPT (ALT)', value: '34', unit: 'U/L', normalRange: '10 - 45', isAbnormal: false },
      { name: 'Alkaline Phosphatase (ALP)', value: '88', unit: 'U/L', normalRange: '44 - 147', isAbnormal: false },
      { name: 'Total Protein', value: '7.2', unit: 'g/dL', normalRange: '6.4 - 8.3', isAbnormal: false }
    ]
  },
  {
    name: 'HbA1c & Fasting Glucose Panel',
    category: 'Biochemistry' as const,
    sampleType: 'Fluoride Plasma (Grey)',
    cost: 550,
    parameters: [
      { name: 'Fasting Plasma Glucose', value: '98', unit: 'mg/dL', normalRange: '70 - 100', isAbnormal: false },
      { name: 'Glycated Hemoglobin (HbA1c)', value: '5.6', unit: '%', normalRange: '< 5.7', isAbnormal: false },
      { name: 'Estimated Average Glucose (eAG)', value: '114', unit: 'mg/dL', normalRange: '< 117', isAbnormal: false }
    ]
  },
  {
    name: 'Thyroid Function Profile (T3, T4, TSH)',
    category: 'Biochemistry' as const,
    sampleType: 'Serum (Gold / SST)',
    cost: 600,
    parameters: [
      { name: 'Total Triiodothyronine (T3)', value: '1.2', unit: 'ng/mL', normalRange: '0.8 - 2.0', isAbnormal: false },
      { name: 'Total Thyroxine (T4)', value: '8.4', unit: 'µg/dL', normalRange: '5.1 - 14.1', isAbnormal: false },
      { name: 'Thyroid Stimulating Hormone (TSH)', value: '2.45', unit: 'µIU/mL', normalRange: '0.4 - 4.2', isAbnormal: false }
    ]
  },
  {
    name: 'Digital Chest X-Ray (PA View)',
    category: 'Radiology' as const,
    sampleType: 'Digital Radiograph',
    cost: 500,
    parameters: [
      { name: 'Lung Fields', value: 'Clear, no focal consolidation or pneumothorax', unit: 'Impression', normalRange: 'Clear', isAbnormal: false },
      { name: 'Cardiothoracic Ratio', value: 'Normal (< 0.5)', unit: 'Ratio', normalRange: '< 0.50', isAbnormal: false },
      { name: 'Costophrenic Angles', value: 'Sharp & clear bilaterally', unit: 'Visual', normalRange: 'Sharp', isAbnormal: false }
    ]
  }
];

export const LaboratoryLIMS: React.FC = () => {
  const {
    labTests,
    updateLabStatus,
    addLabTest,
    updateLabTestParameters,
    seedSampleLabTests,
    patients,
    currentTenant
  } = useHospitalOS();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedTest, setSelectedTest] = useState<LabTestOrder | null>(labTests[0] || null);
  const [search, setSearch] = useState('');

  // Modals
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
  const [isEditingParameters, setIsEditingParameters] = useState(false);

  // New Order Form
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [walkinPatientName, setWalkinPatientName] = useState('');
  const [walkinPatientAge, setWalkinPatientAge] = useState('32');
  const [walkinPatientGender, setWalkinPatientGender] = useState('Male');
  const [selectedCatalogIndex, setSelectedCatalogIndex] = useState(0);
  const [referringDoctor, setReferringDoctor] = useState('Dr. Priya Iyer, MD');

  // Filtered Test List
  const filteredTests = labTests.filter(t => {
    const matchesCat = selectedCategory === 'ALL' || t.category === selectedCategory;
    const matchesSearch =
      t.testName.toLowerCase().includes(search.toLowerCase()) ||
      t.patientName.toLowerCase().includes(search.toLowerCase()) ||
      t.barcode.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeTest = selectedTest || (filteredTests.length > 0 ? filteredTests[0] : null);

  const getStatusBadge = (status: LabTestStatus) => {
    switch (status) {
      case 'Ordered':
        return 'bg-hospital-100 text-hospital-800 border-hospital-200';
      case 'Sample Collected':
        return 'bg-hospital-100 text-[#39786B] border-hospital-200';
      case 'Analyzing':
        return 'bg-hospital-100 text-hospital-800 border-hospital-200 animate-pulse';
      case 'Approved':
        return 'bg-hospital-100 text-hospital-800 border-hospital-200';
      case 'Delivered':
        return 'bg-hospital-100 text-hospital-800 border-hospital-200';
      default:
        return 'bg-hospital-50 text-hospital-900 border-hospital-300';
    }
  };

  const handleAdvanceStatus = (test: LabTestOrder) => {
    let nextStatus: LabTestStatus = 'Sample Collected';
    if (test.status === 'Ordered') nextStatus = 'Sample Collected';
    else if (test.status === 'Sample Collected') nextStatus = 'Analyzing';
    else if (test.status === 'Analyzing') nextStatus = 'Approved';
    else if (test.status === 'Approved') nextStatus = 'Delivered';

    updateLabStatus(test.id, nextStatus);
    setSelectedTest({ ...test, status: nextStatus });
  };

  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pkg = LAB_CATALOG[selectedCatalogIndex];
    let ptName = walkinPatientName.trim();
    let ptAge = Number(walkinPatientAge) || 30;
    let ptGender = walkinPatientGender;

    if (selectedPatientId) {
      const found = patients.find(p => p.id === selectedPatientId);
      if (found) {
        ptName = found.name;
        ptAge = found.age;
        ptGender = found.gender;
      }
    }

    if (!ptName) {
      ptName = 'Walk-In Patient';
    }

    addLabTest({
      patientId: selectedPatientId || `PT-${Date.now().toString().slice(-4)}`,
      patientName: ptName,
      patientAge: ptAge,
      patientGender: ptGender,
      testName: pkg.name,
      category: pkg.category,
      sampleType: pkg.sampleType,
      cost: pkg.cost,
      orderedByDoctor: referringDoctor,
      parameters: pkg.parameters
    });

    setIsNewOrderModalOpen(false);
    setWalkinPatientName('');
  };

  const handleParameterValueChange = (index: number, newValue: string) => {
    if (!activeTest) return;
    const updated = activeTest.parameters.map((p, idx) => {
      if (idx === index) {
        // Quick abnormal heuristic if numeric
        const numVal = parseFloat(newValue);
        let isAbnormal = p.isAbnormal;
        if (!isNaN(numVal) && p.normalRange.includes('-')) {
          const [min, max] = p.normalRange.split('-').map(s => parseFloat(s.trim()));
          if (!isNaN(min) && !isNaN(max)) {
            isAbnormal = numVal < min || numVal > max;
          }
        }
        return { ...p, value: newValue, isAbnormal };
      }
      return p;
    });

    updateLabTestParameters(activeTest.id, updated);
    setSelectedTest({ ...activeTest, parameters: updated });
  };

  return (
    <div className="space-y-6">
      {/* Architectural Workspace Banner */}
      <div className="workspace-banner workspace-banner-lab p-6 sm:p-7 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-hospital-300/35 text-[11px] font-bold uppercase tracking-wider text-hospital-200">
            <span>Pathology &amp; Diagnostics &bull; {labTests.length} Active Orders</span>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-white flex items-center gap-2.5 tracking-tight">
            <FlaskConical className="w-6 h-6 text-hospital-300" />
            <span>Laboratory LIMS &amp; Specimen Tracking</span>
          </h2>
          <p className="text-xs sm:text-sm text-hospital-50 max-w-2xl">
            Specimen collection barcodes, automated analyzer results, and certified pathologist approvals.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {labTests.length === 0 && (
            <button
              onClick={seedSampleLabTests}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/25 text-xs font-bold transition active:scale-[0.98]"
              title="Populate realistic demo orders across Hematology and Biochemistry"
            >
              <Sparkles className="w-3.5 h-3.5 text-hospital-300" />
              <span>Seed Demo Orders</span>
            </button>
          )}

          <button
            onClick={() => setIsNewOrderModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-hospital-50 text-[#10221F] text-xs font-bold shadow-lg transition active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5 text-[#39786B]" />
            <span>Walk-In Test Order</span>
          </button>

          <span className="px-3 py-2 rounded-xl bg-white/15 backdrop-blur-md text-white border border-white/25 text-xs font-bold font-mono">
            Active Tests: {labTests.length}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {['ALL', 'Hematology', 'Biochemistry', 'Radiology', 'Microbiology'].map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${selectedCategory === cat
                ? 'btn-zoho-primary text-white shadow-xs'
                : 'bg-white border border-hospital-300 text-hospital-800 hover:bg-hospital-50'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 5 cols: Test Queue */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-hospital-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search test name, barcode, patient..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-hospital-300 rounded-xl pl-10 pr-9 py-2.5 text-xs font-medium text-hospital-950 placeholder-hospital-500 focus:outline-none focus:border-[#39786B] focus:ring-4 focus:ring-[#39786B]/10 shadow-sm transition"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-hospital-700 hover:text-hospital-900 hover:bg-hospital-50 transition"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {filteredTests.length === 0 ? (
            <div className="lavish-card p-8 rounded-2xl text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-hospital-50 text-[#39786B] flex items-center justify-center mx-auto border border-hospital-200">
                <FlaskConical className="w-6 h-6" />
              </div>
              <div>
                <p className="font-extrabold font-display text-hospital-950 text-sm">No Lab Orders in Queue</p>
                <p className="text-xs text-hospital-800 mt-1 max-w-xs mx-auto leading-relaxed">
                  Orders placed by doctors or direct walk-ins will appear here with barcoded vacutainer tracking.
                </p>
              </div>
              {search && (
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={() => setSearch('')}
                    className="px-3.5 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-300 text-hospital-900 font-bold text-xs transition"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {filteredTests.map(test => {
                const isSelected = activeTest?.id === test.id;
                const tube = getTubeColor(test.sampleType);
                const hasAbnormal = test.parameters.some(p => p.isAbnormal);

                return (
                  <div
                    key={test.id}
                    onClick={() => {
                      setSelectedTest(test);
                      setIsEditingParameters(false);
                    }}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 relative ${isSelected
                        ? 'bg-gradient-to-r from-hospital-50/90 via-white to-hospital-50/60 border-[#39786B] shadow-md'
                        : 'bg-white border-hospital-300 hover:border-hospital-300 hover:shadow-sm'
                      }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        {/* Tube cap indicator */}
                        <div
                          className={`w-3.5 h-9 rounded-md ${tube.dot} flex-shrink-0 mt-0.5 border border-black/10 shadow-xs`}
                          title={`Vacutainer Tube: ${tube.name}`}
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-extrabold font-display text-xs sm:text-sm text-hospital-950">{test.testName}</span>
                            {hasAbnormal && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-hospital-50 text-hospital-700 border border-hospital-200 flex items-center gap-1">
                                <AlertTriangle className="w-2.5 h-2.5 text-hospital-600" />
                                <span>Abnormal Flag</span>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-hospital-800 font-medium mt-0.5">
                            {test.patientName} • {test.patientAge}y, {test.patientGender}
                          </p>
                        </div>
                      </div>

                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(test.status)}`}>
                        {test.status}
                      </span>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-hospital-50 flex items-center justify-between text-[11px] text-hospital-800">
                      <span className="font-mono text-[10px] font-semibold text-hospital-900 bg-hospital-50 px-2 py-0.5 rounded-md border border-hospital-300/70">
                        {test.barcode}
                      </span>
                      <span className="text-[11px] font-medium text-hospital-800 truncate max-w-[160px]">
                        {test.orderedByDoctor.split(',')[0]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right 7 cols: Test Result Dossier & Analyzer Workflow */}
        <div className="lg:col-span-7">
          {activeTest ? (
            <div className="lavish-card p-6 rounded-2xl space-y-5">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-hospital-50 gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-lg font-extrabold font-display text-hospital-950">{activeTest.testName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(activeTest.status)}`}>
                      {activeTest.status}
                    </span>
                  </div>
                  <p className="text-xs text-hospital-800 font-mono mt-0.5 font-medium">
                    Order ID: <span className="text-hospital-900 font-bold">{activeTest.id}</span> • Specimen: {activeTest.sampleType}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLabelModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-300 text-hospital-900 text-xs font-bold border border-hospital-300 transition"
                    title="Print Vacutainer Vial Barcode Label"
                  >
                    <Tag className="w-3.5 h-3.5 text-hospital-800" />
                    <span>Print Tube Label</span>
                  </button>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-hospital-50 hover:bg-hospital-100 text-[#39786B] text-xs font-bold border border-hospital-200 transition"
                    title="View & Download Official NABL Diagnostic PDF Report"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#39786B]" />
                    <span>View Report</span>
                  </button>
                </div>
              </div>

              {/* Patient & Specimen Info Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-hospital-50 to-hospital-50/40 border border-hospital-300/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-extrabold tracking-wider block">Patient Record</span>
                  <p className="font-extrabold text-hospital-950 mt-0.5">{activeTest.patientName}</p>
                  <p className="text-hospital-800 text-[11px] font-medium">{activeTest.patientGender}, {activeTest.patientAge} years</p>
                </div>
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-extrabold tracking-wider block">Specimen Vacutainer</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${getTubeColor(activeTest.sampleType).dot}`} />
                    <p className="font-extrabold text-hospital-950">{getTubeColor(activeTest.sampleType).name}</p>
                  </div>
                  <p className="text-hospital-800 text-[10px] font-mono font-semibold">{activeTest.barcode}</p>
                </div>
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-extrabold tracking-wider block">Clinical Assignment</span>
                  <p className="font-extrabold text-hospital-950 mt-0.5">{activeTest.orderedByDoctor}</p>
                  <p className="text-hospital-800 text-[10px] font-mono">{activeTest.orderedAt}</p>
                </div>
              </div>

              {/* Parameters Table & Analyzer Values */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold font-display text-hospital-950 uppercase tracking-wider">
                      Laboratory Analyzer Parameters & Findings
                    </span>
                    <p className="text-[11px] text-hospital-800">Edit observed values to simulate analyzer inputs</p>
                  </div>

                  <button
                    onClick={() => setIsEditingParameters(!isEditingParameters)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                      isEditingParameters
                        ? 'bg-hospital-50 text-hospital-700 border-hospital-200'
                        : 'bg-hospital-50 text-[#39786B] border-hospital-200 hover:bg-hospital-100'
                    }`}
                  >
                    {isEditingParameters ? 'Done Editing' : 'Edit Values'}
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-hospital-300">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gradient-to-r from-[#E7F0E9] to-[#F1ECFE] border-b border-hospital-300 text-hospital-900 font-bold text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-3.5">Test Parameter</th>
                        <th className="p-3.5">Observed Value</th>
                        <th className="p-3.5">Standard Reference Range</th>
                        <th className="p-3.5 text-right">Clinical Flag</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-hospital-50">
                      {activeTest.parameters.map((param, i) => (
                        <tr key={i} className="hover:bg-hospital-50/45 transition">
                          <td className="p-3.5 font-bold text-hospital-950">
                            {param.name}
                          </td>
                          <td className="p-3.5 font-bold font-mono text-hospital-950">
                            {isEditingParameters ? (
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={param.value}
                                  onChange={(e) => handleParameterValueChange(i, e.target.value)}
                                  className="w-24 px-2.5 py-1 rounded-lg bg-white border border-hospital-300 text-xs text-hospital-950 font-bold focus:outline-none focus:ring-2 focus:ring-[#39786B]/20"
                                />
                                <span className="text-[11px] text-hospital-800">{param.unit}</span>
                              </div>
                            ) : (
                              <span>{param.value} <span className="text-hospital-800 text-[11px] font-medium">{param.unit}</span></span>
                            )}
                          </td>
                          <td className="p-3.5 text-hospital-800 font-mono text-[11px]">
                            {param.normalRange} {param.unit}
                          </td>
                          <td className="p-3.5 text-right">
                            {param.isAbnormal ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-hospital-50 text-hospital-700 border border-hospital-200">
                                <AlertTriangle className="w-2.5 h-2.5 text-hospital-600" />
                                <span>Abnormal</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-hospital-50 text-hospital-700 border border-hospital-200">
                                <CheckCircle2 className="w-2.5 h-2.5 text-hospital-600" />
                                <span>Normal</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Workflow Stepper & Advance Action */}
              <div className="p-4 rounded-xl bg-hospital-50 border border-hospital-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTest.status === 'Ordered' ? 'bg-hospital-500 animate-ping' : 'bg-hospital-500'}`} />
                    <span className="font-bold text-hospital-900">1. Ordered</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-hospital-700" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTest.status === 'Sample Collected' ? 'bg-[#39786B] animate-ping' : activeTest.status === 'Ordered' ? 'bg-hospital-300' : 'bg-hospital-500'}`} />
                    <span className="font-bold text-hospital-900">2. Drawn</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-hospital-700" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTest.status === 'Analyzing' ? 'bg-hospital-500 animate-ping' : (activeTest.status === 'Approved' || activeTest.status === 'Delivered') ? 'bg-hospital-500' : 'bg-hospital-300'}`} />
                    <span className="font-bold text-hospital-900">3. Analyzing</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-hospital-700" />
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${activeTest.status === 'Approved' || activeTest.status === 'Delivered' ? 'bg-hospital-500' : 'bg-hospital-300'}`} />
                    <span className="font-bold text-hospital-900">4. Sign-Off</span>
                  </div>
                </div>

                <button
                  onClick={() => handleAdvanceStatus(activeTest)}
                  className="btn-zoho-primary px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition active:scale-[0.98]"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    Advance &rarr; {
                      activeTest.status === 'Ordered' ? 'Mark Sample Drawn' :
                        activeTest.status === 'Sample Collected' ? 'Send to Analyzer' :
                          activeTest.status === 'Analyzing' ? 'Pathologist Sign & Approve' : 'Mark Delivered'
                    }
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="lavish-card p-16 rounded-2xl text-center text-hospital-800 text-xs font-medium">
              Select a test order from the queue to view parameters and advance workflow
            </div>
          )}
        </div>
      </div>

      {/* ================= MODAL 1: WALK-IN LAB ORDER ================= */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter">
            <div className="h-1.5 bg-gradient-to-r from-hospital-500 via-hospital-500 to-hospital-600" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-hospital-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-hospital-50 text-[#39786B] border border-hospital-200 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold font-display text-hospital-950 text-base">Direct Walk-In Diagnostic Order</h3>
                </div>
                <button onClick={() => setIsNewOrderModalOpen(false)} className="text-hospital-700 hover:text-hospital-900 p-1 rounded-lg hover:bg-hospital-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateOrderSubmit} className="space-y-4">
                {/* Select or type patient */}
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1.5">Select Registered Patient or Type Walk-In</label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => {
                      setSelectedPatientId(e.target.value);
                      const found = patients.find(p => p.id === e.target.value);
                      if (found) {
                        setWalkinPatientName(found.name);
                        setWalkinPatientAge(found.age.toString());
                        setWalkinPatientGender(found.gender);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white mb-2 transition"
                  >
                    <option value="">-- Or enter new walk-in details below --</option>
                    {patients.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id}) - {p.gender}, {p.age}y</option>
                    ))}
                  </select>

                  {!selectedPatientId && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Walk-In Patient Name"
                        value={walkinPatientName}
                        onChange={(e) => setWalkinPatientName(e.target.value)}
                        required
                        className="sm:col-span-1 px-3 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                      />
                      <input
                        type="number"
                        placeholder="Age"
                        value={walkinPatientAge}
                        onChange={(e) => setWalkinPatientAge(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                      />
                      <select
                        value={walkinPatientGender}
                        onChange={(e) => setWalkinPatientGender(e.target.value)}
                        className="px-3 py-2 rounded-xl bg-hospital-50 border border-hospital-300 text-xs text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Predefined Test Catalog */}
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1.5">Diagnostic Test Package</label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto border border-hospital-300 rounded-xl p-2 bg-hospital-50/50">
                    {LAB_CATALOG.map((pkg, idx) => (
                      <div
                        key={pkg.name}
                        onClick={() => setSelectedCatalogIndex(idx)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${selectedCatalogIndex === idx
                            ? 'bg-hospital-50 border-[#39786B] font-bold text-[#10221F] shadow-xs'
                            : 'bg-white border-hospital-300/80 hover:border-hospital-300 text-hospital-900'
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${getTubeColor(pkg.sampleType).dot}`} />
                          <span>{pkg.name}</span>
                          <span className="text-[10px] text-hospital-700 font-medium">({pkg.sampleType})</span>
                        </div>
                        <span className="font-mono text-hospital-700 font-bold">₹{pkg.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ordering Clinician */}
                <div>
                  <label className="text-xs font-bold text-hospital-900 block mb-1.5">Referring Clinician</label>
                  <input
                    type="text"
                    value={referringDoctor}
                    onChange={(e) => setReferringDoctor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-hospital-50 border border-hospital-300 text-xs font-medium text-hospital-950 focus:outline-none focus:border-[#39786B] focus:bg-white transition"
                  />
                </div>

                <div className="pt-3 flex justify-end border-t border-hospital-50">
                  <button
                    type="submit"
                    className="btn-zoho-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition"
                  >
                    Generate Barcode &amp; Order
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: VACUTAINER VIAL BARCODE LABEL ================= */}
      {isLabelModalOpen && activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter">
            <div className="h-1.5 bg-gradient-to-r from-[#1D4840] to-[#39786B]" />
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-hospital-50">
                <h3 className="font-extrabold font-display text-hospital-950 text-sm flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#39786B]" />
                  <span>Specimen Vial Label (Print)</span>
                </h3>
                <button onClick={() => setIsLabelModalOpen(false)} className="text-hospital-700 hover:text-hospital-900 p-1 rounded-lg hover:bg-hospital-50">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Realistic Barcode Tube Sticker */}
              <div className="p-4 rounded-xl border-2 border-dashed border-hospital-300 bg-white shadow-xs space-y-2">
                <div className="flex items-center justify-between border-b border-hospital-300 pb-1 text-[11px] font-bold text-hospital-900">
                  <span>{currentTenant.name}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${getTubeColor(activeTest.sampleType).bg} ${getTubeColor(activeTest.sampleType).text}`}>
                    {getTubeColor(activeTest.sampleType).name}
                  </span>
                </div>

                <div>
                  <p className="font-bold text-sm text-hospital-950">{activeTest.patientName}</p>
                  <p className="text-[10px] text-hospital-800 font-mono">ID: {activeTest.patientId} • {activeTest.patientGender}/{activeTest.patientAge}</p>
                  <p className="text-[11px] font-semibold text-hospital-900 mt-1">{activeTest.testName}</p>
                </div>

                {/* Barcode graphic */}
                <div className="pt-2 text-center">
                  <div className="h-10 bg-[repeating-linear-gradient(90deg,#000_0px,#000_2px,transparent_2px,transparent_4px,#000_4px,#000_7px,transparent_7px,transparent_9px)] rounded-xs w-full" />
                  <p className="font-mono text-xs font-bold text-hospital-950 tracking-widest mt-1">{activeTest.barcode}</p>
                </div>

                <div className="pt-1 border-t border-hospital-50 text-[9px] text-hospital-700 font-medium flex items-center justify-between">
                  <span>Collected: {activeTest.orderedAt}</span>
                  <span>Tech: {activeTest.technicianName || 'DMLT-1'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => window.print()}
                  className="btn-zoho-primary w-full py-2.5 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Barcode Sticker</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: OFFICIAL NABL DIAGNOSTIC REPORT ================= */}
      {isReportModalOpen && activeTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-hospital-950/55 backdrop-blur-md p-4">
          <div className="w-full max-w-2xl max-h-[90vh] rounded-2xl bg-white border border-hospital-300 shadow-2xl overflow-hidden glide-enter flex flex-col">
            <div className="h-1.5 bg-gradient-to-r from-[#1D4840] via-[#39786B] to-[#39786B]" />
            <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b-2 border-hospital-950">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1D4840] to-[#39786B] text-white flex items-center justify-center font-extrabold text-sm">
                      +
                    </div>
                    <div>
                      <h2 className="text-lg font-black font-display text-hospital-950 tracking-tight">{currentTenant.name}</h2>
                      <p className="text-[10px] text-hospital-800 uppercase tracking-widest font-bold">
                        Department of Laboratory Medicine & Pathology (NABL Accredited)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-hospital-50 text-hospital-800 text-[10px] font-bold border border-hospital-200">
                    <ShieldCheck className="w-3 h-3 text-hospital-600" />
                    <span>NABL ISO 15189 Certified</span>
                  </span>
                  <p className="text-[10px] font-mono text-hospital-800 font-semibold mt-1">Barcode: {activeTest.barcode}</p>
                </div>
              </div>

              {/* Patient Demographic Table */}
              <div className="p-4 rounded-xl bg-hospital-50 border border-hospital-300 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-bold">Patient Name</span>
                  <p className="font-bold text-hospital-950">{activeTest.patientName}</p>
                </div>
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-bold">Age / Gender</span>
                  <p className="font-bold text-hospital-950">{activeTest.patientAge} Years / {activeTest.patientGender}</p>
                </div>
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-bold">Patient ID</span>
                  <p className="font-bold font-mono text-hospital-950">{activeTest.patientId}</p>
                </div>
                <div>
                  <span className="text-[10px] text-hospital-700 uppercase font-bold">Sample Drawn</span>
                  <p className="font-bold text-hospital-950">{activeTest.orderedAt}</p>
                </div>
              </div>

              {/* Test Investigation Findings */}
              <div>
                <div className="border-b-2 border-hospital-950 pb-1.5 mb-2 flex items-center justify-between">
                  <span className="font-extrabold font-display text-hospital-950 text-xs uppercase tracking-wider">
                    Investigation: {activeTest.testName}
                  </span>
                  <span className="text-[11px] text-hospital-800 font-mono font-semibold">Specimen: {activeTest.sampleType}</span>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-hospital-300 text-[10px] uppercase text-hospital-800 font-bold">
                      <th className="py-2">Test Parameter</th>
                      <th className="py-2">Observed Result</th>
                      <th className="py-2">Biological Reference Interval</th>
                      <th className="py-2 text-right">Interpretation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-hospital-50 font-mono">
                    {activeTest.parameters.map((p, i) => (
                      <tr key={i} className="py-2">
                        <td className="py-2.5 font-sans font-bold text-hospital-950">{p.name}</td>
                        <td className="py-2.5 font-bold text-hospital-950">{p.value} {p.unit}</td>
                        <td className="py-2.5 text-hospital-800 text-[11px]">{p.normalRange} {p.unit}</td>
                        <td className="py-2.5 text-right font-sans">
                          {p.isAbnormal ? (
                            <span className="text-hospital-600 font-bold text-[11px]">HIGH / ABNORMAL</span>
                          ) : (
                            <span className="text-hospital-700 font-bold text-[11px]">NORMAL</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pathologist Endorsement Sign-off */}
              <div className="pt-4 border-t border-hospital-300 flex items-center justify-between text-xs">
                <div>
                  <p className="text-[10px] text-hospital-700 uppercase font-bold">Analyzed by</p>
                  <p className="font-bold text-hospital-950">{activeTest.technicianName || 'Rajesh Nair, DMLT'}</p>
                  <p className="text-[10px] text-hospital-800">Medical Laboratory Technologist</p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] text-hospital-700 uppercase font-bold">Reviewed & Verified by</p>
                  <p className="font-bold text-hospital-950">{activeTest.approvedBy || 'Dr. Sunita Sen, MD (Pathology)'}</p>
                  <p className="text-[10px] text-hospital-800">Consultant Pathologist • Reg. No. 44102</p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="pt-4 border-t border-hospital-50 flex items-center justify-between">
                <span className="text-[10px] text-hospital-700 font-mono font-medium">Digitally signed &amp; verified by HospitalOS LIMS</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-hospital-800 hover:text-hospital-950 hover:bg-hospital-50 transition"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="btn-zoho-primary px-5 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download / Print PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
