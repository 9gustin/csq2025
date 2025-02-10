import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 text-gray-900">
          Cosquín Rock 2024
        </h1>
        <div className="text-center space-y-4">
          <p className="text-xl text-gray-600 mb-12">
            15 y 16 de Febrero
          </p>
          
          <div className="grid gap-6 max-w-xl mx-auto">
            <Link 
              href="/dia1"
              className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Día 1</h2>
              <p className="text-gray-600">15 de Febrero</p>
            </Link>

            <Link 
              href="/dia2"
              className="block p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Día 2</h2>
              <p className="text-gray-600">16 de Febrero</p>
            </Link>
          </div>

          <div className="mt-12 text-sm text-gray-500">
            <p>Selecciona un día para ver la programación y armar tu agenda</p>
          </div>
        </div>
      </div>
    </div>
  );
} 