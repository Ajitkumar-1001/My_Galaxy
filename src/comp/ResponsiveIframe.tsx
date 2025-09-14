

export interface Props { 
    ratio?: number;
    src:string; 
    className?:string;
};



export default function ResponsiveIframe({src,ratio=21/20,className}:Props) {


    const style = { aspectRatio: `${ratio}` }; 

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl ${className}`}
      style={style}
    >
      <iframe
        className="absolute inset-0 h-full w-full border-0"
        src={src}
     
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        // allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}