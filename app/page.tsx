import PlanForm from "@/components/PlanForm";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-2 font-serif text-4xl font-bold tracking-tight text-[#2C6E49]">
            Prepr
          </h1>
          <p className="text-[#6B6B6B]">
            Tell us your preferences and we&apos;ll build your week.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <PlanForm />
        </div>
      </div>
    </div>
  );
}
