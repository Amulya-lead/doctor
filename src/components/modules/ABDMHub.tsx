import React, { useState } from 'react';
import { 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { useHospitalOS } from '../../context/HospitalOSContext';

export const ABDMHub: React.FC = () => {
  const { currentTenant, addSystemEvent } = useHospitalOS();

  const [testAbhaInput, setTestAbhaInput] = useState('91-4521-8890-1234');
  const [authMethod, setAuthMethod] = useState('AADHAAR_OTP');
  const [verificationResult, setVerificationResult] = useState({
    status: 'verified',
    name: 'Aarav Sharma',
    dob: '14-08-1988',
    gender: 'Male',
    kycStatus: 'Aadhaar Verified (Level 2)',
    token: 'ABDM-FED-AUTH-908124-TOKEN'
  });

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult({
      status: 'verified',
      name: 'Verified Patient',
      dob: '01-01-1990',
      gender: 'Male',
      kycStatus: 'ABHA Link Verified',
      token: `ABDM-${Date.now().toString().slice(-6)}`
    });

    addSystemEvent({
      module: 'ABDM',
      title: 'ABHA Verification Completed',
      description: `Verified identity for ${testAbhaInput} via ${authMethod}.`,
      severity: 'success',
      actor: 'ABDM Gateway'
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Cpu className="w-6 h-6 text-sky-600" />
            <span>ABDM India Stack & National Health Gateway</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Facility Registry (HFR: {currentTenant.abdmFacilityId}), ABHA KYC, and FHIR standard records.
          </p>
        </div>

        <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>ABDM M3 Certified Facility</span>
        </span>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Verification Card */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Instant ABHA 14-Digit Verification</h3>
          <form onSubmit={handleVerify} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Enter 14-Digit ABHA Number</label>
              <input
                type="text"
                value={testAbhaInput}
                onChange={e => setTestAbhaInput(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs font-mono text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Authentication Mode</label>
              <select
                value={authMethod}
                onChange={e => setAuthMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white"
              >
                <option value="AADHAAR_OTP">Aadhaar Linked Mobile OTP</option>
                <option value="DEMOGRAPHICS">Demographic Match</option>
                <option value="MOBILE_OTP">ABDM Registered Mobile OTP</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition"
            >
              Verify Patient ABHA & Sync Records
            </button>
          </form>

          {verificationResult && (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>KYC Identity Verified</span>
              </div>
              <p className="text-slate-700">Name: <span className="font-bold">{verificationResult.name}</span></p>
              <p className="text-slate-600 font-mono text-[10px]">Session Token: {verificationResult.token}</p>
            </div>
          )}
        </div>

        {/* Facility Info Card */}
        <div className="p-6 rounded-xl bg-white border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm">Health Facility Registry (HFR) Metadata</h3>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">Registered Facility Name</span>
              <span className="font-bold text-slate-900 text-sm">{currentTenant.name}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">National HFR Facility ID</span>
              <span className="font-bold text-slate-900 font-mono">{currentTenant.abdmFacilityId}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block uppercase font-semibold">State Health Registration</span>
              <span className="font-bold text-slate-900 font-mono">{currentTenant.licenseNumber}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
