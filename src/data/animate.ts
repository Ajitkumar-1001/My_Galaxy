// import {useMemo} from 'react'; 


export const containerprops_fade: any = {
    hidden : { opacity : 0 }, 
    visible : { opacity : 1 , transition : {duration : 1.2 , staggerChildren : 0.5 , delay : 0.2, ease: "easeIn"} } 
};

export const contentprops_fade: any = {
    hidden: {opacity : 0 }, 
    visible : {opacity : 1, transition : {duration:1 , ease:"easeIn"}}
};