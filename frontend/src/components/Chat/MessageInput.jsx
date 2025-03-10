import React, { useState, useRef } from 'react';
import { FiSend, FiImage, FiFilm, FiMic, FiPaperclip } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MessageInput = ({ onSendMessage, onSendMediaMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Si hay un archivo seleccionado, enviarlo junto con el mensaje
    if (selectedFile) {
      handleSendMedia();
      return;
    }
    
    // Si no hay archivo, enviar mensaje de texto normal
    if (message.trim() && !disabled && !isUploading) {
      onSendMessage(message);
      setMessage('');
    }
  };
  
  const handleKeyDown = (e) => {
    // Enviar con Enter, nueva línea con Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validar tamaño máximo (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }
    
    setSelectedFile(file);
    
    // Crear vista previa
    const fileType = file.type;
    if (fileType.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target.result);
      reader.readAsDataURL(file);
    } else if (fileType.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else if (fileType.startsWith('audio/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      // Para otros tipos de archivos, mostrar solo el nombre
      setPreviewUrl(null);
    }
  };
  
  const handleSendMedia = async () => {
    if (!selectedFile || disabled) return;
    
    setIsUploading(true);
    
    try {
      // Convertir archivo a base64
      const fileBase64 = await convertFileToBase64(selectedFile);
      
      // Enviar archivo al servidor
      await onSendMediaMessage({
        fileData: fileBase64.split(',')[1], // Remover la parte "data:image/jpeg;base64,"
        fileType: selectedFile.type,
        fileName: selectedFile.name,
        messageText: message
      });
      
      // Limpiar estado
      setMessage('');
      setSelectedFile(null);
      setPreviewUrl(null);
      
      // Resetear input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error al enviar archivo:', error);
      toast.error('Error al enviar el archivo');
    } finally {
      setIsUploading(false);
    }
  };
  
  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };
  
  const cancelMediaUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Renderizar vista previa del archivo seleccionado
  const renderPreview = () => {
    if (!previewUrl && !selectedFile) return null;
    
    return (
      <div className="p-2 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            {selectedFile?.name}
          </span>
          <button
            onClick={cancelMediaUpload}
            className="text-red-500 text-sm hover:text-red-700"
          >
            Cancelar
          </button>
        </div>
        
        {previewUrl && selectedFile?.type.startsWith('image/') ? (
          <div className="relative h-32 bg-gray-100 rounded">
            <img
              src={previewUrl}
              alt="Vista previa"
              className="h-full max-w-full mx-auto object-contain rounded"
            />
          </div>
        ) : previewUrl && selectedFile?.type.startsWith('video/') ? (
          <div className="relative h-32 bg-gray-100 rounded">
            <video
              src={previewUrl}
              controls
              className="h-full max-w-full mx-auto object-contain rounded"
            />
          </div>
        ) : previewUrl && selectedFile?.type.startsWith('audio/') ? (
          <div className="bg-gray-100 p-2 rounded">
            <audio src={previewUrl} controls className="w-full" />
          </div>
        ) : (
          <div className="flex items-center p-2 bg-gray-100 rounded">
            <FiPaperclip className="mr-2" />
            <span>{selectedFile?.name}</span>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col w-full">
      {renderPreview()}
      
      <form onSubmit={handleSubmit} className="flex">
        <div className="flex space-x-2 mr-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,video/*,audio/*"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
            title="Enviar imagen"
          >
            <FiImage size={20} />
          </button>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
            title="Enviar video"
          >
            <FiFilm size={20} />
          </button>
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="p-2 text-gray-500 hover:text-blue-500 disabled:opacity-50"
            title="Enviar audio"
          >
            <FiMic size={20} />
          </button>
        </div>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={disabled ? "Inicia sesión para enviar mensajes" : "Escribe un mensaje..."}
          disabled={disabled || isUploading}
          className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button
          type="submit"
          disabled={(!message.trim() && !selectedFile) || disabled || isUploading}
          className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isUploading ? (
            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
          ) : (
            <FiSend />
          )}
        </button>
      </form>
      
      {!isUploading && disabled && (
        <p className="text-xs text-center text-gray-500 mt-2">
          Debes <a href="/login" className="text-blue-500">iniciar sesión</a> para enviar mensajes
        </p>
      )}
    </div>
  );
};

export default MessageInput;