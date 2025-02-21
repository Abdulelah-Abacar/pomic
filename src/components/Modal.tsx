function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* Modal Content */}
      <div className="bg-[#0a0a0a]/20 bg-gradient-to-br from-[#1B1B1B] to-[#14151F] w-full max-w-lg mx-auto p-5 rounded-lg shadow-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-lg font-bold"
          aria-label="Close"
        >
          ✖
        </button>

        {/* Render children */}
        {children}
      </div>
    </div>
  );
}

export default Modal;
