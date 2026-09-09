import { Button } from "../components/ui/button";
import {
  Dialog,
//   DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
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
          <Button className={`w-25 h-8 bg-blue-600 ${className ?? ' '}`} variant="outline">{button}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-7xl md:max-w-10xl backdrop-blur bg-transparent h-[75dvh] overflow-hidden flex flex-col">
            <DialogTitle className="sr-only">{button || "Project preview"}</DialogTitle>
            <DialogDescription className="sr-only">
              Live preview of the project, embedded below.
            </DialogDescription>
            <div className="flex flex-col items-center flex-1 min-h-0 w-full">
                <ResponsiveIframe src={source} ratio={ratio} className="h-[85%] md:h-auto" />
            </div>
        
        
          
            
          
        </DialogContent>
      </Dialog>

  );
};
