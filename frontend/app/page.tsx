import LoginButton from "@/components/auth/LoginButton";
import logo from "@/public/logo.png"
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col h-full min-h-screen">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute top-0 rotate-180">
        <path fill="#cbdcaa" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
      <div className="z-30 max-w-2xl w-full h-[500px] flex flex-col gap-2 items-center justify-center m-auto border rounded-lg shadow-lime-200 shadow-lg">
        <Image src={logo} alt="logo" width={100} height={100} />
        <h2>Sign in to Biddermelon!</h2>
        <LoginButton />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
        <path fill="#cbdcaa" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
      </svg>
    </div>
  );
}
