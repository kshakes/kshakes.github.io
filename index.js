$(document).ready(function() {
    $("h3").mouseenter(function(evt) {
        var bgImage = "";

        if ($(this).hasClass("firstProject")) {
            bgImage = "./images/mts-short-preview.gif";
        } else if ($(this).hasClass("secondProject")) {
            bgImage = "./images/life-calc-preview.gif";
        } else if ($(this).hasClass("thirdProject")) {
            bgImage = "./images/mts-salary-preview.gif";
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

