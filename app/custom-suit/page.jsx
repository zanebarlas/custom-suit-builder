'use client';
import { useState } from 'react';
import Image from 'next/image';

const fabrics = [
  { id: 'wool_s150', name: 'Super 150’s Wool', price: 0, img: '/fabrics/wool_s150.jpg' },
  { id: 'wool_s180', name: 'Super 180’s Wool', price: 75, img: '/fabrics/wool_s180.jpg' },
  { id: 'linen_solbiati', name: 'Pure Linen – Solbiati', price: 50, img: '/fabrics/linen_solbiati.jpg' },
];

const lapels = [
  { id: 'notch', name: 'Notch Lapel', price: 0, img: '/lapels/notch.png' },
  { id: 'peak', name: 'Peak Lapel', price: 20, img: '/lapels/peak.png' },
  { id: 'shawl', name: 'Shawl Lapel', price: 30, img: '/lapels/shawl.png' },
];

const pockets = [
  { id: 'flap', name: 'Flap Pockets', price: 0, img: '/pockets/flap.png' },
  { id: 'jet', name: 'Jet Pockets', price: 10, img: '/pockets/jet.png' },
  { id: 'patch', name: 'Patch Pockets', price: 15, img: '/pockets/patch.png' },
];

const linings = [
  { id: 'navy', name: 'Navy Lining', price: 0, img: '/linings/navy.png' },
  { id: 'burgundy', name: 'Burgundy Paisley', price: 25, img: '/linings/burgundy.png' },
  { id: 'pattern', name: 'Geometric Pattern', price: 35, img: '/linings/pattern.png' },
];

export default function CustomSuitPage() {
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({
    fabric: null,
    lapel: null,
    pocket: null,
    lining: null,
    measurements: {},
  });

  const basePrice = 995;
  const totalPrice =
    basePrice +
    (selection.fabric?.price || 0) +
    (selection.lapel?.price || 0) +
    (selection.pocket?.price || 0) +
    (selection.lining?.price || 0);

  const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);

  const renderOptions = (options, type) => (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {options.map((opt) => (
        <div
          key={opt.id}
          className={`border rounded-lg p-2 cursor-pointer transition ${
            selection[type]?.id === opt.id ? 'border-black' : 'border-gray-300'
          }`}
          onClick={() => setSelection((prev) => ({ ...prev, [type]: opt }))}
        >
          <Image src={opt.img} alt={opt.name} width={160} height={160} className="rounded-md" />
          <p className="mt-2 text-sm">{opt.name}</p>
          {opt.price > 0 && <p className="text-xs text-gray-500">+ ${opt.price}</p>}
        </div>
      ))}
    </div>
  );

  const addToCart = async () => {
    const customAttributes = [
      { key: 'Fabric', value: selection.fabric.name },
      { key: 'Lapel', value: selection.lapel.name },
      { key: 'Pocket', value: selection.pocket.name },
      { key: 'Lining', value: selection.lining.name },
      { key: 'Measurements', value: JSON.stringify(selection.measurements) },
    ];
    const lineItem = {
      variantId: 'gid://shopify/ProductVariant/1234567890',
      quantity: 1,
      customAttributes,
    };
    const resp = await fetch('/api/createCheckout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lineItem }),
    });
    const data = await resp.json();
    window.location.href = data.checkoutUrl;
  };

  return (
    <div className="bg-[#f9f6f3] min-h-screen py-10 px-4 md:px-12">
      <h1 className="text-3xl font-serif text-center mb-8">Design Your Custom Suit</h1>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-sm text-gray-600">Step {step} of 5</p>
            <div className="h-2 w-full bg-gray-200 rounded">
              <div
                className="h-full bg-[#8B0000] rounded transition-all"
                style={{ width: `${(step - 1) * 25}%` }}
              ></div>
            </div>
          </div>
          {step === 1 && (
            <>
              <h2 className="text-xl font-semibold mb-2">1. Choose Your Fabric</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select from premium Italian wools and linens. Prices vary by fabric.
              </p>
              {renderOptions(fabrics, 'fabric')}
              <button
                className="mt-6 px-6 py-3 bg-[#8B0000] text-white rounded disabled:opacity-50"
                disabled={!selection.fabric}
                onClick={handleNext}
              >
                Next: Lapel
              </button>
            </>
          )}
          {step === 2 && (
            <>
              <h2 className="text-xl font-semibold mb-2">2. Choose Your Lapel</h2>
              <p className="text-sm text-gray-600 mb-4">Select a lapel style for your blazer.</p>
              {renderOptions(lapels, 'lapel')}
              <div className="mt-6 flex">
                <button className="mr-4 px-6 py-3 border rounded" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="px-6 py-3 bg-[#8B0000] text-white rounded disabled:opacity-50"
                  disabled={!selection.lapel}
                  onClick={handleNext}
                >
                  Next: Pockets
                </button>
              </div>
            </>
          )}
          {step === 3 && (
            <>
              <h2 className="text-xl font-semibold mb-2">3. Choose Pocket Style</h2>
              <p className="text-sm text-gray-600 mb-4">Select the pocket style you prefer.</p>
              {renderOptions(pockets, 'pocket')}
              <div className="mt-6 flex">
                <button className="mr-4 px-6 py-3 border rounded" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="px-6 py-3 bg-[#8B0000] text-white rounded disabled:opacity-50"
                  disabled={!selection.pocket}
                  onClick={handleNext}
                >
                  Next: Lining
                </button>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <h2 className="text-xl font-semibold mb-2">4. Choose Lining & Details</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select your favourite lining colour or pattern.
              </p>
              {renderOptions(linings, 'lining')}
              <div className="mt-6 flex">
                <button className="mr-4 px-6 py-3 border rounded" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="px-6 py-3 bg-[#8B0000] text-white rounded disabled:opacity-50"
                  disabled={!selection.lining}
                  onClick={handleNext}
                >
                  Next: Measurements
                </button>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <h2 className="text-xl font-semibold mb-2">5. Enter Measurements</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enter your measurements or select a standard size. (Example fields below.)
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase mb-1">Chest (cm)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        measurements: { ...prev.measurements, chest: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        measurements: { ...prev.measurements, waist: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase mb-1">Jacket Length (cm)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        measurements: { ...prev.measurements, jacketLength: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase mb-1">Sleeve Length (cm)</label>
                  <input
                    type="number"
                    className="w-full border rounded p-2"
                    onChange={(e) =>
                      setSelection((prev) => ({
                        ...prev,
                        measurements: { ...prev.measurements, sleeveLength: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-6 flex">
                <button className="mr-4 px-6 py-3 border rounded" onClick={handleBack}>
                  Back
                </button>
                <button
                  className="px-6 py-3 bg-[#8B0000] text-white rounded"
                  onClick={addToCart}
                >
                  Review & Add to Cart (${totalPrice.toFixed(2)})
                </button>
              </div>
            </>
          )}
        </div>
        <div className="flex-1 hidden md:block">
          <div className="sticky top-24 p-4 border rounded bg-white shadow">
            <div className="relative w-full h-96">
              <Image src="/base/base.png" alt="Base Suit" fill style={{ objectFit: 'cover' }} />
              {selection.fabric && (
                <Image src={selection.fabric.img} alt={selection.fabric.name} fill style={{ objectFit: 'cover' }} />
              )}
              {selection.lapel && (
                <Image src={selection.lapel.img} alt={selection.lapel.name} fill style={{ objectFit: 'cover' }} />
              )}
              {selection.pocket && (
                <Image src={selection.pocket.img} alt={selection.pocket.name} fill style={{ objectFit: 'cover' }} />
              )}
              {selection.lining && (
                <Image src={selection.lining.img} alt={selection.lining.name} fill style={{ objectFit: 'cover' }} />
              )}
            </div>
            <div className="mt-4">
              <p className="text-lg font-semibold">Current Price: ${totalPrice.toFixed(2)}</p>
              <p className="text-sm text-gray-600">Base price: $995 CAD</p>
              <p className="text-sm text-gray-600">Estimated delivery: 3–4 weeks</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
