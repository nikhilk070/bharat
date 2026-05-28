"use client";
import React, { useEffect, useState, useMemo } from 'react';
import * as d3 from 'd3';

export default function IndiaMap({ isHero = false }: { isHero?: boolean }) {
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    // Fetch geojson once
    d3.json('https://raw.githubusercontent.com/udit-001/india-maps-data/master/geojson/india.geojson')
      .then(data => setGeoData(data));
  }, []);

  const width = 560;
  const height = 660;

  const projection = useMemo(() => {
    if (!geoData) return null;
    return d3.geoMercator().fitSize([width, height], geoData);
  }, [geoData]);

  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath().projection(projection);
  }, [projection]);

  if (!geoData || !projection || !pathGenerator) return <div style={{ width, height }} />;

  const hqCoords = projection([75.7873, 26.9124]) || [0, 0];

  const cities = [
    { id: 'delhi', name: 'DELHI', coords: [77.2090, 28.6139], color: '#1DB05A', dur: '2s' },
    { id: 'mumbai', name: 'MUMBAI', coords: [72.8777, 19.0760], color: '#1DB05A', dur: '2.3s' },
    { id: 'bengaluru', name: 'BENGALURU', coords: [77.5946, 12.9716], color: '#1DB05A', dur: '1.9s' },
    { id: 'kolkata', name: 'KOLKATA', coords: [88.3639, 22.5726], color: '#1DB05A', dur: '2.4s' },
    { id: 'hyderabad', name: 'HYD', coords: [78.4867, 17.3850], color: '#F47220', dur: '2.1s' },
    { id: 'ahmedabad', name: 'AHMD', coords: [72.5714, 23.0225], color: '#1DB05A', dur: '1.8s' },
    { id: 'chennai', name: 'CHENNAI', coords: [80.2707, 13.0827], color: '#1DB05A', dur: '2.2s' }
  ].map(c => ({ ...c, proj: projection(c.coords as [number, number]) || [0, 0] }));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={isHero ? "mg" : "mg2"} cx="26%" cy="37%" r="55%">
          <stop offset="0%" stopColor="#F47220" stopOpacity={isHero ? "0.07" : "0.06"} />
          <stop offset="100%" stopColor={isHero ? "#FFFFFF" : "#F5F4F0"} stopOpacity="0" />
        </radialGradient>
        <filter id="gl3">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={width} height={height} fill={`url(#${isHero ? "mg" : "mg2"})`} />

      <g className="states">
        {geoData.features.map((d: any, i: number) => {
          const stateName = d.properties.st_nm?.replace(/ /g, "_")?.replace(/&/g, "and");
          let fillClass = "sp";
          if (stateName === "Rajasthan") fillClass += " hq";
          else if (['Maharashtra', 'Gujarat', 'Karnataka'].includes(stateName)) fillClass += " gh";
          else if (['Jammu_and_Kashmir', 'Haryana'].includes(stateName)) fillClass += " sh";
          else if (['Arunachal_Pradesh', 'Assam', 'Meghalaya', 'Nagaland', 'Manipur', 'Mizoram', 'Tripura', 'Lakshadweep', 'Andaman_and_Nicobar'].includes(stateName)) fillClass += " ne";

          return (
            <path
              key={i}
              d={pathGenerator(d) || ''}
              className={fillClass}
              data-s={d.properties.st_nm}
              stroke="#fff"
              strokeWidth="0.8"
              style={{ transition: '0.2s' }}
            />
          );
        })}
      </g>

      {cities.map((c, i) => (
        <line
          key={`l-${i}`}
          x1={hqCoords[0]}
          y1={hqCoords[1]}
          x2={c.proj[0]}
          y2={c.proj[1]}
          stroke={c.color}
          strokeWidth="1.2"
          strokeDasharray="5 4"
          opacity={c.color === '#F47220' ? ".42" : ".58"}
        >
          <animate attributeName="stroke-dashoffset" values="0;-18" dur="1.2s" repeatCount="indefinite" />
        </line>
      ))}

      <g filter="url(#gl3)">
        {cities.map((c, i) => (
          <circle key={`c-${i}`} cx={c.proj[0]} cy={c.proj[1]} r="4" fill={c.color}>
            <animate attributeName="r" values="2.5;5.5;2.5" dur={c.dur} repeatCount="indefinite" />
          </circle>
        ))}
        <circle cx={hqCoords[0]} cy={hqCoords[1]} r={isHero ? "7" : "8"} fill="none" stroke="#F47220" strokeWidth=".7">
          <animate attributeName="r" values={isHero ? "7;40" : "8;44"} dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values=".7;0" dur="2.8s" repeatCount="indefinite" />
        </circle>
        {isHero && (
          <circle cx={hqCoords[0]} cy={hqCoords[1]} r="5" fill="none" stroke="#F47220" strokeWidth=".7">
            <animate attributeName="r" values="4;24" dur="2.8s" begin=".8s" repeatCount="indefinite" />
            <animate attributeName="opacity" values=".6;0" dur="2.8s" begin=".8s" repeatCount="indefinite" />
          </circle>
        )}
        <circle cx={hqCoords[0]} cy={hqCoords[1]} r={isHero ? "7" : "8"} fill="#F47220" />
        <circle cx={hqCoords[0]} cy={hqCoords[1]} r={isHero ? "3.5" : "4"} fill="white" />
      </g>

      {cities.map((c, i) => {
        const yOffset = c.id === 'delhi' ? -6 : c.id === 'mumbai' ? 10 : c.id === 'bengaluru' ? 15 : c.id === 'kolkata' ? -5 : c.id === 'hyderabad' ? 15 : c.id === 'ahmedabad' ? -5 : c.id === 'chennai' ? 18 : 0;
        const xOffset = c.id === 'mumbai' ? -35 : c.id === 'ahmedabad' ? -42 : c.id === 'delhi' ? 10 : 8;

        return (
          <text key={`t-${i}`} x={c.proj[0] + xOffset} y={c.proj[1] + yOffset} fontFamily="Rajdhani" fontSize="9" fontWeight="600" fill="rgba(26,30,46,.6)" letterSpacing=".8">
            {c.name}
          </text>
        )
      })}

      <text x={hqCoords[0] - 35} y={hqCoords[1] + 16} fontFamily="Rajdhani" fontSize="12" fontWeight="700" fill="#F47220" letterSpacing="1.5">
        {isHero ? "JAIPUR" : "JAIPUR HQ"}
      </text>
      {isHero && (
        <text x={hqCoords[0] - 34} y={hqCoords[1] + 29} fontFamily="Rajdhani" fontSize="7" fill="rgba(244,114,32,.7)" letterSpacing="1.5">HEADQUARTERS</text>
      )}
    </svg>
  );
}
