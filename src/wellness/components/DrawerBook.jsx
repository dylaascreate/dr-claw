import React, { useState, useEffect } from 'react';

const SERVICES = [
  { name: 'Diabetes Review & HbA1c Check', short: 'Diabetes Review', p: 'Dr. Sarah Lim', price: 280, duration: '45m' },
  { name: 'Cardiac Risk Assessment', short: 'Cardiology', p: 'Dr. Marcus Tan', price: 320, duration: '45m' },
  { name: 'Nephrology Follow-up', short: 'Nephrology', p: 'Dr. Priya Nair', price: 260, duration: '40m' },
  { name: 'General Chronic Care Review', short: 'General Review', p: 'Dr. Sarah Lim', price: 180, duration: '30m' },
];

const PRACTITIONERS = [
  { name: 'Dr. Sarah Lim', role: 'Endocrinologist', rating: '4.9', avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop' },
  { name: 'Dr. Marcus Tan', role: 'Cardiologist', rating: '4.8', avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=200&auto=format&fit=crop' },
  { name: 'Dr. Priya Nair', role: 'Nephrologist', rating: '4.7', avatar: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop' },
];

const DATES = [
  { weekday: 'Fri', day: '24', full: 'Fri, Oct 24' },
  { weekday: 'Sat', day: '25', full: 'Sat, Oct 25' },
  { weekday: 'Sun', day: '26', full: 'Sun, Oct 26' },
  { weekday: 'Mon', day: '27', full: 'Mon, Oct 27' },
];

const TIMES = ['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM'];

export default function DrawerBook({ show, onClose, preselectedParams, onConfirm }) {
  const [selectedService, setSelectedService] = useState(SERVICES[0]);
  const [practitioners, setPractitioners] = useState(PRACTITIONERS);
  const [selectedPractitioner, setSelectedPractitioner] = useState(PRACTITIONERS[0]);
  const [selectedDate, setSelectedDate] = useState(DATES[0]);
  const [selectedTime, setSelectedTime] = useState(TIMES[0]);

  // Sync state if preselectedParams change from parent
  useEffect(() => {
    if (preselectedParams && show) {
      if (preselectedParams.serviceName) {
        const match = SERVICES.find(s => s.name.toLowerCase().includes(preselectedParams.serviceName.toLowerCase()) || preselectedParams.serviceName.toLowerCase().includes(s.short.toLowerCase()));
        if (match) setSelectedService(match);
      }
      if (preselectedParams.practitioner) {
        const existing = practitioners.find(p => p.name.toLowerCase() === preselectedParams.practitioner.toLowerCase());
        if (existing) {
          setSelectedPractitioner(existing);
        } else {
          // Inject the doctor passed in from Find a Doctor (Supabase data)
          const injected = {
            name: preselectedParams.practitioner,
            role: preselectedParams.role || 'Specialist',
            rating: preselectedParams.rating || '4.9',
            avatar: preselectedParams.avatar || PRACTITIONERS[0].avatar,
          };
          setPractitioners(prev => [injected, ...prev.filter(p => p.name !== injected.name)]);
          setSelectedPractitioner(injected);
        }
      }
      if (preselectedParams.date) {
        const match = DATES.find(d => d.full.toLowerCase() === preselectedParams.date.toLowerCase());
        if (match) setSelectedDate(match);
      }
      if (preselectedParams.time) {
        if (TIMES.includes(preselectedParams.time)) setSelectedTime(preselectedParams.time);
      }
    }
  }, [preselectedParams, show]);

  const handleConfirm = () => {
    onConfirm({
      serviceName: selectedService.name,
      price: selectedService.price,
      practitioner: selectedPractitioner.name,
      date: selectedDate.full,
      time: selectedTime,
      avatar: selectedPractitioner.avatar
    });
  };

  return (
    <div
      className={`absolute bottom-0 left-0 right-0 h-[85%] bg-cream rounded-t-[32px] shadow-premium z-50 transform transition-transform duration-300 ease-out flex flex-col overflow-hidden ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div
        className="w-12 h-1.5 bg-brown-400/30 rounded-full mx-auto my-3 flex-shrink-0 cursor-pointer"
        onClick={onClose}
      ></div>

      <div className="px-5 pb-3 border-b border-brown-100 flex items-center justify-between">
        <h3 className="text-xl font-bold text-brown-800 font-serif">Book Appointment</h3>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-brown-100 flex items-center justify-center text-brown-600 hover:bg-brown-100/80"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6 text-left">
        {/* Step 1: Select Service */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            1. Select Treatment
          </label>
          <div className="grid grid-cols-2 gap-3">
            {SERVICES.map((s) => {
              const isSelected = selectedService.name === s.name;
              return (
                <button
                  key={s.name}
                  onClick={() => setSelectedService(s)}
                  className={`p-3.5 bg-white border rounded-2xl text-left shadow-sm transition-all relative block ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 text-sage-500 bg-sage-100/50 rounded-full p-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  <p className="text-sm font-semibold text-brown-800 font-serif">{s.short}</p>
                  <p className="text-xs text-brown-600">{s.p}</p>
                  <p className="text-xs font-bold text-sage-500 mt-2">${s.price} / {s.duration}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Choose Practitioner */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            2. Practitioner Preference
          </label>
          <div className="space-y-2">
            {practitioners.map((p) => {
              const isSelected = selectedPractitioner.name === p.name;
              return (
                <div
                  key={p.name}
                  onClick={() => setSelectedPractitioner(p)}
                  className={`p-3 bg-white border rounded-2xl flex items-center justify-between cursor-pointer transition-all shadow-sm ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} className="w-10 h-10 rounded-full object-cover" alt={p.name} />
                    <div>
                      <p className="text-sm font-semibold text-brown-800 font-serif">{p.name}</p>
                      <p className="text-xs text-brown-500">{p.role} • ★ {p.rating}</p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border ${
                      isSelected ? 'border-4 border-sage-500' : 'border-brown-400'
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Step 3: Date & Time */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-brown-400 block mb-2">
            3. Date & Time
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {DATES.map((d) => {
              const isSelected = selectedDate.full === d.full;
              return (
                <button
                  key={d.full}
                  onClick={() => setSelectedDate(d)}
                  className={`px-4 py-3 bg-white border text-brown-800 rounded-xl text-center shadow-sm flex-shrink-0 ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  <p className="text-[10px] uppercase text-brown-400 font-bold">{d.weekday}</p>
                  <p className="text-sm font-bold">{d.day}</p>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            {TIMES.map((t) => {
              const isSelected = selectedTime === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedTime(t)}
                  className={`py-2.5 bg-white border text-brown-800 rounded-xl text-xs font-semibold text-center shadow-sm ${
                    isSelected ? 'border-sage-500' : 'border-brown-100 hover:border-brown-400'
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Booking CTA Footer */}
      <div className="p-5 bg-white border-t border-brown-100 flex items-center justify-between pb-8">
        <div className="text-left">
          <p className="text-xs text-brown-400 uppercase font-semibold">Total Price</p>
          <p className="text-xl font-bold text-brown-800">${selectedService.price.toFixed(2)}</p>
        </div>
        <button
          onClick={handleConfirm}
          className="py-3 px-6 rounded-xl bg-sage-500 hover:bg-sage-500/90 text-white font-semibold text-sm shadow-md transition-all active:scale-95 animate-fade-in"
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  );
}
