export interface Wing {
  name: string;
  flats: string[];
}

export interface Society {
  name: string;
  wings: Wing[];
}

export const societies: Society[] = [
  {
    name: 'Shantinagar',
    wings: [
      { name: 'A', flats: ['101', '102', '103', '104'] },
      { name: 'B', flats: ['201', '202', '203', '204'] },
      { name: 'C', flats: ['301', '302', '303', '304'] },
    ],
  },
  {
    name: 'Green Park',
    wings: [
      { name: 'A', flats: ['101', '102', '103'] },
      { name: 'B', flats: ['201', '202', '203'] },
    ],
  },
  {
    name: 'Sunshine',
    wings: [
      { name: 'A', flats: ['101', '102'] },
      { name: 'B', flats: ['201', '202'] },
    ],
  },
];

export const customers = [
  { name: 'JAYESH DANGI', address: 'F-101 SHANTINAGAR', contactNumber: '8888133849' },
  { name: 'RAVI PATEL', address: 'A-202 GREEN PARK', contactNumber: '9876543210' },
  { name: 'PRIYA SHARMA', address: 'B-303 SUNSHINE', contactNumber: '9123456780' },
];