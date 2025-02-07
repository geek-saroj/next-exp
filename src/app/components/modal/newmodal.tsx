import { useModal } from '@ebay/nice-modal-react';
import React from 'react';


interface ModalProps {
  title: string;
  content: string;
  onClose?: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, content, onClose }) => {
  const modal = useModal();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <p className="text-sm mb-4">{content}</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          onClick={onClose || modal.remove} // Close modal when clicked
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
