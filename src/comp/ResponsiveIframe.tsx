

export interface Props { 
    ratio?: number;
    src:string; 
    className?:string;
};



export default function ResponsiveIframe({src,ratio=21/16,className}:Props) {


    const style = { aspectRatio: `${ratio}` }; 

  return (
    <div
      className={`relative w-full inset-0 w-full h-[75%] h-full overflow-hidden max-w-6xl rounded-xl ${className}`}
      style={style}
    >
      <iframe
        className="absolute inset-0 w-full h-full md:h-full h-[75%] border-0"
        src={src}

        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        // allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}