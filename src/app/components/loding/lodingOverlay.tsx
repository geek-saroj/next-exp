import Image from "next/image";

const LoadingOverlay = ({ isVisible }: { isVisible: boolean }) => {
  return (
    <>
      {isVisible && (
        <div className="w-screen h-[500vh] bg-gray-700 bg-opacity-30 dark:bg-opacity-0 z-[100000] top-0 left-0 fixed">
          <div className="z-[100000] flex items-center justify-center w-screen h-screen fixed top-0 left-0">
            <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-accent-dark dark:border-white"></div>
            <Image
              alt="loader"
              src="https://st.depositphotos.com/1842549/4804/i/450/depositphotos_48040035-stock-photo-thermometer-icon.jpg"
              width={100}
              height={100}
              className="hidden dark:block"
            />
            <Image
              alt="loader"
              src="https://st.depositphotos.com/1842549/4804/i/450/depositphotos_48040035-stock-photo-thermometer-icon.jpg"
              width={100}
              height={100}
              className="block dark:hidden"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingOverlay;
