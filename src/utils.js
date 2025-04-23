export const getImageUrl = (path) => { 
    //console.log("URL: ", import.meta.url);
    //console.log(new URL(`/assets/${path}`, window.location.origin).href); 
    return new URL(`/assets/${path}`, window.location.origin).href; 
};