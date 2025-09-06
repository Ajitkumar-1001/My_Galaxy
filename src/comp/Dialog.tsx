import { Button } from "../components/ui/button";
import {
  Dialog,
//   DialogClose,
  DialogContent,
 
  DialogTrigger,
} from "../components/ui/dialog";

export interface Demolinks { 
    source : string,
    className?: string, 
    title?: string,
    button?: string,

}

export default function DialogDemo({source,className,title="Project Preview",button}:Demolinks) {
  return (
    
      <Dialog>
    
        <DialogTrigger asChild>
          <Button className={`w-25 h-8 bg-gradient-to-tr from-indigo-500 to-blue-800 ${className ?? ' '}`} variant="outline">{button}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-10xl md:max-w-8xl backdrop-blur bg-transparent">
            <div className="flex flex-col items-center p-2 mx-auto max-w-10xl w-full">
                <iframe className="flex flex-col items-center" width={1600} height={700} src={source} title={title} ></iframe>
            </div>
        
        
          
            
          
        </DialogContent>
      </Dialog>

  );
};
