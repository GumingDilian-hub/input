let currentChapter="000";



function resolveImage(src){


/*

以后根据章节自动寻找

images/

章节/

图片


*/


if(
src.startsWith("/")
){

return src;

}



return 
"images/"+

currentChapter+

"/"+

src;


}
