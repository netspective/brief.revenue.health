
$(document).ready(function () {
    loadMore.cur_page= $('input[name=pageId]').val();
    var has_next = 1;
    // $(window).scroll(function () {
    //     if ($(window).scrollTop() == $(document).height() - $(window).height()) {
    //     }
    // })
});
loadMore = {
    cur_page:0,
    has_next:1,
    
    loadCnt:function(){


            // ajax call get data from server and append to the div
            this.cur_page++;

            var nextPageUrl = '/page/' + this.cur_page;

            if (this.has_next != 1) {
                return false;
            }
            $.ajax({
                url: nextPageUrl,
                dataType: 'text', //this is to avoid jQuery running any <script> tags
                success: function (html) {
                    var currentContainer = $('#posts');
                    //create a temporary hidden element to attach the created document
                    //this is the simplest jQuery way to do this safely.
                    var tempDiv = $('<div>').appendTo(document.body).css('display', 'none');
                    tempDiv[0].innerHTML = html;
                    //find the container element in the new document
                    var newContainer = tempDiv.find('.card.blog-card.custom-card-row');
                    this.has_next = tempDiv.find('input[name=has_next]').val();

                    //replace the container on the current page with the new one
                    // currentContainer.replaceWith(newContainer);
                    console.log(newContainer);
                    $('main[id=search-results]').append(newContainer)
                    //remove the temporary element
                    tempDiv.remove();
                    //update the URL bar
                    if (window.history.pushState) {
                        window.history.pushState(null, null, nextPageUrl);
                    }
                    console.log("Successfully changed page to " + nextPageUrl);
                },
                error: function (xhr, status, error) {
                    console.error(xhr, status, error);
                    //default to non-JS behaviour and click-through as normal
                    window.location.href = nextPageUrl;
                }
            });
    }
}
function LoadMore(){
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           