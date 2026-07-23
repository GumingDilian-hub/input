let book;



async function loadBook(){


book =
await fetch(
"data/book.json"
)
.then(
r=>r.json()
);



let html="";



for(
let chapter of book.chapters
){


html +=
await loadChapter(chapter);



}



document
.getElementById(
"article"
)
.innerHTML=html;



generateTOC();



}



async function loadChapter(chapter){



let result="";



/*
有子章节
*/


if(chapter.children){


result +=
`
<section class="chapter">

<h1>
${chapter.nickname}
</h1>


<h2>
${chapter.title}
</h2>

`;



for(
let child of chapter.children
){


let md =
await fetch(child.file)
.then(
r=>r.text()
);



result +=

`

<div class="section">


<h2>
${child.title}
</h2>


${markdownToHTML(md)}


</div>


`;



}



result+="</section>";



}


/*
普通章节
*/


else{


let md=

await fetch(chapter.file)
.then(
r=>r.text()
);



result +=

`

<section class="chapter">

<h1>
${chapter.nickname || ""}
</h1>


<h2>
${chapter.title}
</h2>


${markdownToHTML(md)}



</section>


`;



}



return result;



}






loadBook();
