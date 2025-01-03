import { useState } from "react";
import Image from "next/image";
interface ImageModalProps {
  imageUrl: string;
}
const ImageModal: React.FC<ImageModalProps>  = ({ imageUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Thumbnail with lazy loading */}
      {/* <img
        src={imageUrl}
        alt="Preview"
        loading="lazy"
        onClick={openModal}
        style={{
          cursor: "pointer",
          maxWidth: "200px",
          borderRadius: "10px",
        }}
      /> */}
      <Image
        src={imageUrl||"null"}
        alt="Preview"
        width={500}
        height={500}
        onClick={openModal}
        placeholder="blur"
        blurDataURL="data:image/jpeg..."
        style={{
          width: 'auto',
          height: 'auto',      
          cursor: "pointer",
          maxWidth: "200px",
          borderRadius: "10px",
        }}
      />

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          {/* High-Resolution Image in Modal */}
          {/* <img
            src={imageUrl}
            alt="Full Preview"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0px 0px 0px rgba(255, 255, 255, 0.5)",
            }}
            onClick={(e) => e.stopPropagation()}
          /> */}

          <Image
            src={imageUrl||"null"}
            alt="Full Preview"
            layout="intrinsic"
            width={500}
            height={500}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'auto',
              height: 'auto',      
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "10px",
              boxShadow: "0px 0px 0px rgba(255, 255, 255, 0.5)",
            }}
          />

          {/* Close Button */}
          <button
            onClick={closeModal}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "white",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              fontSize: "20px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.5)",
            }}
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
};

 export default ImageModal;
