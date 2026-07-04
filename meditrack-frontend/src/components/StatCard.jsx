import Card from "./Card";

function StatCard({ title, value }) {
  return (
    <Card>
      <h2 className="text-gray-500 text-sm">
        {title}
      </h2>

      <h3 className="text-3xl font-bold">
        {value}
      </h3>
    </Card>
  );
}

export default StatCard;