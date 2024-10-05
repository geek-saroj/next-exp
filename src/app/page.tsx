import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-screen m-8">
        <div className="bg-red-500 w-full h-full ">
          <div className="bg-red-500 grid grid-cols-12 w-full h-full gap-5">
            <div className="bg-orange-500 col-span-3 text-center ">
              <p>image</p>
            </div>

            <div className="bg-green-500 col-span-4 items-center ">
              <p>text</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-500 w-full h-full">
          <div className="bg-purple-500 grid grid-cols-12 w-full h-full gap-5">
            <div className="col-span-6 bg-white"></div>
            <div className="col-span-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}
