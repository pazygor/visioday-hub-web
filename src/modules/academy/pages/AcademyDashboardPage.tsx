export const AcademyDashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          VisionDay Academy - Educação e Cursos 🎓
        </h1>
        <p className="text-gray-600">
          Plataforma de cursos e capacitação profissional
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Cursos Disponíveis</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Cursos Iniciados</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Cursos Concluídos</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Certificados</h3>
          <p className="text-3xl font-bold text-gray-900">0</p>
        </div>
      </div>

      {/* Info */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <p className="text-purple-800 font-medium">
          🚀 Sistema VisionDay Academy em construção
        </p>
        <p className="text-purple-600 text-sm mt-2">
          Esta é a estrutura base da plataforma de cursos e capacitação.
        </p>
      </div>
    </div>
  )
}
