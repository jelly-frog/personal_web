import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BaseConverterWidget = () => {
  const [values, setValues] = useState({
    dec: '',
    hex: '',
    oct: '',
    bin: ''
  });

  const handleChange = (type: 'dec' | 'hex' | 'oct' | 'bin', value: string) => {
    if (!value) {
      setValues({ dec: '', hex: '', oct: '', bin: '' });
      return;
    }

    let decValue = NaN;
    try {
      if (type === 'dec') decValue = parseInt(value, 10);
      if (type === 'hex') decValue = parseInt(value, 16);
      if (type === 'oct') decValue = parseInt(value, 8);
      if (type === 'bin') decValue = parseInt(value, 2);
    } catch (e) {
      // Ignore invalid input
    }

    if (!isNaN(decValue)) {
      setValues({
        dec: decValue.toString(10),
        hex: decValue.toString(16).toUpperCase(),
        oct: decValue.toString(8),
        bin: decValue.toString(2)
      });
    } else {
       // Allow typing partial invalid inputs but don't update others
       setValues(prev => ({ ...prev, [type]: value }));
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label htmlFor="dec">Decimal (10)</Label>
        <Input 
          id="dec" 
          value={values.dec} 
          onChange={(e) => handleChange('dec', e.target.value)} 
          placeholder="123"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="hex">Hexadecimal (16)</Label>
        <Input 
          id="hex" 
          value={values.hex} 
          onChange={(e) => handleChange('hex', e.target.value)} 
          placeholder="7B"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="oct">Octal (8)</Label>
        <Input 
          id="oct" 
          value={values.oct} 
          onChange={(e) => handleChange('oct', e.target.value)} 
          placeholder="173"
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="bin">Binary (2)</Label>
        <Input 
          id="bin" 
          value={values.bin} 
          onChange={(e) => handleChange('bin', e.target.value)} 
          placeholder="1111011"
        />
      </div>
    </div>
  );
};

export default BaseConverterWidget;
