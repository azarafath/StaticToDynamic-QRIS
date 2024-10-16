'use client'
import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { useTheme } from 'next-themes';
import { Moon, Sun, Share2 } from 'lucide-react';

const qrisStatic = "00020101021126570011ID.DANA.WWW011893600915336094826302093609482630303UMI51440014ID.CO.QRIS.WWW0215ID10222329023150303UMI5204737253033605802ID5922Ahmad Zakaria Fathoni 6013Kota Semarang61055021863045D82";

const calculateCRC16 = (str: string): string => {
  const charCodeAt = (str: string, i: number) => str.charCodeAt(i);
  let crc = 0xFFFF;
  const strlen = str.length;
  for (let c = 0; c < strlen; c++) {
    crc ^= charCodeAt(str, c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  const hex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
  return hex;
}

const modifyQRIS = (qris: string, amount: string, feeType: string, feeValue: string): string => {
  let modifiedQRIS = qris.slice(0, -4);
  modifiedQRIS = modifiedQRIS.replace("010211", "010212");
  const parts = modifiedQRIS.split("5802ID");
  
  let amountField = `54${amount.length.toString().padStart(2, '0')}${amount}`;

  if (feeType && feeValue) {
    const feeField = feeType === 'fixed' 
      ? `55020256${feeValue.length.toString().padStart(2, '0')}${feeValue}` 
      : `55020357${feeValue.length.toString().padStart(2, '0')}${feeValue}`; 
    amountField += feeField;
  }
  
  amountField += "5802ID";
  
  const newQRIS = `${parts[0]}${amountField}${parts[1]}`;
  const crc = calculateCRC16(newQRIS);
  return `${newQRIS}${crc}`;
}

export default function QRISConverter() {
  const [amount, setAmount] = useState('');
  const [hasFee, setHasFee] = useState(false);
  const [feeType, setFeeType] = useState<'fixed' | 'percentage'>('fixed');
  const [feeValue, setFeeValue] = useState('');
  const [qrCodeURL, setQRCodeURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isQRGenerated, setIsQRGenerated] = useState(false); // New state for QR code visibility
  const qrCodeCanvasRef = useRef<HTMLCanvasElement | null>(null); // Reference for canvas

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleConvert = async () => {
    setIsLoading(true);
    try {
      const modifiedData = modifyQRIS(
        qrisStatic, 
        amount, 
        hasFee ? feeType : '', 
        hasFee ? feeValue : ''
      );
      const url = await QRCode.toDataURL(modifiedData, { width: 300 });
      setQRCodeURL(url);
      setIsQRGenerated(true);
      // Draw QR code to canvas
      drawQRCodeToCanvas(url);
    } catch (error) {
      console.error('Error converting QRIS:', error);
      alert('Terjadi kesalahan saat mengkonversi QRIS. Pastikan data yang dimasukkan benar.');
    } finally {
      setIsLoading(false);
    }
  };

  const drawQRCodeToCanvas = (url: string) => {
    const canvas = qrCodeCanvasRef.current;
    if (canvas) {
      const context = canvas.getContext('2d');
      if (context) { // Check if context is not null
        const img = new Image();
        img.onload = () => {
          context.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas safely
          context.drawImage(img, 0, 0); // Draw QR code image
        };
        img.src = url;
      }
    }
  };
  

  const calculateFee = () => {
    if (!hasFee || !feeValue) return 0;
    const amountNum = parseFloat(amount);
    if (feeType === 'fixed') {
      return parseFloat(feeValue);
    } else {
      return (amountNum * parseFloat(feeValue)) / 100;
    }
  };

  const totalAmount = parseFloat(amount) + calculateFee();


  const handleBack = () => {
    // Reset all states to go back to the form
    setAmount('');
    setHasFee(false);
    setFeeType('fixed');
    setFeeValue('');
    setQRCodeURL('');
    setIsQRGenerated(false);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 dark:from-gray-800 dark:via-gray-900 dark:to-black transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
        >
          {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>
      <div className="bg-white dark:bg-gray-800 bg-opacity-20 dark:bg-opacity-20 backdrop-blur-lg rounded-xl shadow-2xl p-8 w-full max-w-2xl transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-4xl font-bold text-white mb-6 text-center">Tagihan by azf.id</h1>
        {!isQRGenerated ? (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="Amount"
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 focus:bg-opacity-70 dark:focus:bg-opacity-70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 text-gray-800 dark:text-white"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="hasFee"
                checked={hasFee}
                onChange={(e) => setHasFee(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500 dark:text-purple-400 dark:focus:ring-purple-300"
              />
              <label htmlFor="hasFee" className="text-white">Termasuk Fee ?</label>
            </div>
            {hasFee && (
              <>
                <select
                  value={feeType}
                  onChange={(e) => setFeeType(e.target.value as 'fixed' | 'percentage')}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 focus:bg-opacity-70 dark:focus:bg-opacity-70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 text-gray-800 dark:text-white"
                >
                  <option value="fixed">Fix Rupiah (Rupiah)</option>
                  <option value="percentage">Persen</option>
                </select>
                <input
                  type="number"
                  placeholder={feeType === 'fixed' ? "Fee (Rupiah)" : "Fee Persen"}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-700 bg-opacity-50 dark:bg-opacity-50 focus:bg-opacity-70 dark:focus:bg-opacity-70 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 text-gray-800 dark:text-white"
                  value={feeValue}
                  onChange={(e) => setFeeValue(e.target.value)}
                />
              </>
            )}
            <button
              onClick={handleConvert}
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              {isLoading ? 'Mengkonversi...' : 'Konversi'}
            </button>
          </div>
        ) : (
          <div className="mt-6 flex flex-col items-center">
            <canvas ref={qrCodeCanvasRef} className="hidden" width={300} height={300} />
            <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-lg transform hover:rotate-3 transition-transform duration-300 ease-in-out">
              <img src={qrCodeURL} alt="Altered QRIS QR Code" className="w-64 h-64" />
            </div>
            <div className="mt-4 text-center w-[250px]">
              <h2 className="text-2xl font-bold text-white mb-2">Tagihan QRIS</h2>
              
              <div className="flex justify-between mb-2 text-white">
                <span className="text-xl">Biaya:</span>
                <span className="text-xl">Rp {parseFloat(amount).toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between mb-2 text-white">
                <span className="text-xl">Fee:</span>
                <span className="text-xl">Rp {calculateFee().toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between mb-4 text-white">
                <span className="text-xl font-semibold">Total:</span>
                <span className="text-xl font-semibold">Rp {totalAmount.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="flex space-x-4 mt-4">
              <button
                onClick={handleBack}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
