import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ScoreChartProps {
  data: { date: string; score: number }[];
}

export const ScoreChart = ({ data }: ScoreChartProps) => {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} />
          <YAxis stroke="#ffffff50" fontSize={12} domain={[0, 100]} />
          <Tooltip
            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #ffffff20', borderRadius: '8px' }}
            itemStyle={{ color: '#818cf8' }}
          />
          <Line type="monotone" dataKey="score" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
