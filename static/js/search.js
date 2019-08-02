summaryInclude=60;
var fuseOptions = {
  shouldSort: true,
  includeMatches: true,
  threshold: 0.0,
  tokenize:true,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 3,
  keys: [
    {name:"title",weight:0.8},
    {name:"contents",weight:0.5},
    {name:"tags",weight:0.3}
  ]
};



var searchQuery = param("s");
if(searchQuery){
  $("#search-query").val(searchQuery);
  $('#search-results').html('<div class="search_please_wait" style="width:100%"><p>Please wait.</p>');
  executeSearch(searchQuery);
}else {
  $('#search-results').append('<div class="search_nomatch"><p>Please enter a word or phrase above</p></div>');
}



function executeSearch(searchQuery){
  $.getJSON( "/index.json", function( data ) {
    var pages = data;
    var fuse = new Fuse(pages, fuseOptions);
    var result = fuse.search(searchQuery);
    console.log({"matches":result});
    $('#search-results').html('<div class="search_please_wait"><p>Please wait.</p></div>');
    setTimeout(() => {    
    if(result.length > 0){  
      $('#search-results').html("");  
        populateResults(result);      
    }else{
      $('#search-results').html(""); 
      $('#search-results').append('<div class=" search_nomatch" ><p>No matches found</p></div>');
    }
  }, 1000);
  });
}

function populateResults(result){
  $.each(result,function(key,value){
    var contents= value.item.contents;
    var snippet = "";
    var snippetHighlights=[];
    
    var tags =[];
    if( fuseOptions.tokenize ){
      
      snippetHighlights.push(searchQuery);
    }else{
      //console.log(value.matches);
      $.each(value.matches,function(matchKey,mvalue){
        if(mvalue.key == "tags"){
          snippetHighlights.push(mvalue.value);
        }else if(mvalue.key == "contents"){
          start = mvalue.indices[0][0]-summaryInclude>0?mvalue.indices[0][0]-summaryInclude:0;
          end = mvalue.indices[0][1]+summaryInclude<contents.length?mvalue.indices[0][1]+summaryInclude:contents.length;
          snippet += contents.substring(start,end);
          snippetHighlights.push(mvalue.value.substring(mvalue.indices[0][0],mvalue.indices[0][1]-mvalue.indices[0][0]+1));
        }
      });
    }

    if(snippet.length<1){
      snippet += contents.substring(0,summaryInclude*2);
    }
    //pull template from hugo templarte definition
    var templateDefinition = $('#search-result-template').html();
    //console.log(templateDefinition);
    if(templateDefinition == null || templateDefinition == 'undefined')
    {
      templateDefinition = '<section class="card blog-card search-match"><article class="card-body"><div id="summary-${key}"><h4><a href="${link}">${title}</a></h4><p>${snippet}</p>${ isset tags }<p>Tags: ${tags}</p>${ end }'; 
      templateDefinition += '<p><b>Categories:</b><span class="search-categories">${categories}</span></p>';
      templateDefinition += '<p><a href="${link}" class="search-read">Read More</a></p></div></article></section>';
    }
   // console.log(templateDefinition);
    //console.log($('#search-result-template').html());
    //console.log(templateDefinition);
    //replace values
    var output = render(templateDefinition,
                    {
                      key:key,
                      title:value.item.title,
                      link:value.item.permalink,
                      tags:value.item.tags,
                      categories:value.item.categories,
                      snippet:snippet,
                      contents:contents,
                      featuredimage:value.item.featuredimage,
                      slug:value.item.slug,
                      twitterUrl:value.item.twitterUrl,
                      dateTime:value.item.dateTime
                    });
    $('#search-results').append(output);

  

  });
}

function param(name) {
    return decodeURIComponent((location.search.split(name + '=')[1] || '').split('&')[0]).replace(/\+/g, ' ');
}

function render(templateString, data) {
  var conditionalMatches,conditionalPattern,copy;
  conditionalPattern = /\$\{\s*isset ([a-zA-Z]*) \s*\}(.*)\$\{\s*end\s*}/g;
  //since loop below depends on re.lastInxdex, we use a copy to capture any manipulations whilst inside the loop
  copy = templateString;
  while ((conditionalMatches = conditionalPattern.exec(templateString)) !== null) {
    if(data[conditionalMatches[1]]){
      //valid key, remove conditionals, leave contents.
      copy = copy.replace(conditionalMatches[0],conditionalMatches[2]);
    }else{
      //not valid, remove entire section
      copy = copy.replace(conditionalMatches[0],'');
    }
  }
  templateString = copy;
  //now any conditionals removed we can do simple substitution
  var key, find, re;
  for (key in data) {
    find = '\\$\\{\\s*' + key + '\\s*\\}';
    re = new RegExp(find, 'g');
    templateString = templateString.replace(re, data[key]);
  }
  return templateString;
}
