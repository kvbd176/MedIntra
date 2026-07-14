import Card from "./Card";

function StatCard({ title, value }) {
  return (
    <Card>

      <div className="text-slate-400 text-xs uppercase tracking-widest">
        {title}
      </div>

      <div className="mt-4 text-4xl font-bold text-cyan-400">
        {value}
      </div>

    </Card>
  );
}

export default StatCard;