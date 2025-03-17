
import React from 'react';

const AuroraBackgroundSimple: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 to-white opacity-60"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-purple-50 to-transparent opacity-40"></div>
      <div className="absolute inset-0 [--white:rgba(255,255,255,0.2)] [--black:rgba(0,0,0,0.2)] [--transparent:transparent] [--blue-300:rgba(147,197,253,0.4)] [--blue-400:rgba(96,165,250,0.4)] [--blue-500:rgba(59,130,246,0.4)] [--indigo-300:rgba(165,180,252,0.4)] [--violet-200:rgba(221,214,254,0.4)] [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)] [background-image:var(--aurora)] [background-size:300%] filter blur-[80px] opacity-40"></div>
    </div>
  );
};

export default AuroraBackgroundSimple;
