import { Button } from "../components/ui/button";
import {
  Dialog,
//   DialogClose,
  DialogContent,
 
  DialogTrigger,
} from "../components/ui/dialog";
import ResponsiveIframe from "./ResponsiveIframe";



export interface Demolinks { 
    source : string,
    className?: string, 
    title?: string,
    button?: string,
    ratio?:number,

}

export default function DialogDemo({source,className,button,ratio}:Demolinks) {
  return (
    
      <Dialog>
    
        <DialogTrigger asChild>
          <Button className={`w-25 h-8 bg-gradient-to-tr from-indigo-500 to-blue-800 ${className ?? ' '}`} variant="outline">{button}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-7xl md:max-w-10xl backdrop-blur bg-transparent h-[80vh] md:h-auto">
            <div className="flex flex-col items-center p-2 mx-auto max-w-10xl w-full h-full">
                <ResponsiveIframe src={source} ratio={ratio} />
            </div>
        
        
          
            
          
        </DialogContent>
      </Dialog>

  );
};
