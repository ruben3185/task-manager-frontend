export default function Alert({ message, type = "info" }) {
  const colors = {
    info: "bg-blue-100 text-blue-800",
    error: "bg-red-100 text-red-800",
    success: "bg-green-100 text-green-800",
  };

  return (
    <div className={`p-3 mb-4 rounded ${colors[type]} border`}>
      {message}
    </div>
  );
}
