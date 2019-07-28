/**
 * Created by Monika on 2017/9/20.
 */
let a = 500;
let b = 1000;

let oldTime1 = new Date().getTime();
for(let j  =0;j<b;j++){
    for(let i  =0;i<a;i++){
        console.log("打印1，-------", i + j);
    }
}
let newTime1 =  new Date().getTime();

let oldTime = new Date().getTime();
for(let i  =0;i<a;i++){
    for(let j  =0;j<b;j++){
        console.log("打印0，-------", i + j);
    }
}
let newTime =  new Date().getTime();

console.log("----2内层循环为50--",oldTime1,newTime1,newTime1-oldTime1);
console.log("----1内层循环为100--",oldTime,newTime,newTime-oldTime);
