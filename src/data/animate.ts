// import {useMemo} from 'react'; 


export const containerprops_fade: any = {
    hidden : { opacity : 0 }, 
    visible : { opacity : 1 , transition : {duration : 1.2 , staggerChildren : 0.5 ,when: "beforeChildren", delay : 0.2, ease: "easeIn"} } 
};

export const contentprops_fade: any = {
    hidden: {opacity : 0 }, 
    visible : {opacity : 1, transition : {duration:1 , ease:"easeIn"}}
};

export const Containerhide : any = { 
    hidden : {opacity: 0 , scale: 0},
    visible: { opacity : 1 , scale: 1 , transition : { duration : 1, ease:"easeInOut",when: "beforeChildren", delay : 0.1,staggerChildren : 0.6}}

};

export const motionVariant:any = { 

    inital : {opacity : 0 , x: -45 },
    visible : { opacity: 1, x : 0 , transition : {duration : 1.2 , staggerChildren : 0.5,when: "beforeChildren", delay: 0.5, ease:"easeIn"}}

}; 

export const contentMotionVariant:any = { 
    hidden : { opacity : 0 , x : 45}, 
    visible : { opacity : 1, x : 0 , transition : { duration :1 , ease: "easeIn"}}
}; 

