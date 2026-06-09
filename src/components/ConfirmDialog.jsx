import Modal from './Modal'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title ?? 'Konfirmasi'}
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors cursor-pointer"
          >
            Hapus
          </button>
        </div>
      }
    >
      <p className="text-sm text-gray-600">{message ?? 'Apakah Anda yakin ingin menghapus data ini?'}</p>
    </Modal>
  )
}
