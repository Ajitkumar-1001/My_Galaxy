

export interface Props { 
    ratio?: number;
    src:string; 
    className?:string;
};



export default function ResponsiveIframe({src,ratio=21/16,className}:Props) {


    const style = { aspectRatio: `${ratio}` }; 

  return (
    <div
      className={`relative w-full overflow-hidden max-w-6xl rounded-xl ${className}`}
      style={style}
    >
      <iframe
        className="absolute inset-0 h-full sw-full border-0"
        src={src}
     
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        // allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}