import useStore from '../hooks/useStore'

const SEED = [
  { id: 1, setting_name: 'app_name',      setting_value: 'Dewan Ekonomi Nasional' },
  { id: 2, setting_name: 'app_version',   setting_value: '1.0.0' },
  { id: 3, setting_name: 'app_env',       setting_value: 'production' },
  { id: 4, setting_name: 'max_file_size', setting_value: '10MB' },
]

export default function PengaturanView() {
  const { data } = useStore('den_settings', SEED)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">Pengaturan Sistem</h1>
        <p className="text-sm text-gray-500 mt-0.5">Konfigurasi dan informasi sistem DEN Dashboard</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Daftar Pengaturan</h2>
          <p className="text-sm text-gray-500 mt-0.5">Nilai konfigurasi sistem (read-only)</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-12">No</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nama Setting</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item, idx) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-400">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <code className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded">{item.setting_name}</code>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-800">{item.setting_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
          {data.length} pengaturan
        </div>
      </div>
    </div>
  )
}
