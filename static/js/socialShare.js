
function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString() + ';path=/';
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    if (key == 'personid' && !keyValue) {
        randomId = randomId();
        setCookie(key, randomId);
        return randomId;
    }
    return keyValue ? keyValue[2] : null;
}

function delete_cookie(name) {

    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
}

function randomId() {
    var length = 10;
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
$('.fb-share-push').on("click", function () {
    var post_id = $(this).attr("data-app");
    var slug = $(this).attr("data-slug");
    var title = $(this).attr("data-name");
    var this_var = $(this);
    var personid = getCookie('personid');
    var currentfbShare = this_var.find(".b").html();
    var updatedfbShare = parseInt(currentfbShare) + 1;

    if (personid != null) {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://test-graphql.medigy.com/graphql",
            "method": "POST",
            "headers": {
                "Content-Type": "application/x-www-form-urlencoded",
                "cache-control": "no-cache"
            },
            "data": {
                "query": 'mutation{\n  updatePromCount(type:"fbshare",inputData:"{\\"source\\": \\"https://www.brief.health/\\",\\"identifier\\": \\"' + post_id + '\\",\\"type\\": \\"Product\\",\\"personId\\": \\"e0900086-c153-11e8-9983-0d20fc029a28\\",\\"name\\": \\"HealtHIE Nevada\\",\\"status\\": \\"1\\",\\"productSlug\\": \\"healthie-nevada\\"}")\n}'

            }
        }
        console.log('mutation{\n  updatePromCount(type:"fbshare",inputData:"{\\"source\\": \\"https://www.brief.health/\\",\\"identifier\\": \\"' + post_id + '\\",\\"type\\": \\"Product\\",\\"personId\\": \\"e0900086-c153-11e8-9983-0d20fc029a28\\",\\"name\\": \\"HealtHIE Nevada\\",\\"status\\": \\"1\\",\\"productSlug\\": \\"healthie-nevada\\"}")\n}');
        $.ajax(settings).done(function (response) {
            console.log(response);

            this_var.find(".b").html(updatedfbShare);
        });
        this_var.find(".b").html(updatedfbShare);
    }
    else {
        $('#messageModal').html("");
        $('#messageModal').html("Please try to login!");
        $('#loginModalCenter').modal();

    }

});
