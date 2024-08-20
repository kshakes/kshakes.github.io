$(document).ready(function() {
    $("h3").mouseenter(function(evt) {
        var bgImage = "";

        if ($(this).hasClass("firstProject")) {
            bgImage = "./images/mts-short-example.gif";
        } else if ($(this).hasClass("secondProject")) {
            //bgImage = "./images/second-project-image.jpg";
        } else if ($(this).hasClass("thirdProject")) {
            //bgImage = "./images/third-project-image.jpg";
        }

        $(this).closest(".card-cover").css({
            "background-image": `url('${bgImage}')`,
            "background-size": "cover",
            "background-position": "center"
        });

        $(this).css("opacity", "0");
    });

    $("h3").mouseleave(function(evt) {
        $(this).closest(".card-cover").css({
            "background-image": "",
        });

        $(this).css("opacity", "1");
    });
});

