import RecordForm from "@/components/RecordForm";

export default function AddPage() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Record</h1>
      <RecordForm />
    </div>
  );
}
