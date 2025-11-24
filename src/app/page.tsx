export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Fall 2025 Capacity Dashboard</h1>
        </div>
      </header>

      {/* Big Number */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-700">Total Seat Deficit</h2>
          <p className="text-5xl font-bold text-red-600">450 Seats</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Panel: Problem Areas */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">The Problem Areas</h3>
              <p className="text-sm text-gray-500 mb-4">Courses sorted by Deficit Size</p>
              <div className="space-y-3">
                <p className="text-sm">CS101: -45 Seats (Requires +2 Tutorials)</p>
                <p className="text-sm">MAT137: -20 Seats</p>
                {/* Add more as needed */}
              </div>
            </div>
          </div>

          {/* Main Center: Trend */}
          <div className="md:col-span-2 bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Total Waitlist Size</h3>
              <p className="text-sm text-gray-500 mb-4">Last 30 Days</p>
              <div className="h-64 bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">[Line Chart Placeholder]</p>
              </div>
            </div>
          </div>

          {/* Right Panel: Alerts */}
          <div className="bg-white shadow rounded-lg">
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Alerts</h3>
              <div className="space-y-3">
                <p className="text-sm text-orange-600">⚠️ 15 Students waiting > 30 Days in HIS100</p>
                <p className="text-sm text-green-600">📈 ECO101 saw +40% demand growth yesterday</p>
                {/* Add more alerts */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
