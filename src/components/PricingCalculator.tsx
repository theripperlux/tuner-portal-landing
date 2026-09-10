'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Car, Truck, Tractor, Bike, HardHat, Check } from 'lucide-react';

const PRICING_DATA = {
  car: { tuning: 9, deact: 3, miscle: 8 },
  truck: { tuning: 12, deact: 6, miscle: 12 },
  agri: { tuning: 12, deact: 6, miscle: 12 },
  const: { tuning: 12, deact: 6, miscle: 12 },
  moto: { tuning: 9, deact: 3, miscle: 6 },
};

type VehicleType = keyof typeof PRICING_DATA;

export function PricingCalculator() {
  const t = useTranslations('PricingPage');
  
  const [vehicle, setVehicle] = useState<VehicleType>('car');
  const [tuningSelected, setTuningSelected] = useState(false);
  const [deactSelected, setDeactSelected] = useState(false);
  const [miscleSelected, setMiscleSelected] = useState(false);

  const currentPrices = PRICING_DATA[vehicle];
  
  let tuningCost = 0;
  let deactCost = 0;
  let miscleCost = 0;

  if (tuningSelected) {
    tuningCost = currentPrices.tuning;
  }
  
  if (miscleSelected) {
    if (tuningSelected) {
      miscleCost = currentPrices.miscle / 2; // Discounted when combined with tuning
    } else {
      miscleCost = currentPrices.miscle;
    }
  }

  if (deactSelected) {
    if (tuningSelected || miscleSelected) {
      deactCost = 0; // Free when combined with tuning or miscle
    } else {
      deactCost = currentPrices.deact;
    }
  }

  const totalCredits = tuningCost + deactCost + miscleCost;
  const totalEuro = totalCredits * 5;

  return (
    <div className="bg-white dark:bg-[#111] p-6 md:p-10 rounded-3xl border border-black/10 dark:border-white/10 shadow-xl max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-black mb-2">{t('calcTitle')}</h3>
        <p className="text-gray-500 dark:text-gray-400">{t('calcDesc')}</p>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        <button onClick={() => setVehicle('car')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${vehicle === 'car' ? 'bg-[#ff2d3f] text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          <Car className="w-5 h-5" /> {t('car')}
        </button>
        <button onClick={() => setVehicle('truck')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${vehicle === 'truck' ? 'bg-[#ff2d3f] text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          <Truck className="w-5 h-5" /> {t('truck')}
        </button>
        <button onClick={() => setVehicle('agri')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${vehicle === 'agri' ? 'bg-[#ff2d3f] text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          <Tractor className="w-5 h-5" /> {t('agri')}
        </button>
        <button onClick={() => setVehicle('const')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${vehicle === 'const' ? 'bg-[#ff2d3f] text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          <HardHat className="w-5 h-5" /> {t('const')}
        </button>
        <button onClick={() => setVehicle('moto')} className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${vehicle === 'moto' ? 'bg-[#ff2d3f] text-black shadow-lg scale-105' : 'bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10'}`}>
          <Bike className="w-5 h-5" /> {t('moto')}
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div 
          onClick={() => setTuningSelected(!tuningSelected)}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative ${tuningSelected ? 'border-[#ff2d3f] bg-[#ff2d3f]/5' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
        >
          {tuningSelected && <div className="absolute top-4 right-4 w-6 h-6 bg-[#ff2d3f] text-black rounded-full flex items-center justify-center"><Check className="w-4 h-4" /></div>}
          <h4 className="font-bold text-lg mb-2">{t('colTuning')}</h4>
          <p className="text-3xl font-black">{tuningCost > 0 ? tuningCost : currentPrices.tuning} <span className="text-sm text-gray-500 font-normal">CRD</span></p>
          <p className="text-sm text-gray-400 mt-1">({(tuningCost > 0 ? tuningCost : currentPrices.tuning) * 5}€)</p>
        </div>
        
        <div 
          onClick={() => setDeactSelected(!deactSelected)}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative ${deactSelected ? 'border-[#ff2d3f] bg-[#ff2d3f]/5' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
        >
          {deactSelected && <div className="absolute top-4 right-4 w-6 h-6 bg-[#ff2d3f] text-black rounded-full flex items-center justify-center"><Check className="w-4 h-4" /></div>}
          <h4 className="font-bold text-lg mb-2">{t('colDeact')}</h4>
          <p className="text-3xl font-black">{deactSelected ? deactCost : currentPrices.deact} <span className="text-sm text-gray-500 font-normal">CRD</span></p>
          <p className="text-sm text-gray-400 mt-1">({(deactSelected ? deactCost : currentPrices.deact) * 5}€) {deactSelected && deactCost === 0 && <span className="text-green-500 font-bold ml-1">FREE!</span>}</p>
        </div>

        <div 
          onClick={() => setMiscleSelected(!miscleSelected)}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all relative ${miscleSelected ? 'border-[#ff2d3f] bg-[#ff2d3f]/5' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}`}
        >
          {miscleSelected && <div className="absolute top-4 right-4 w-6 h-6 bg-[#ff2d3f] text-black rounded-full flex items-center justify-center"><Check className="w-4 h-4" /></div>}
          <h4 className="font-bold text-lg mb-2">{t('colMiscle')}</h4>
          <p className="text-3xl font-black">{miscleSelected ? miscleCost : currentPrices.miscle} <span className="text-sm text-gray-500 font-normal">CRD</span></p>
          <p className="text-sm text-gray-400 mt-1">({(miscleSelected ? miscleCost : currentPrices.miscle) * 5}€)</p>
        </div>
      </div>

      <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-8 text-center border border-black/5 dark:border-white/5">
        <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-2">{t('calcTotal')}</p>
        <div className="flex items-end justify-center gap-4">
          <div className="text-6xl font-black text-[#ff2d3f]">
            {totalCredits} <span className="text-2xl text-gray-500">CRD</span>
          </div>
          <div className="text-3xl font-bold text-gray-400 mb-2">
            = {totalEuro}€
          </div>
        </div>
      </div>
    </div>
  );
}
