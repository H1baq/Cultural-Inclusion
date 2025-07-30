import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer
} from "recharts";
import "./Insights.css";

const demographicTrends = [
  { month: "Jan", lgbtqi: 45, refugee: 67, women: 52, disabled: 23, creative: 34 },
  { month: "Feb", lgbtqi: 52, refugee: 73, women: 61, disabled: 28, creative: 41 },
  { month: "Mar", lgbtqi: 61, refugee: 89, women: 74, disabled: 35, creative: 48 },
  { month: "Apr", lgbtqi: 58, refugee: 82, women: 69, disabled: 31, creative: 45 },
  { month: "May", lgbtqi: 71, refugee: 95, women: 83, disabled: 41, creative: 57 },
  { month: "Jun", lgbtqi: 78, refugee: 108, women: 91, disabled: 47, creative: 63 },
];

const regionalData = [
  { region: "North", beneficiaries: 245, programs: 8 },
  { region: "South", beneficiaries: 189, programs: 6 },
  { region: "East", beneficiaries: 167, programs: 5 },
  { region: "West", beneficiaries: 198, programs: 7 },
  { region: "Central", beneficiaries: 312, programs: 12 },
];

const impactRadar = [
  { metric: "Employment", value: 78 },
  { metric: "Education", value: 85 },
  { metric: "Health", value: 72 },
  { metric: "Housing", value: 68 },
  { metric: "Finance", value: 91 },
  { metric: "Community", value: 89 },
];

const recommendations = [
  {
    title: "Expand Refugee Support Programs",
    description: "61% growth indicates high demand. Consider additional mental health and employment services.",
    priority: "High",
    impact: "High"
  },
  {
    title: "Strengthen Central Region Infrastructure",
    description: "High concentration of beneficiaries may strain resources. Scale support systems accordingly.",
    priority: "Medium",
    impact: "Medium"
  },
  {
    title: "Replicate Financial Inclusion Success",
    description: "91% success rate suggests effective methodology. Apply to other program areas.",
    priority: "Medium",
    impact: "High"
  },
  {
    title: "Address Housing Support Gap",
    description: "68% impact score is lowest. Investigate barriers and develop targeted interventions.",
    priority: "High",
    impact: "Medium"
  }
];

export default function Insights() {
  return (
    <div className="insights-container">
      <div className="header">
        <div>
          <h1>Insights & Analytics</h1>
          <p>Deep dive into demographic patterns and regional impact</p>
        </div>
        <div>
          <select>
            <option>Last 6 months</option>
            <option>Last year</option>
            <option>All time</option>
          </select>
        </div>
      </div>

      <div className="chart-card">
        <h2>📈 Demographic Trends Over Time</h2>
        <p>Monthly enrollment patterns by identity groups</p>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={demographicTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area dataKey="refugee" stackId="1" stroke="#7B61FF" fill="#7B61FF" fillOpacity={0.5} />
            <Area dataKey="women" stackId="1" stroke="#22D3EE" fill="#22D3EE" fillOpacity={0.5} />
            <Area dataKey="lgbtqi" stackId="1" stroke="#FB7185" fill="#FB7185" fillOpacity={0.5} />
            <Area dataKey="creative" stackId="1" stroke="#4ADE80" fill="#4ADE80" fillOpacity={0.5} />
            <Area dataKey="disabled" stackId="1" stroke="#A78BFA" fill="#A78BFA" fillOpacity={0.5} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-two">
        <div className="chart-card">
          <h2>📍 Regional Distribution</h2>
          <p>Beneficiaries and programs by region</p>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis type="number" dataKey="beneficiaries" name="Beneficiaries" />
              <YAxis type="number" dataKey="programs" name="Programs" />
              <Tooltip />
              <Scatter data={regionalData} fill="#7C3AED" />
            </ScatterChart>
          </ResponsiveContainer>
          <ul className="region-list">
            {regionalData.map((r) => (
              <li key={r.region}>
                <strong>{r.region}</strong>: {r.beneficiaries} beneficiaries, {r.programs} programs
              </li>
            ))}
          </ul>
        </div>

        <div className="chart-card">
          <h2>📊 Impact Assessment</h2>
          <p>Outcome metrics across key life areas</p>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={impactRadar}>
              <PolarGrid />
              <PolarAngleAxis dataKey="metric" />
              <PolarRadiusAxis angle={90} />
              <Radar name="Impact" dataKey="value" stroke="#7C3AED" fill="#7C3AED" fillOpacity={0.4} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="recommendations">
        <h2>🔍 Data-Driven Recommendations</h2>
        {recommendations.map((rec, index) => (
          <div key={index} className="recommendation-card">
            <h4>{rec.title}</h4>
            <p>{rec.description}</p>
            <span className={`tag ${rec.priority.toLowerCase()}`}>{rec.priority} Priority</span>
            <span className={`tag ${rec.impact.toLowerCase()}`}>{rec.impact} Impact</span>
          </div>
        ))}
      </div>
    </div>
  );
}
