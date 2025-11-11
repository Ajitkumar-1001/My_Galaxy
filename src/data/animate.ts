// import {useMemo} from 'react'; 


export const containerprops_fade: any = {
    hidden : { opacity : 0 },
    visible : { opacity : 1 , transition : {duration : 0.3 , staggerChildren : 0.15 ,when: "beforeChildren", delay : 0.1, ease: "easeOut"} }
};

export const contentprops_fade: any = {
    hidden: {opacity : 0 },
    visible : {opacity : 1, transition : {duration: 0.3 , ease:"easeOut"}}
};

export const Containerhide : any = {
    hidden : {opacity: 0 , scale: 0},
    visible: { opacity : 1 , scale: 1 , transition : { duration : 0.3, ease:"easeOut",when: "beforeChildren", delay : 0.1,staggerChildren : 0.2}}

};

export const motionVariant:any = {

    inital : {opacity : 0 , x: -45 },
    visible : { opacity: 1, x : 0 , transition : {duration : 0.4 , staggerChildren : 0.15,when: "beforeChildren", delay: 0.2, ease:"easeOut"}}

};

export const contentMotionVariant:any = {
    hidden : { opacity : 0 , x : 45},
    visible : { opacity : 1, x : 0 , transition : { duration : 0.3 , ease: "easeOut"}}
}; 

