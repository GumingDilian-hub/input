function generateTOC(){



let article =

document.getElementById(
"article"
);



let titles =

article.querySelectorAll(
"h1,h2,h3"
);



let html="";



titles.forEach(
(title,index)=>{


let id=
"heading-"+index;



title.id=id;



html +=

`

<div class="toc-item">

<a href="#${id}">

${title.innerText}

</a>


</div>


`;


}

);



document
.getElementById(
"toc"
)
.innerHTML=html;



}
