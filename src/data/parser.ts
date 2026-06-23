import fs from 'fs';
import path from 'path';

export interface SeaLevelRecord {
  Country: string;
  [year: string]: string | number; // '1993' to '2024'
}

export interface ProcessedCountryData {
  country: string;
  data: { year: number; value: number }[];
  totalRise: number;
  averageRate: number; // mm/year roughly
}

export function getSeaLevelData() {
  const filePath = path.join(process.cwd(), 'sea_level.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  const lines = fileContent.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const years = headers.slice(1).map(Number); // 1993 to 2024

  const countries: ProcessedCountryData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    // Handle potential quotes in country names like "Micronesia, Federated State of"
    let line = lines[i].trim();
    if (!line) continue;
    
    let countryName = '';
    let valuesStr = '';
    
    if (line.startsWith('"')) {
      const closingQuote = line.indexOf('"', 1);
      countryName = line.substring(1, closingQuote);
      valuesStr = line.substring(closingQuote + 2); // skip ", "
    } else {
      const firstComma = line.indexOf(',');
      countryName = line.substring(0, firstComma);
      valuesStr = line.substring(firstComma + 1);
    }
    
    const values = valuesStr.split(',').map(Number);
    
    // Process series
    const dataPoints = years.map((year, index) => ({
      year,
      value: values[index] || 0
    }));

    // Calculate total rise from 1993 to 2024
    const firstVal = dataPoints[0].value;
    const lastVal = dataPoints[dataPoints.length - 1].value;
    const totalRise = lastVal - firstVal; // in meters
    
    countries.push({
      country: countryName,
      data: dataPoints,
      totalRise,
      averageRate: totalRise / (years.length - 1)
    });
  }

  // Derived datasets
  const sortedByRise = [...countries].sort((a, b) => b.totalRise - a.totalRise);
  const highestRise = sortedByRise[0];
  const lowestRise = sortedByRise[sortedByRise.length - 1];
  
  const top5Affected = sortedByRise.slice(0, 5);
  const top5LeastAffected = sortedByRise.slice(-5).reverse();

  // Regional average calculation
  const regionalAveragePoints = years.map(year => {
    let sum = 0;
    countries.forEach(c => {
      const pt = c.data.find(d => d.year === year);
      sum += pt ? pt.value : 0;
    });
    return {
      year,
      value: sum / countries.length
    };
  });

  return {
    raw: countries,
    years,
    derived: {
      highestRise,
      lowestRise,
      top5Affected,
      top5LeastAffected,
      regionalAverage: regionalAveragePoints,
    }
  };
}
