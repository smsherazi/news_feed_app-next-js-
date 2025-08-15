import ClientApp from "@/Components/ClientApp";
import { Toaster } from "react-hot-toast";

export default function Home() {
    
 return(
    <>
  <ClientApp/>
  <Toaster position="top-center" reverseOrder={false}/>
  </>
 )
}
